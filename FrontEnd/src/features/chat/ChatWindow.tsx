import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Paperclip,
  ImageUp,
  SquarePlay,
  FileAudio,
  File,
} from "lucide-react";
import { useAuth } from "@/context/auth.context";
import { useSocket } from "@/context/socket.context";
import type { IMessageDto } from "@/types/DTOS/message.dto.types";
import { ChatService } from "@/service/chat.service";
import { v4 as uuid } from "uuid";
import type { userProps } from "@/pages/chat page/ChatPage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
type FileType = "photo" | "video" | "audio" | "document";

interface ChatWindowProps {
  userData: userProps;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ userData }) => {
  const { user } = useAuth();
  const socket = useSocket();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [messages, setMessages] = useState<IMessageDto[]>([]);
  const [Online, setOnline] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!socket || !userData._id) return;

    socket.emit("join_chat", { roomId: userData._id });

    const onMessage = (msg: IMessageDto) => {
      setMessages((prev) => {
        const exists = prev.some((m) => m._id === msg._id);
        return exists ? prev : [...prev, msg];
      });
    };
    const onOnline = (userId: string) => {
      console.log("user Id ", userId);
      if (userId === userData.userId) setOnline(true);
    };

    const onOffline = (userId: string) => {
      if (userId === userData.userId) setOnline(false);
    };
    socket.on("new_message", onMessage);
    socket.on("user:online", onOnline);
    socket.on("user:offline", onOffline);
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

  const handleTypeSelect = (type: FileType) => {
    if (!fileInputRef.current) return;

    let acceptValue = "";
    switch (type) {
      case "photo":
        acceptValue = "image/*";
        break;
      case "video":
        acceptValue = "video/*";
        break;
      case "audio":
        acceptValue = "audio/*";
        break;
      case "document":
        acceptValue = ".pdf,.doc,.docx,.txt";
        break;
      default:
        acceptValue = "";
    }
    fileInputRef.current.setAttribute("accept", acceptValue);
    fileInputRef.current.click();
  };
  const handleFIleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      console.log("file is :", file);
    }
  };
  const renderMessageContent = (message: IMessageDto) => {
    // Case 1: If it's just text
    if (message.content && !message.fileUrl) {
      return <p className="text-sm break-words">{message.content}</p>;
    }

    if (message.fileUrl) {
      if (message.type?.startsWith("image")) {
        return (
          <img
            src={message.fileUrl}
            alt="Sent image"
            className="rounded-lg max-w-[200px] cursor-pointer"
            onClick={() => window.open(message.fileUrl, "_blank")}
          />
        );
      }

      if (message.type?.startsWith("video")) {
        return (
          <video
            controls
            src={message.fileUrl}
            className="rounded-lg max-w-[250px]"
          />
        );
      }

      if (message.type?.startsWith("audio")) {
        return <audio controls src={message.fileUrl} className="w-full" />;
      }

      if (
        message.type?.startsWith("application") ||
        message.type === "document"
      ) {
        return (
          <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg">
            <File className="text-gray-600" />
            <a
              href={message.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              {message.content || "Open Document"}
            </a>
          </div>
        );
      }
    }

    return null;
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={userData.profile}
                className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold"
              />

              {Online && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{userData.name}</h2>
              <p
                className={`text-sm ${Online ? "text-green-600" : "text-gray-600"}`}
              >
                {Online ? "Online" : "Offline"}
              </p>
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
                {/* 👇 Replace your old <p> tag with this new block */}
                <div className="space-y-2">
                  {renderMessageContent(message)}
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === user?.id
                        ? "text-orange-100"
                        : "text-gray-500"
                    }`}
                  >
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-gray-200 px-6 py-4 bg-white sticky bottom-0">
        {selectedFile && (
          <div className="max-w-4xl mx-auto mb-3 p-3 border border-gray-300 rounded-xl bg-gray-100 relative">
            <button
              onClick={() => setSelectedFile(null)}
              className="absolute top-1 right-2 text-gray-500 hover:text-red-500"
            >
              ✕
            </button>

            {/* File preview */}
            {selectedFile.type.startsWith("image/") && (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="preview"
                className="w-50 h-50 object-cover rounded-lg"
              />
            )}

            {selectedFile.type.startsWith("video/") && (
              <video
                controls
                src={URL.createObjectURL(selectedFile)}
                className="w-50 rounded-lg"
              />
            )}

            {selectedFile.type.startsWith("audio/") && (
              <audio controls src={URL.createObjectURL(selectedFile)} />
            )}

            {selectedFile.type.startsWith("application/") && (
              <div className="flex items-center gap-2">
                <File className="text-gray-600" />
                <p className="text-sm text-gray-800 truncate max-w-[200px]">
                  {selectedFile.name}
                </p>
              </div>
            )}

            <div className="mt-3 flex justify-end">
              <button
                onClick={() => handleFIleChange}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg"
              >
                Send File
              </button>
            </div>
          </div>
        )}
        <div className="flex items-end gap-2 max-w-4xl mx-auto">
          <Select
            onValueChange={(value) => handleTypeSelect(value as FileType)}
          >
            <SelectTrigger>
              <SelectValue
                placeholder={<Paperclip size={22} className="text-gray-600" />}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="photo">
                <ImageUp className="w-12" /> Photo
              </SelectItem>
              <SelectItem value="video">
                <SquarePlay className="w-12" /> Video
              </SelectItem>
              <SelectItem value="audio">
                <FileAudio className="w-12" /> Audio
              </SelectItem>
              <SelectItem value="document">
                <File className="w-12" /> Document
              </SelectItem>
            </SelectContent>
          </Select>
          <input
            type="file"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleFIleChange}
          />

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
