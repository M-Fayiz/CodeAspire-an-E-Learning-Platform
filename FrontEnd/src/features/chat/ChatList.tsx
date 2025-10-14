import React, { useState } from 'react';
import { Search, MessageCircle } from 'lucide-react';

interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  online: boolean;
}

const ChatList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [chats] = useState<Chat[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      avatar: 'SJ',
      lastMessage: 'Hey! Are we still meeting tomorrow?',
      timestamp: '2m ago',
      unread: 2,
      online: true
    },
    {
      id: '2',
      name: 'Mike Chen',
      avatar: 'MC',
      lastMessage: 'Thanks for the update!',
      timestamp: '1h ago',
      unread: 0,
      online: true
    },
    {
      id: '3',
      name: 'Emily Davis',
      avatar: 'ED',
      lastMessage: 'Can you send me those files?',
      timestamp: '3h ago',
      unread: 5,
      online: false
    },
    {
      id: '4',
      name: 'Alex Kumar',
      avatar: 'AK',
      lastMessage: 'Perfect, see you then!',
      timestamp: '5h ago',
      unread: 0,
      online: false
    },
    {
      id: '5',
      name: 'Lisa Martinez',
      avatar: 'LM',
      lastMessage: 'I\'ll review it this evening',
      timestamp: '1d ago',
      unread: 1,
      online: true
    }
  ]);

  const [selectedChat, setSelectedChat] = useState<string>('1');

  const filteredChats = chats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen bg-white w-96 border-r border-gray-200">
      {/* Header */}
      <div className="p-4 bg-orange-500 text-white">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <MessageCircle size={28} />
          Messages
        </h1>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <MessageCircle size={48} className="mb-2" />
            <p>No conversations found</p>
          </div>
        ) : (
          filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat.id)}
              className={`flex items-center gap-3 p-4 cursor-pointer transition-colors ${
                selectedChat === chat.id
                  ? 'bg-orange-50 border-l-4 border-orange-500'
                  : 'hover:bg-gray-50 border-l-4 border-transparent'
              }`}
            >
              {/* Avatar */}
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center text-white font-semibold">
                  {chat.avatar}
                </div>
                {chat.online && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>

              {/* Chat Info */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-semibold text-gray-900 truncate">{chat.name}</h3>
                  <span className="text-xs text-gray-500 ml-2 flex-shrink-0">{chat.timestamp}</span>
                </div>
                <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
              </div>

              {/* Unread Badge */}
              {chat.unread > 0 && (
                <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {chat.unread}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ChatList;