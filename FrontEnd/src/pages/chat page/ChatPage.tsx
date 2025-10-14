import ChatList from "@/features/chat/ChatList";
import ChatWindow from "@/features/chat/ChatWindow";

import { useParams } from "react-router";

const ChatPage = () => {
  const { id } = useParams();

  return (
    <div className="flex  h-screen overflow-hidden bg-gray-50">
      <div className="w-96 flex-shrink-0 border-r border-gray-200">
        <ChatList _id={id} />
      </div>

      <div className="flex-1 flex flex-col">
        <ChatWindow />
      </div>
    </div>
  );
};

export default ChatPage;
