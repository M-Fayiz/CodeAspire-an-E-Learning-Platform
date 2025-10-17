import React, { useEffect, useState } from "react";
import { Search, MessageCircle } from "lucide-react";
import { ChatService } from "@/service/chat.service";
import { useAuth } from "@/context/auth.context";
import type { IChatListDTO } from "@/types/DTOS/chat.dto.type";
import type { userProps } from "@/pages/chat page/ChatPage";

interface ChatListProps {
  select: (data: userProps) => void;
}
const ChatList: React.FC<ChatListProps> = ({ select }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [chats, setChats] = useState<IChatListDTO[]>([]);

  const [selectedChat, setSelectedChat] = useState<userProps|string>("1");

  const { user } = useAuth();
  useEffect(() => {
    (async () => {
      const usersData = await ChatService.ListUsers(user!.id);
      if (usersData) {
        setChats(usersData);
      }
    })();
  }, []);

  const filteredChats = chats.filter((chat) =>
    chat.user.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const slectItem = (data: userProps) => {
    setSelectedChat(data as userProps);
    select(data);
  };

  return (
    <div className="flex flex-col h-screen bg-white w-96 border-r border-gray-200">
      <div className="p-4 bg-orange-500 text-white">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MessageCircle size={28} />
          Messages
        </h1>
      </div>

      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <MessageCircle size={48} className="mb-2" />
            <p>No conversations found</p>
          </div>
        ) : (
          filteredChats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => slectItem({_id:chat._id,name:chat.user.name,profile:chat.user.profile,userId:chat.user._id})}
              className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${
                selectedChat === chat._id
                  ? "bg-orange-50 border-l-4 border-orange-500"
                  : "hover:bg-gray-50 border-l-4 border-transparent"
              }`}
            >
              <div className="relative">
                <img
                  src={chat.user.profile}
                  className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold"
                />

                {/* {chat.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )} */}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {chat.user.name}
                  </h3>
                  {chat.createdAt && (
                    <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                      {chat.createdAt as string}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {chat.latestMessage}
                </p>
              </div>

              {/* {chat.unread > 0 && (
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {chat.unread}
                </div>
              )} */}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatList;
