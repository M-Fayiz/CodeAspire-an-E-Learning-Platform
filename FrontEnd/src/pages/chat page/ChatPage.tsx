import ChatList from "@/features/chat/ChatList";
import ChatWindow from "@/features/chat/ChatWindow";
import { useState } from "react";



export interface userProps{
  _id:string,
  profile:string,
  name:string
  userId:string
}
const ChatPage = () => {
  const [selectedChat, setSelectedChat] = useState<userProps | null>(null);

  return (
    <div className="flex  h-screen overflow-hidden bg-gray-50">
      <div className="w-96 flex-shrink-0 border-r border-gray-200">
        <ChatList select={setSelectedChat} />
      </div>

      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <ChatWindow userData={selectedChat} />
        ) : (
          <div className="flex  flex-col flex-1 bg-gray-50 relative"></div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
