import { ChatEvents, SocketEvents } from "@/constants/socketEvents";
import { useAuth } from "@/context/auth.context";
import { useSocket } from "@/context/socket.context";
import ChatList from "@/features/chat/ChatList";
import ChatWindow from "@/features/chat/ChatWindow";
import { ChatService } from "@/service/chat.service";
import type { IChatListDTO } from "@/types/DTOS/chat.dto.type";
import type { IMessageDto } from "@/types/DTOS/message.dto.types";
import { useEffect, useState } from "react";

export interface userProps {
  _id: string;
  profile: string;
  name: string;
  userId: string;
}
const ChatPage = () => {
  const { user } = useAuth();
  const socket = useSocket();

  const [selectedChat, setSelectedChat] = useState<userProps | null>(null);
  const [chatList, setChats] = useState<IChatListDTO[]>([]);
  const [messages, setMessages] = useState<IMessageDto[]>([]);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    (async () => {
      const usersData = await ChatService.ListUsers(user!.id);
      if (usersData) {
        setChats(usersData);
      }
    })();
  }, [user?.id]);

  useEffect(() => {
    if (!selectedChat || !socket) return;

    const roomId = selectedChat._id;

    socket.emit(ChatEvents.JOIN, { roomId });

    (async () => {
      const data = await ChatService.getChatMessage(roomId);
      if (data) setMessages(data);
    })();
  }, [selectedChat?._id, socket]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (msg: IMessageDto & { roomId: string }) => {
  setMessages((prev) => {
    if (selectedChat && msg.roomId === selectedChat._id) {
      return [...prev, msg];
    }
    return prev;
  });

  setChats((prevChats) => {
    const index = prevChats.findIndex(
      (chat) => chat._id === msg.roomId,
    );

    if (index === -1) return prevChats;

    const chat = prevChats[index];

    // message preview
    let preview = msg.content || "Message";
    if (msg.type === "image") preview = "📷 Image";
    else if (msg.type === "video") preview = "🎥 Video";
    else if (msg.type === "audio") preview = "🎵 Audio";
    else if (msg.type === "pdf" || msg.type?.startsWith("application"))
      preview = "📎 File";

    const updatedChat = {
      ...chat,
      latestMessage: preview,
      lastMessageTime: msg.createdAt,
      unread:
        selectedChat && msg.roomId === selectedChat._id
          ? 0
          : (chat.unread ?? 0) + 1,
    };

    const newChats = [...prevChats];
    newChats.splice(index, 1);     
    newChats.unshift(updatedChat); 

    return newChats;
  });
};


    socket.on(ChatEvents.NEW_MESSAGE, handleNewMessage);

    return () => {
      socket.off(ChatEvents.NEW_MESSAGE, handleNewMessage);
    };
  }, [socket, selectedChat?._id]);
  useEffect(() => {
    if (!socket) return;

    const handleOnline = (userId: string) => {
      if (selectedChat?.userId == userId) {
        setIsOnline(true);
      }
    };

    const handleOffline = (userId: string) => {
      if (selectedChat?.userId == userId) {
        setIsOnline(false);
      }
    };

    socket.on(SocketEvents.USER_ONLINE, handleOnline);
    socket.on(SocketEvents.USER_OFFLINE, handleOffline);

    return () => {
      socket.off(SocketEvents.USER_ONLINE, handleOnline);
      socket.off(SocketEvents.USER_OFFLINE, handleOffline);
    };
  }, [socket, selectedChat?.userId]);
  useEffect(() => {
    if (!socket || !selectedChat) return;

    socket.emit("presence:check", selectedChat.userId);

    const handler = (data: { userId: string; online: boolean }) => {
      if (data.userId === selectedChat.userId) {
        setIsOnline(data.online);
      }
    };

    socket.on("presence:status", handler);

    return () => {
      socket.off("presence:status", handler);
    };
  }, [socket, selectedChat?.userId]);

  return (
    <div className="flex  h-full bg-gray-50">
      <div className="w-96 flex-shrink-0 border-r border-gray-200">
        <ChatList
          chats={chatList}
          selectedChatId={selectedChat?._id || null}
          select={(data) => setSelectedChat(data)}
        />
      </div>

      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <ChatWindow
            userData={selectedChat}
            messages={messages}
            setMessages={setMessages}
            isOnline={isOnline}
          />
        ) : (
          <div className="flex  flex-col flex-1 bg-gray-50 relative"></div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
