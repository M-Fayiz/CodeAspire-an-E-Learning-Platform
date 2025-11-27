import { Server, Socket } from "socket.io";
import { SocketData } from "../types/socket.type/globalSocket.type";
import {
  VideoEmitEvents,
  VideoListenEvents,
} from "../types/socket.type/videoSocket.type";

type RoomUsers = Record<string, Set<string>>;
const videoRooms: RoomUsers = {};

export const registerVideoHandlers = (
  io: Server,
  socket: Socket<VideoListenEvents, VideoEmitEvents, {}, SocketData>,
) => {
  const userId = socket.data.userId;

 
  socket.on("video:join", ({ roomId }) => {
    if (!roomId) return;

    socket.join(`video:${roomId}`);
    if (!videoRooms[roomId]) videoRooms[roomId] = new Set();
    videoRooms[roomId].add(userId);

    console.log(`🎥 User ${userId} joined room ${roomId}`);
    socket.to(`video:${roomId}`).emit("video:peer-joined", { userId });
  });

 
  socket.on("video:offer", ({ roomId, sdp }) => {
    socket.to(`video:${roomId}`).emit("video:offer", { sdp, from: userId });
  });

  socket.on("video:answer", ({ roomId, sdp }) => {
    socket.to(`video:${roomId}`).emit("video:answer", { sdp, from: userId });
  });


  socket.on("video:ice-candidate", ({ roomId, candidate }) => {
    socket
      .to(`video:${roomId}`)
      .emit("video:ice-candidate", { candidate, from: userId });
  });


  socket.on("video:leave", ({ roomId }) => {
    console.log("rooid ", roomId);
    socket.leave(`video:${roomId}`);
    if (videoRooms[roomId]) {
      videoRooms[roomId].delete(userId);
      if (videoRooms[roomId].size === 0) delete videoRooms[roomId];
    }
    socket.to(`video:${roomId}`).emit("video:peer-left", { userId });
  });


  socket.on("disconnect", () => {
    for (const [roomId, members] of Object.entries(videoRooms)) {
      if (members.has(userId)) {
        members.delete(userId);
        socket.to(`video:${roomId}`).emit("video:peer-left", { userId });
        if (members.size === 0) delete videoRooms[roomId];
      }
    }
  });
};
