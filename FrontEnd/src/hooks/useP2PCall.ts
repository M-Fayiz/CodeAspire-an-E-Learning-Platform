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

  const init = async (deps: RTCDeps) => {
    if (!socket) throw new Error("Socket not initialized");
    if (initializedRef.current) {
      reset();
    }
    initializedRef.current = true;

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pcRef.current = pc;

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

    localStream.getTracks().forEach((t) => pc.addTrack(t, localStream));

    pc.ontrack = (e) => {
      e.streams[0].getTracks().forEach((t) => remoteStream.addTrack(t));
    };

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("video:ice-candidate", {
          roomId: deps.roomId,
          candidate: e.candidate,
          from: deps.userId,
        });
      }
    };
    pc.onconnectionstatechange = () => {
      const state = pc.connectionState;

      if (state === "connected") deps.onConnected?.();

      if (["disconnected", "failed", "closed"].includes(state)) {
        deps.onDisconnected?.();
        reset();
      }
    };

    socket.off("video:offer");
    socket.off("video:answer");
    socket.off("video:ice-candidate");
    socket.off("video:peer-joined");

    socket.off("video:peer-left");

    socket.on("video:offer", async ({ sdp, from }) => {
      if (from === deps.userId) return;
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

    socket.on("video:peer-leften", ({ reason }) => {
      console.warn("Forced leave:", reason);

      toast.error(reason || "Call ended");

      cleanupAndExit(deps.roomId);
    });

    socket.on("video:peer-joined", ({ userId: peerId }) => {
      if (peerId !== deps.userId) {
        const initiator = deps.userId < peerId;
        if (initiator) call(deps.roomId, deps.userId);
      }
    });
    socket.on("video:peer-left", () => {
      deps.onDisconnected?.();
      reset();
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

  const toggleMic = (mute: boolean) => {
    const stream = localStreamRef.current;
    if (!stream) return toast.error("Stream not initialized");
    stream.getAudioTracks().forEach((t) => (t.enabled = !mute));
  };

  const toggleCamera = (off: boolean) => {
    const stream = localStreamRef.current;
    if (!stream) return toast.error("Stream not initialized");
    stream.getVideoTracks().forEach((t) => (t.enabled = !off));
  };
  const reset = () => {
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }

    initializedRef.current = false;
  };

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

  const hangup = async (roomId: string) => {
    reset();
    socket.emit("video:leave", { roomId });
  };

  const cleanupAndExit = async (roomId?: string) => {
    const pc = pcRef.current;
    const localStream = localStreamRef.current;

    if (pc) {
      pc.close();
      pcRef.current = null;
    }

    if (localStream) {
      localStream.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }

    initializedRef.current = false;

    if (roomId) {
      socket.emit("video:leave", { roomId });
    }
  };

  return { init, call, hangup, toggleMic, toggleCamera, shareScreen };
};
