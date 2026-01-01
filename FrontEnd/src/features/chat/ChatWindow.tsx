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
import { useSocket } from "@/hooks/useSocket"; 
import type { IMessageDto } from "@/types/DTOS/message.dto.types";

import { v4 as uuid } from "uuid";
import type { userProps } from "@/pages/chat page/ChatPage";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChatEvents } from "@/constants/socketEvents";
import { sharedService } from "@/service/shared.service";

type FileType = "image" | "video" | "audio" | "pdf" | "text";

interface ChatWindowProps {
  userData: userProps;
  messages: IMessageDto[];
  setMessages: React.Dispatch<React.SetStateAction<IMessageDto[]>>;
  isOnline: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  userData,
  messages,
  setMessages,
  isOnline,
}) => {
  const { user } = useAuth();
  const socket = useSocket();

  const [inputMessage, setInputMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [isUploading, setIsUploading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    const latest = messages[messages.length - 1];
    if (!latest || !latest.mediaUrl) return;
    if (latest.mediaUrl.startsWith("https://")) return;

    (async () => {
      try {
        const url = await sharedService.getPreSignedDownloadURL(
          latest.mediaUrl as string,
        );
        setMessages((prev) =>
          prev.map((m) => (m._id === latest._id ? { ...m, mediaUrl: url } : m)),
        );
      } catch (err) {
        console.error("Failed to get presigned URL:", err);
      }
    })();
  }, [messages.length]);

  const handleSendMessage = () => {
    if (!socket || !inputMessage.trim()) return;

    const tempId = `temp-${uuid()}`;

    setInputMessage("");

    socket.emit(
      ChatEvents.SEND,
      { roomId: userData._id, content: inputMessage, tempId, type: "text" },
      (ack: any) => {
        if (ack?.success) {
          setMessages((prev) =>
            prev.map((m) => (m._id === tempId ? ack.message : m)),
          );
        } else {
          console.error("Message send failed:", ack?.error);
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
      case "image":
        acceptValue = "image/*";

        break;
      case "video":
        acceptValue = "video/*";

        break;
      case "audio":
        acceptValue = "audio/*";

        break;
      case "pdf":
        acceptValue = ".pdf,.doc,.docx,.txt";

        break;
    }

    fileInputRef.current.value = "";
    fileInputRef.current.setAttribute("accept", acceptValue);
    fileInputRef.current.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleSendFile = async () => {
    if (!selectedFile || !socket) return;
    setIsUploading(true);

    let fileCategory: FileType = "text";
    if (selectedFile.type.startsWith("image")) fileCategory = "image";
    else if (selectedFile.type.startsWith("video")) fileCategory = "video";
    else if (selectedFile.type.startsWith("audio")) fileCategory = "audio";
    else if (selectedFile.type.startsWith("application")) fileCategory = "pdf";

    const tempId = `temp-${uuid()}`;

    try {
      const uploadResponse =
        await sharedService.getS3BucketUploadUrl(selectedFile);
      if (uploadResponse?.uploadURL && uploadResponse?.fileURL) {
        await sharedService.uploadToS3(uploadResponse.uploadURL, selectedFile);

        socket.emit(
          ChatEvents.SEND,
          {
            roomId: userData._id,
            content: selectedFile.name,
            mediaUrl: uploadResponse.fileURL,
            type: fileCategory,
            tempId,
          },
          (ack: any) => {
            if (ack?.success) {
              setMessages((prev) =>
                prev.map((m) => (m._id === tempId ? ack.message : m)),
              );
            } else {
              console.error("File send failed:", ack?.error);
            }
          },
        );
      }
      setSelectedFile(null);
    } catch (err) {
      console.error("File send error:", err);
    } finally {
      setIsUploading(false);
      setSelectedFile(null);
    }
  };

  const renderMessageContent = (message: IMessageDto) => {
    if (message.content && !message.mediaUrl)
      return <p className="text-sm break-words">{message.content}</p>;

    if (message.mediaUrl) {
      if (message.type?.startsWith("image"))
        return (
          <img
            src={message.mediaUrl}
            alt="Sent image"
            className="rounded-lg max-w-[200px] cursor-pointer"
            onClick={() => window.open(message.mediaUrl as string, "_blank")}
          />
        );

      if (message.type?.startsWith("video"))
        return (
          <video
            controls
            src={message.mediaUrl}
            className="rounded-lg max-w-[250px]"
          />
        );

      if (message.type?.startsWith("audio"))
        return <audio controls src={message.mediaUrl} className="w-full" />;

      if (message.type?.startsWith("application") || message.type === "pdf")
        return (
          <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg">
            <File className="text-gray-600" />
            <a
              href={message.mediaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline"
            >
              {message.content || "Open Document"}
            </a>
          </div>
        );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={userData.profile}
              className="w-10 h-10 rounded-full bg-orange-500 object-cover"
            />
            {isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">{userData.name}</h2>
            <p
              className={`text-sm ${
                isOnline ? "text-green-600" : "text-gray-600"
              }`}
            >
              {isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="max-w-4xl mx-auto space-y-2">
          {messages.map((message) => (
            <div
              key={message._id}
              className={`flex ${
                message.sender === user?.id ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md xl:max-w-lg rounded-2xl px-4 py-2 ${
                  message.sender === user?.id
                    ? "bg-orange-500 text-white"
                    : "bg-white text-gray-900 border border-gray-200"
                }`}
              >
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

      <div className="border-t border-gray-200 px-6 py-4  bg-white">
        {selectedFile && (
          <div className="max-w-4xl mx-auto mb-3 p-3 border border-gray-300 rounded-xl bg-gray-100 relative">
            <button
              onClick={() => setSelectedFile(null)}
              className="absolute top-1 right-2 text-gray-500 hover:text-red-500"
            >
              ✕
            </button>

            {selectedFile.type.startsWith("image/") && (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="preview"
                className="w-40 h-40 object-cover rounded-lg"
              />
            )}
            {selectedFile.type.startsWith("video/") && (
              <video
                controls
                src={URL.createObjectURL(selectedFile)}
                className="w-40 rounded-lg"
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
                onClick={handleSendFile}
                disabled={isUploading}
                className={`${
                  isUploading
                    ? "bg-gray-400"
                    : "bg-orange-500 hover:bg-orange-600"
                } text-white px-4 py-2 rounded-lg`}
              >
                {isUploading ? "Uploading..." : "Send File"}
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
              <SelectItem value="image">
                <ImageUp className="w-12" /> Image
              </SelectItem>
              <SelectItem value="video">
                <SquarePlay className="w-12" /> Video
              </SelectItem>
              <SelectItem value="audio">
                <FileAudio className="w-12" /> Audio
              </SelectItem>
              <SelectItem value="pdf">
                <File className="w-12" /> Document
              </SelectItem>
            </SelectContent>
          </Select>

          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
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
