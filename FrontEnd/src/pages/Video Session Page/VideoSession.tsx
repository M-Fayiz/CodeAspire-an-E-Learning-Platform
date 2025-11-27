import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "@/context/auth.context";
import { useSocket } from "@/context/socket.context";
import VideoService from "@/service/videoSession.service";
import { useP2PCall } from "@/hooks/useP2PCall";

export const VideoRoom = () => {
  const { bookingId } = useParams();
  const { user } = useAuth();
  const socket = useSocket();
  const localRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);

  const [roomId, setRoomId] = useState<string>();
  const [joined, setJoined] = useState(false);
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [sharing, setSharing] = useState(false);

  const { init, call, hangup, toggleMic, toggleCamera, shareScreen } =
    useP2PCall(socket!);

  useEffect(() => {
    if (!socket || !user) return;

    (async () => {
      try {
        const data = await VideoService.startVideoSession(bookingId!);
        const room = data.roomId;
        setRoomId(room);

        if (localRef.current && remoteRef.current) {
          await init({
            roomId: room,
            userId: user.id,
            localVideo: localRef.current,
            remoteVideo: remoteRef.current,
            onConnected: () => console.log("✅ Connected"),
            onDisconnected: () => console.log("❌ Disconnected"),
          });
          setJoined(true);
        }
      } catch (err) {
        console.error("Video init failed:", err);
      }
    })();

    return () => {
      hangup(roomId!);
    };
  }, [socket, user, bookingId]);

  /** 🔘 Button handlers */
  const handleCall = async () => {
    if (roomId && user) await call(roomId, user.id);
  };

  const handleMic = () => {
    setMuted((prev) => {
      const next = !prev;
      toggleMic(next);
      return next;
    });
  };

  const handleCam = () => {
    setCamOff((prev) => {
      const next = !prev;
      toggleCamera(next);
      return next;
    });
  };

  const handleShare = async () => {
    setSharing((prev) => {
      const next = !prev;
      shareScreen(next);
      return next;
    });
  };

  const handleHangup = async () => {
    if (roomId) await hangup(roomId);
    setJoined(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans p-6 flex flex-col items-center">
      {/* <h1 className="text-3xl font-semibold mb-6">{`session on ${}`}</h1> */}

      <div className="relative w-full max-w-5xl aspect-video bg-black rounded-2xl overflow-hidden shadow-md mb-8">
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
          className="absolute bottom-4 right-4 w-1/4 h-1/4 rounded-lg border-2 border-white shadow-lg object-cover"
        />
      </div>

      {joined && (
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={handleCall}
            className="px-4 py-2 bg-green-500 text-white rounded-lg"
          >
            Call
          </button>
          <button
            onClick={handleMic}
            className={`px-4 py-2 rounded-lg ${muted ? "bg-red-500 text-white" : "bg-gray-200 text-gray-800"}`}
          >
            {muted ? "Unmute Mic" : "Mute Mic"}
          </button>
          <button
            onClick={handleCam}
            className={`px-4 py-2 rounded-lg ${camOff ? "bg-red-500 text-white" : "bg-gray-200 text-gray-800"}`}
          >
            {camOff ? "Camera On" : "Camera Off"}
          </button>
          <button
            onClick={handleShare}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            {sharing ? "Stop Share" : "Share Screen"}
          </button>
          <button
            onClick={handleHangup}
            className="px-4 py-2 bg-red-500 text-white rounded-lg"
          >
            End
          </button>
        </div>
      )}
    </div>
  );
};
