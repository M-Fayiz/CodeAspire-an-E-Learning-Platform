import ChatList from "@/features/chat/ChatList"
import ChatWindow from "@/features/chat/ChatWindow"


 const ChatPage=()=>{

    return(
        <>
        <div className="flex">
        <ChatList/>
        <ChatWindow/>
        </div>
        </>
    )
}

export default ChatPage