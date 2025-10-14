import React, { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Smile } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "me" | "them";
  timestamp: string;
}

const ChatWindow = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hey! Are we still meeting tomorrow?",
      sender: "them",
      timestamp: "10:30 AM",
    },
    {
      id: "2",
      text: "Yes, absolutely! I'll be there at 2 PM.",
      sender: "me",
      timestamp: "10:32 AM",
    },
    {
      id: "3",
      text: "Perfect! Should I bring the documents?",
      sender: "them",
      timestamp: "10:33 AM",
    },
    {
      id: "4",
      text: "Yes please, that would be great. Also bring your laptop if possible.",
      sender: "me",
      timestamp: "10:35 AM",
    },
    {
      id: "5",
      text: "Will do! See you tomorrow then.",
      sender: "them",
      timestamp: "10:36 AM",
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        text: inputMessage,
        sender: "me",
        timestamp: new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
        }),
      };
      setMessages([...messages, newMessage]);
      setInputMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex  flex-col flex-1 bg-gray-50 relative">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold">
                SJ
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">Sarah Johnson</h2>
              <p className="text-sm text-green-600">Online</p>
            </div>
          </div>

          {/* <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Phone size={20} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <Video size={20} className="text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <MoreVertical size={20} className="text-gray-600" />
            </button>
          </div> */}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 pb-32">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md xl:max-w-lg rounded-2xl px-4 py-2 ${
                  message.sender === "me"
                    ? "bg-orange-500 text-white"
                    : "bg-white text-gray-900 border border-gray-200"
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.sender === "me"
                      ? "text-orange-100"
                      : "text-gray-500"
                  }`}
                >
                  {message.timestamp}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="absolute bottom-25 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-2">
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
              <button className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                <Smile size={20} className="text-gray-600" />
              </button>
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
    </div>
  );
};

export default ChatWindow;
