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
  const cameraTrackRef = useRef<MediaStreamTrack | null>(null);
  const iceQueueRef = useRef<RTCIceCandidate[]>([]);
  const initializedRef = useRef(false);

  // ================= INIT =================
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
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localStreamRef.current = stream;
      cameraTrackRef.current = stream.getVideoTracks()[0];

      deps.localVideo.srcObject = stream;

      const remoteStream = new MediaStream();
      deps.remoteVideo.srcObject = remoteStream;

      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      pc.ontrack = (event) => {
        event.streams[0].getTracks().forEach((track) => {
          remoteStream.addTrack(track);
        });
      };
    } catch {
      toast.error("Please allow camera and microphone access.");
      throw new Error("Permission denied");
    }

    // ============ ICE ============
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("video:ice-candidate", {
          roomId: deps.roomId,
          candidate: event.candidate,
        });
      }
    };

    // ============ CONNECTION STATE ============
    pc.onconnectionstatechange = () => {
      const state = pc.connectionState;

      if (state === "connected") {
        deps.onConnected?.();
      }

      if (["disconnected", "failed", "closed"].includes(state)) {
        deps.onDisconnected?.();
        reset();
      }
    };

    // ============ SOCKET HANDLERS ============
    const onOffer = async ({ sdp }: any) => {
      if (!pcRef.current) return;

      await pcRef.current.setRemoteDescription(sdp);

      const answer = await pcRef.current.createAnswer();
      await pcRef.current.setLocalDescription(answer);

      socket.emit("video:answer", {
        roomId: deps.roomId,
        sdp: answer,
      });

      // Flush queued ICE
      iceQueueRef.current.forEach((c) =>
        pcRef.current?.addIceCandidate(c)
      );
      iceQueueRef.current = [];
    };

    const onAnswer = async ({ sdp }: any) => {
      if (!pcRef.current) return;

      await pcRef.current.setRemoteDescription(sdp);

      iceQueueRef.current.forEach((c) =>
        pcRef.current?.addIceCandidate(c)
      );
      iceQueueRef.current = [];
    };

    const onIceCandidate = async ({ candidate }: any) => {
      if (!pcRef.current) return;

      if (!pcRef.current.remoteDescription) {
        iceQueueRef.current.push(candidate);
      } else {
        await pcRef.current.addIceCandidate(candidate);
      }
    };

    const onPeerLeft = () => {
      deps.onDisconnected?.();
      reset();
    };

    socket.on("video:offer", onOffer);
    socket.on("video:answer", onAnswer);
    socket.on("video:ice-candidate", onIceCandidate);
    socket.on("video:peer-left", onPeerLeft);

    socket.emit("video:join", { roomId: deps.roomId });
  };

  // ================= CALL (MENTOR ONLY FROM UI) =================
  const call = async (roomId: string) => {
    const pc = pcRef.current;
    if (!pc) return toast.error("Peer connection not ready");

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    socket.emit("video:offer", {
      roomId,
      sdp: offer,
    });
  };

  // ================= MEDIA CONTROLS =================
  const toggleMic = (mute: boolean) => {
    localStreamRef.current?.getAudioTracks().forEach(
      (track) => (track.enabled = !mute)
    );
  };

  const toggleCamera = (off: boolean) => {
    localStreamRef.current?.getVideoTracks().forEach(
      (track) => (track.enabled = !off)
    );
  };

  // ================= SCREEN SHARE =================
  const shareScreen = async (on: boolean) => {
    const pc = pcRef.current;
    if (!pc) return toast.error("Join the call first.");

    const sender = pc
      .getSenders()
      .find((s) => s.track?.kind === "video");

    if (!sender) return;

    try {
      if (on) {
        const screen = await navigator.mediaDevices.getDisplayMedia({
          video: true,
        });
        const screenTrack = screen.getVideoTracks()[0];

        await sender.replaceTrack(screenTrack);

        screenTrack.onended = () => {
          if (cameraTrackRef.current) {
            sender.replaceTrack(cameraTrackRef.current);
          }
        };
      } else {
        if (cameraTrackRef.current) {
          await sender.replaceTrack(cameraTrackRef.current);
        }
      }
    } catch {
      toast.error("Screen sharing failed.");
    }
  };

  // ================= CLEANUP =================
  const reset = () => {
    pcRef.current?.close();
    pcRef.current = null;

    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;

    initializedRef.current = false;
    iceQueueRef.current = [];
  };

  const hangup = async (roomId: string) => {
    reset();
    socket.emit("video:leave", { roomId });
  };

  return {
    init,
    call,
    hangup,
    toggleMic,
    toggleCamera,
    shareScreen,
  };
};
