import { useEffect, useRef, useState } from "react";
import VideoService from "@/service/videoSession.service";
import { useP2PCall } from "@/hooks/useP2PCall";
import { useParams } from "react-router-dom";
import { useAuth } from "@/context/auth.context";
import { useSocket } from "@/context/socket.context";

export const VideoRoom = () => {
  const { bookingId } = useParams();
  const localRef = useRef<HTMLVideoElement>(null);
  const remoteRef = useRef<HTMLVideoElement>(null);

  const [roomId, setRoomId] = useState<string>();
  const [joined, setJoined] = useState(false);
  const [muted, setMuted] = useState(false);
  const [camOff, setCamOff] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [mainView, setMainView] = useState<"local" | "remote">("remote");

  const { user } = useAuth();
  const socket = useSocket();
  const { init, call, hangup, shareScreen, toggleCamera, toggleMic } =
    useP2PCall(socket!);
  const initialized = useRef(false);

  // Initialize WebRTC session once
  useEffect(() => {
    if (initialized.current || !socket || !user) return;
    initialized.current = true;

    (async () => {
      try {
        // Backend should return { roomId }
        const data = await VideoService.startVideoSession(bookingId!);
        const room = data.bookedId;
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
        }
      } catch (error) {
        console.error("Init failed:", error);
      }
    })();

    // Cleanup socket listeners
    return () => {
      socket.off("video:offer");
      socket.off("video:answer");
      socket.off("video:ice-candidate");
      socket.off("video:peer-joined");
    };
  }, [bookingId, socket, user, init]);

  // Always mute local video (avoid echo)
  useEffect(() => {
    if (localRef.current) localRef.current.muted = true;
  }, []);

  // Handle cleanup on unmount
  useEffect(() => {
    return () => {
      if (roomId) hangup(roomId);
    };
  }, [roomId, hangup]);

  // === Handlers ===

  const handleJoin = () => {
    if (!roomId) return alert("Room ID required!");
    setJoined(true);
  };

  const handleStartCall = async () => {
    await call(roomId!, user!.id);
  };

  const handleToggleMic = () => {
    setMuted((prev) => {
      const next = !prev;
      toggleMic(next);
      return next;
    });
  };

  const handleToggleCam = () => {
    setCamOff((prev) => {
      const next = !prev;
      toggleCamera(next);
      return next;
    });
  };

  const handleShareScreen = async () => {
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

  const switchWindow = (target: "local" | "remote") => {
    console.log("target :", target);
    if (target !== mainView) {
      setMainView(target);
    }
  };

  // === UI ===
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans p-6 flex flex-col items-center">
      <h1 className="text-3xl font-semibold mb-6 tracking-tight text-gray-800">
        1:1 Video Call – <span className="text-gray-500">MERN WebRTC</span>
      </h1>

      {/* Video Container */}
      <div className="relative w-full max-w-6xl aspect-video bg-black rounded-2xl overflow-hidden shadow-md border border-gray-200 mb-8">
        {/* Remote main view */}
        <video
          key="remote-main"
          ref={remoteRef}
          autoPlay
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out 
      ${mainView === "remote" ? "opacity-100 scale-100 z-10" : "opacity-0 scale-95 z-0"}`}
        />

        {/* Local main view */}
        <video
          key="local-main"
          ref={localRef}
          autoPlay
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ease-in-out 
      ${mainView === "local" ? "opacity-100 scale-100 z-10" : "opacity-0 scale-95 z-0"}`}
        />

        {/* Local floating preview */}
        {mainView === "remote" && (
          <video
            key="local-small"
            ref={localRef}
            autoPlay
            playsInline
            muted
            onClick={() => switchWindow("local")}
            className="absolute bottom-4 right-4 w-1/4 h-1/4 rounded-xl shadow-lg border-2 border-white object-cover cursor-pointer transition-transform duration-500 hover:scale-110 z-20"
          />
        )}

        {/* Remote floating preview */}
        {mainView === "local" && (
          <video
            key="remote-small"
            ref={remoteRef}
            autoPlay
            playsInline
            onClick={() => switchWindow("remote")}
            className="absolute bottom-4 right-4 w-1/4 h-1/4 rounded-xl shadow-lg border-2 border-white object-cover cursor-pointer transition-transform duration-500 hover:scale-110 z-20"
          />
        )}
      </div>

      {/* Controls */}
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg border border-gray-200">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          {!joined ? (
            <button
              onClick={handleJoin}
              className="px-5 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-all"
            >
              Join
            </button>
          ) : (
            <div className="flex flex-wrap justify-center gap-3 mt-3 sm:mt-0">
              <button
                onClick={handleStartCall}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-all"
              >
                Call
              </button>

              <button
                onClick={handleToggleMic}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  muted
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                {muted ? "Unmute Mic" : "Mute Mic"}
              </button>

              <button
                onClick={handleToggleCam}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  camOff
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                {camOff ? "Camera On" : "Camera Off"}
              </button>

              <button
                onClick={handleShareScreen}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all"
              >
                {sharing ? "Stop Share" : "Share Screen"}
              </button>

              <button
                onClick={handleHangup}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all"
              >
                End
              </button>
            </div>
          )}
        </div>
      </div>

      <p className="mt-6 text-gray-500 text-sm max-w-lg text-center">
        💡 Open this page in two tabs or devices with the same <b>Room ID</b>.
        In one tab, click <b>Join</b> then <b>Call</b> to connect.
      </p>
    </div>
  );
};
