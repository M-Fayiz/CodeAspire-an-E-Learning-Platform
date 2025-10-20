import React, { useState, useRef, useEffect } from "react";
import { Send, Paperclip } from "lucide-react";
import { useAuth } from "@/context/auth.context";
import { useSocket } from "@/context/socket.context";
import type { IMessageDto } from "@/types/DTOS/message.dto.types";
import { ChatService } from "@/service/chat.service";
import { v4 as uuid } from "uuid";
import type { userProps } from "@/pages/chat page/ChatPage";

interface ChatWindowProps {
  userData: userProps;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ userData }) => {
  const { user } = useAuth();
  const socket = useSocket();
  const [messages, setMessages] = useState<IMessageDto[]>([]);
  const [Online,setOnline]=useState(false)
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };


  useEffect(() => {
    if (!socket || !userData._id) return;

    socket.emit("join_chat", { roomId : userData._id });
  
    const onMessage = (msg: IMessageDto) => {
      setMessages((prev) => {
        const exists = prev.some((m) => m._id === msg._id);
        return exists ? prev : [...prev, msg];
      });
    };
     const onOnline = (userId: string) => {
      console.log('user Id ',userId)
      if (userId === userData.userId) setOnline(true);
    };

    const onOffline = (userId: string) => {
      if (userId === userData.userId) setOnline(false);
    };  
    socket.on("new_message", onMessage);
    socket.on('user:online',onOnline)
    socket.on('user:offline',onOffline)
    return () => {
      socket.off("new_message", onMessage);
       socket.off("user:online", onOnline);
       socket.off("user:offline", onOffline);
    };
  }, [socket, userData]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    (async () => {
      const data = await ChatService.getChatMessage(userData._id);
      if (data) {
        setMessages(data);
      }
    })();
  }, [userData]);

  const handleSendMessage = () => {
    if (!socket || !inputMessage.trim()) return;

    const tempId = `temp-${uuid()}`;
    const newMessage: IMessageDto = {
      _id: tempId,
      chatId: userData._id,
      sender: user!.id,
      content: inputMessage,
      type: "text",
      status: "sending",
      createdAt: new Date().toISOString(),
    };

    setInputMessage("");

    socket.emit(
      "send_message",
      { roomId: userData._id, content: inputMessage, tempId },
      (ack) => {
        if (ack?.success) {
          setMessages((prev) =>
            prev.map((m) => (m._id === tempId ? ack.message : m)),
          );
        } else if (ack?.error) {
          console.error("Message send failed:", ack.error);
        }
      },
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };


  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img src={userData.profile} className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold"/>
               
           {Online&&(

              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{userData.name}</h2>
              <p className={`text-sm ${Online?"text-green-600":"text-gray-600"}`}>{Online?"Online":"Offline"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message, ind) => (
            <div
              key={message._id || ind}
              className={`flex ${message.sender === user?.id ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md xl:max-w-lg rounded-2xl px-4 py-2 ${
                  message.sender === user?.id
                    ? "bg-orange-500 text-white"
                    : "bg-white text-gray-900 border border-gray-200"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.sender === user?.id
                      ? "text-orange-100"
                      : "text-gray-500"
                  }`}
                >
                  {message.createdAt as string}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-gray-200 px-6 py-4 bg-white sticky bottom-0">
        <div className="flex items-end gap-2 max-w-4xl mx-auto">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors mb-2">
            <Paperclip size={20} className="text-gray-600" />
          </button>

          <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-2 flex items-center gap-2">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              rows={1}
              className="flex-1 bg-transparent resize-none focus:outline-none text-gray-900 placeholder-gray-500"
              style={{ maxHeight: "120px" }}
            />
            {/* <button className="p-1 hover:bg-gray-200 rounded-full transition-colors">
              <Smile size={20} className="text-gray-600" />
            </button> */}
          </div>

          <button
            onClick={handleSendMessage}
            className="p-3 bg-orange-500 hover:bg-orange-600 rounded-full transition-colors mb-2"
          >
            <Send size={20} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
