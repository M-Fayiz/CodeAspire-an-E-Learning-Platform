import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@/context/auth.context";
import { useSocket } from "@/hooks/useSocket";
import VideoService from "@/service/videoSession.service";
import { useP2PCall } from "@/hooks/useP2PCall";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  ScreenShare,
  ScreenShareOff,
  PhoneOff,
} from "lucide-react";

type CallState = "idle" | "connected" | "disconnected";

export const VideoRoom = () => {
  const { bookingId } = useParams();
  const { user } = useAuth();
  const socket = useSocket();
  const navigate = useNavigate();

  const localRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);

  const roomIdRef = useRef<string | null>(null);
  const hasHungUpRef = useRef(false);

  const [callState, setCallState] = useState<CallState>("idle");
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [sharing, setSharing] = useState(false);

  const { init, call, hangup, toggleMic, toggleCamera, shareScreen } =
    useP2PCall(socket!);

  // ================= SAFE HANGUP (DECLARED FIRST) =================
  const safeHangup = async () => {
    if (hasHungUpRef.current) return;
    hasHungUpRef.current = true;

    if (roomIdRef.current) {
      await hangup(roomIdRef.current);
    }
  };

  // ================= INIT =================
  useEffect(() => {
    if (!socket || !user) return;

    (async () => {
      try {
        const data = await VideoService.startVideoSession(bookingId!);
        roomIdRef.current = data.roomId;

        if (localRef.current && remoteRef.current) {
          await init({
            roomId: data.roomId,
            userId: user.id,
            localVideo: localRef.current,
            remoteVideo: remoteRef.current,
            onConnected: () => setCallState("connected"),
            onDisconnected: () => {
              // avoid resetting UI when user intentionally hangs up
              if (!hasHungUpRef.current) {
                setCallState("disconnected");
                setTimeout(() => setCallState("idle"), 300);
              }
            },
          });
        }
      } catch (err) {
        console.error("Video init failed:", err);
      }
    })();

    return () => {
      safeHangup();
    };
  }, [socket, user, bookingId]);

  // ================= ACTION HANDLERS =================
  const handleCall = async () => {
    if (!roomIdRef.current) return;
    if (user?.role !== "mentor") return;

    await call(roomIdRef.current);
  };

  const handleMic = () => {
    const next = !muted;
    toggleMic(next);
    setMuted(next);
  };

  const handleCam = () => {
    const next = !camOff;
    toggleCamera(next);
    setCamOff(next);
  };

  const handleShare = () => {
    const next = !sharing;
    shareScreen(next);
    setSharing(next);
  };

  const handleHangup = async () => {
    await safeHangup();

    if (user?.role === "mentor") {
      navigate("/mentor/booked-slot-list");
    } else {
      navigate("/learner/booked-slots");
    }
  };

  // ================= UI =================
  return (
    <div className="min-h-full bg-gray-50 p-6 flex flex-col items-center">
      <div className="relative w-full max-w-5xl aspect-video bg-black rounded-md overflow-hidden shadow-md mb-8">
        <video
          ref={remoteRef}
          autoPlay
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        <video
          ref={localRef}
          autoPlay
          playsInline
          muted
          className="absolute bottom-4 right-4 w-1/4 h-1/4 rounded-lg border-2 border-gray-200 object-cover"
        />
      </div>

      {callState !== "disconnected" && (
        <div className="flex flex-wrap gap-4 justify-center">
          {callState === "idle" && user?.role === "mentor" && (
            <button onClick={handleCall} className="btn-primary">
              Start Call
            </button>
          )}

          <button
            onClick={handleMic}
            className={`p-3 rounded-2xl ${
              muted ? "bg-red-500 text-white" : "bg-gray-200 text-gray-800"
            }`}
            title={muted ? "Unmute Mic" : "Mute Mic"}
          >
            {muted ? <MicOff /> : <Mic />}
          </button>

          <button
            onClick={handleCam}
            className={`p-3 rounded-2xl ${
              camOff ? "bg-red-500 text-white" : "bg-gray-200 text-gray-800"
            }`}
            title={camOff ? "Camera On" : "Camera Off"}
          >
            {camOff ? <VideoOff /> : <Video />}
          </button>

          <button
            onClick={handleShare}
            className="p-3 rounded-2xl bg-blue-800 text-white"
            title={sharing ? "Stop Share" : "Share Screen"}
          >
            {sharing ? <ScreenShareOff /> : <ScreenShare />}
          </button>

          <button
            onClick={handleHangup}
            className="p-3 rounded-2xl bg-red-600 text-white"
            title="End Call"
          >
            <PhoneOff />
          </button>
        </div>
      )}
    </div>
  );
};
