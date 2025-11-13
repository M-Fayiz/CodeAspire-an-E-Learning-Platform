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
  // ✅ Persistent references
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  const init = async (deps: RTCDeps) => {
    if (!socket) throw new Error("Socket not initialized");

    // Initialize PeerConnection if not already
    if (!pcRef.current) {
      pcRef.current = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });
    }
    const pc = pcRef.current;

    // Create local stream once
    if (!localStreamRef.current) {
      try {
        localStreamRef.current = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
      } catch {
        toast.error("Please allow camera and mic access.");
        throw new Error("Permission denied");
      }
    }
    const localStream = localStreamRef.current;

    // Attach local and remote video
    const remoteStream = new MediaStream();
    deps.remoteVideo.srcObject = remoteStream;
    deps.localVideo.srcObject = localStream;

    // Tracks
    localStream.getTracks().forEach((t) => pc!.addTrack(t, localStream));

    pc!.ontrack = (e) => {
      e.streams[0].getTracks().forEach((t) => remoteStream.addTrack(t));
    };

    // ICE candidates
    pc!.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("video:ice-candidate", {
          roomId: deps.roomId,
          candidate: e.candidate,
          from: deps.userId,
        });
      }
    };

    // Connection state changes
    pc!.onconnectionstatechange = () => {
      const s = pc!.connectionState;
      if (s === "connected") deps.onConnected?.();
      if (["disconnected", "failed", "closed"].includes(s))
        deps.onDisconnected?.();
    };

    // Signaling
    socket.on("video:offer", async ({ sdp }) => {
      await pc!.setRemoteDescription(new RTCSessionDescription(sdp));
      const answer = await pc!.createAnswer();
      await pc!.setLocalDescription(answer);
      socket.emit("video:answer", {
        roomId: deps.roomId,
        sdp: answer,
        from: deps.userId,
      });
    });

    socket.on("video:answer", async ({ sdp }) => {
      await pc!.setRemoteDescription(new RTCSessionDescription(sdp));
    });

    socket.on("video:ice-candidate", async ({ candidate }) => {
      try {
        await pc!.addIceCandidate(candidate);
      } catch (err) {
        console.error("ICE add failed", err);
      }
    });

    socket.on("video:peer-joined", ({ peerId }) => {
      if (peerId !== deps.userId) void call(deps.roomId, deps.userId);
    });

    socket.emit("video:join", { roomId: deps.roomId });
  };

  const call = async (roomId: string, userId: string) => {
    const pc = pcRef.current;
    if (!pc) return toast.error("Peer connection not ready");

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit("video:offer", { roomId, sdp: offer, from: userId });
  };

  const hangup = async (roomId: string) => {
    const pc = pcRef.current;
    const localStream = localStreamRef.current;

    try {
      if (pc) {
        pc.close();
        pcRef.current = null;
        console.log("🛑 Peer connection closed.");
      }
      if (localStream) {
        localStream.getTracks().forEach((t) => t.stop());
        localStreamRef.current = null;
        console.log("🎙️ Local media tracks stopped.");
      }
      socket.emit("video:leave", { roomId });
    } catch (err) {
      console.warn("Hangup cleanup skipped:", err);
    }
  };

  const toggleMic = (mute: boolean) => {
    const localStream = localStreamRef.current;
    if (!localStream) return toast.error("Stream not initialized");
    localStream.getAudioTracks().forEach((t) => (t.enabled = !mute));
  };

  const toggleCamera = (off: boolean) => {
    const localStream = localStreamRef.current;
    if (!localStream) return toast.error("Stream not initialized");
    localStream.getVideoTracks().forEach((t) => (t.enabled = !off));
  };

  const shareScreen = async (on: boolean) => {
    const pc = pcRef.current;
    if (!pc) return toast.error("Join the call before sharing your screen.");

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

  return { init, call, hangup, shareScreen, toggleCamera, toggleMic };
};
