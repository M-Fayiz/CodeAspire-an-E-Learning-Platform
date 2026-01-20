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
type CallState = "idle" | "calling" | "connected" | "disconnected";

export const VideoRoom = () => {
  const { bookingId } = useParams();
  const { user } = useAuth();
  const socket = useSocket();
  const localRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);
  const [callState, setCallState] = useState<CallState>("idle");
  const [roomId, setRoomId] = useState<string>();
  const [joined, setJoined] = useState(false);
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [sharing, setSharing] = useState(false);

  const navigate = useNavigate();

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
            onConnected: () => setCallState("connected"),
            onDisconnected: () => setCallState("disconnected"),
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

  const handleCall = async () => {
    if (!roomId || !user) return;
    setCallState("calling");
    await call(roomId, user.id);
  };
  // const handleRejoin = async () => {
  //   if (!roomId || !user) return;

  //   if (localRef.current && remoteRef.current) {
  //     await init({
  //       roomId,
  //       userId: user.id,
  //       localVideo: localRef.current,
  //       remoteVideo: remoteRef.current,
  //       onConnected: () => setCallState("connected"),
  //       onDisconnected: () => setCallState("disconnected"),
  //     });

  //     await call(roomId, user.id);
  //   }
  // };

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
    if (user?.role == "mentor") {
      navigate("/mentor/booked-slot-list");
    } else if (user?.role === "learner") {
      navigate("/learner/booked-slots");
    }
  };

  return (
    <div className="min-h-full my-15 bg-gray-50 text-gray-900 font-sans p-6 flex flex-col items-center">
      {/* <h1 className="text-3xl font-semibold mb-6">{`session on ${}`}</h1> */}

      <div className="relative w-full max-w-5xl aspect-video bg-black rounded-md overflow-hidden shadow-md mb-8">
        <video
          ref={remoteRef}
          autoPlay
          playsInline
          className="absolute inset-0 w-full h-full object-cover  border-gray shadow-4xl"
        />
        <video
          ref={localRef}
          autoPlay
          playsInline
          muted
          className="absolute bottom-4 right-4 w-1/4 h-1/4 rounded-lg border-2 border-gray-200+
          n+ shadow-4xl object-cover"
        />
      </div>

      {joined && (
        <div className="flex flex-wrap gap-4 justify-center">
          {/* {user?.role=='mentor'&&(

          <button
            onClick={handleCall}
            className="p-3 pl-6 pr-6  rounded-2xl bg-gray-500 text-white  hover:scale-110 transition"
            title="Call"
          >
            <Phone />
          </button>
          
          )

          } */}
          {callState === "idle" && user?.role === "mentor" && (
            <button onClick={handleCall} className="btn-primary">
              Start Call
            </button>
          )}

          {callState === "connected" && <></>}
          <button
            onClick={handleMic}
            className={`p-3 pl-6 pr-6  rounded-2xl ${
              muted ? "bg-red-500 text-white" : "bg-gray-200 text-gray-800"
            } hover:scale-110 transition`}
            title={muted ? "Unmute Mic" : "Mute Mic"}
          >
            {muted ? <MicOff /> : <Mic />}
          </button>

          <button
            onClick={handleCam}
            className={`p-3 pl-6 pr-6  rounded-2xl ${
              camOff ? "bg-red-500 text-white" : "bg-gray-200 text-gray-800"
            } hover:scale-110 transition`}
            title={camOff ? "Camera On" : "Camera Off"}
          >
            {camOff ? <VideoOff /> : <Video />}
          </button>

          <button
            onClick={handleShare}
            className="p-3 pl-6 pr-6  rounded-2xl bg-blue-800 text-white  hover:scale-110 transition"
            title={sharing ? "Stop Share" : "Share Screen"}
          >
            {sharing ? <ScreenShareOff /> : <ScreenShare />}
          </button>

          <button
            onClick={handleHangup}
            className="p-3 pl-6 pr-6  rounded-2xl bg-red-600 text-white  hover:scale-110 transition"
            title="End Call"
          >
            <PhoneOff />
          </button>

          {/* {callState === "disconnected" && (
            <button
              onClick={handleRejoin}
              className="p-4 rounded-xl bg-yellow-500 text-white"
            >
              Rejoin Call
            </button>
          )} */}
        </div>
      )}
    </div>
  );
};
