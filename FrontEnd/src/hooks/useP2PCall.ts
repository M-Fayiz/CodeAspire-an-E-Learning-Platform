import { Socket } from "socket.io-client";
import { useRef } from "react";
import { toast } from "sonner";

interface RTCDeps {
  roomId: string;
  userId: string;
  localVideo: HTMLVideoElement;
  remoteVideo: HTMLVideoElement;
  onConnected?: () => void;
  onDisconnected?: () => void;
}

export const useP2PCall = (socket: Socket) => {
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const initializedRef = useRef(false);

  /** ✅ INIT: Start local stream, set up peer connection, attach listeners */
  const init = async (deps: RTCDeps) => {
    if (!socket) throw new Error("Socket not initialized");
    if (initializedRef.current) return; // Prevent re-initialization
    initializedRef.current = true;

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    pcRef.current = pc;

    // 1️⃣ Local Stream
    try {
      localStreamRef.current = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
    } catch {
      toast.error("Please allow camera and microphone access.");
      throw new Error("Permission denied");
    }

    const localStream = localStreamRef.current!;
    const remoteStream = new MediaStream();
    deps.localVideo.srcObject = localStream;
    deps.remoteVideo.srcObject = remoteStream;

    // Add local tracks
    localStream.getTracks().forEach((t) => pc.addTrack(t, localStream));

    // 2️⃣ Remote Tracks
    pc.ontrack = (e) => {
      e.streams[0].getTracks().forEach((t) => remoteStream.addTrack(t));
    };

    // 3️⃣ ICE Candidate
    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("video:ice-candidate", {
          roomId: deps.roomId,
          candidate: e.candidate,
          from: deps.userId,
        });
      }
    };

    // 4️⃣ Connection State
    pc.onconnectionstatechange = () => {
      const state = pc.connectionState;
      console.log("Connection state:", state);
      if (state === "connected") deps.onConnected?.();
      if (["disconnected", "failed", "closed"].includes(state))
        deps.onDisconnected?.();
    };

    // ✅ Remove any previous listeners before re-attaching
    socket.off("video:offer");
    socket.off("video:answer");
    socket.off("video:ice-candidate");
    socket.off("video:peer-joined");

    // 5️⃣ Signaling Events
    socket.on("video:offer", async ({ sdp, from }) => {
      if (from === deps.userId) return; // Ignore self
      await pc.setRemoteDescription(new RTCSessionDescription(sdp));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      socket.emit("video:answer", {
        roomId: deps.roomId,
        sdp: answer,
        from: deps.userId,
      });
    });

    socket.on("video:answer", async ({ sdp, from }) => {
      if (from === deps.userId) return;
      await pc.setRemoteDescription(new RTCSessionDescription(sdp));
    });

    socket.on("video:ice-candidate", async ({ candidate, from }) => {
      if (from === deps.userId) return;
      try {
        await pc.addIceCandidate(candidate);
      } catch (err) {
        console.error("Failed to add ICE candidate:", err);
      }
    });

    // 6️⃣ When peer joins → only one side sends offer (prevent race)
    socket.on("video:peer-joined", ({ userId: peerId }) => {
      if (peerId !== deps.userId) {
        const initiator = deps.userId < peerId; // simple rule
        if (initiator) call(deps.roomId, deps.userId);
      }
    });

    // 7️⃣ Join Room
    socket.emit("video:join", { roomId: deps.roomId });
  };

  /** 📞 CREATE OFFER */
  const call = async (roomId: string, userId: string) => {
    const pc = pcRef.current;
    if (!pc) return toast.error("Peer connection not ready");

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit("video:offer", { roomId, sdp: offer, from: userId });
  };

  /** 🔇 TOGGLE MIC */
  const toggleMic = (mute: boolean) => {
    const stream = localStreamRef.current;
    if (!stream) return toast.error("Stream not initialized");
    stream.getAudioTracks().forEach((t) => (t.enabled = !mute));
  };

  /** 📷 TOGGLE CAMERA */
  const toggleCamera = (off: boolean) => {
    const stream = localStreamRef.current;
    if (!stream) return toast.error("Stream not initialized");
    stream.getVideoTracks().forEach((t) => (t.enabled = !off));
  };

  /** 🖥️ SCREEN SHARE */
  const shareScreen = async (on: boolean) => {
    const pc = pcRef.current;
    if (!pc) return toast.error("Join the call first.");

    try {
      if (on) {
        const screen = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        const screenTrack = screen.getVideoTracks()[0];
        const sender = pc.getSenders().find((s) => s.track?.kind === "video");
        if (sender && screenTrack) {
          await sender.replaceTrack(screenTrack);
          screenTrack.onended = () => shareScreen(false);
        }
      } else {
        const cam = await navigator.mediaDevices.getUserMedia({ video: true });
        const camTrack = cam.getVideoTracks()[0];
        const sender = pc.getSenders().find((s) => s.track?.kind === "video");
        if (sender && camTrack) await sender.replaceTrack(camTrack);
      }
    } catch (err) {
      console.error("Screen share error:", err);
      toast.error("Failed to share screen. Please grant permission.");
    }
  };

  /** 🔚 HANGUP */
  const hangup = async (roomId: string) => {
    try {
      const pc = pcRef.current;
      const localStream = localStreamRef.current;

      if (pc) {
        pc.close();
        pcRef.current = null;
        console.log("🛑 Peer connection closed.");
      }

      if (localStream) {
        localStream.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;
        console.log("🎙 Local stream stopped.");
      }

      socket.emit("video:leave", { roomId });
      initializedRef.current = false;
    } catch (err) {
      console.error("Error during hangup:", err);
    }
  };

  return { init, call, hangup, toggleMic, toggleCamera, shareScreen };
};
