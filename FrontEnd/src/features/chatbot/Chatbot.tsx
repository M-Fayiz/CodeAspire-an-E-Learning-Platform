import { useState, useRef, useEffect } from 'react';
import { Send, X, Sparkles } from 'lucide-react';
import type { BotMessage } from '@/types/DTOS/chatbot.dto';
import ChatbotService from '@/service/chatbot.service';
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";


interface chatbotProps{
    learnerId:string
    courseId:string
}

export default function ChatBot({learnerId,courseId}:chatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<BotMessage[]>([]);

  const [chatbotInputs,setChatbot ] = useState('');

  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(()=>{
        (async()=>{
            const chatData=await ChatbotService.fetchChats(learnerId,courseId)
            if(chatData){
                setMessages(chatData.messages)
            }
        })()
    },[learnerId,courseId])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  

  const handleSend = async(text = chatbotInputs) => {
    if (!text.trim()) return;
    
    const userMessage: BotMessage = {
        role: "user",
        content: text,
        createdAt: new Date(),
        };
        setMessages(prev => [...prev, userMessage]);
        setIsTyping(true);
    const updatedChat=await ChatbotService.createChat(learnerId,courseId,text)
  
     if(updatedChat){
        setMessages(updatedChat.messages)
         setIsTyping(false);
     }
    setChatbot("");
  };

  return (
  <div className="fixed bottom-4 right-4 z-50 sm:bottom-10 sm:right-10">
    {!isOpen && (
      <button
        onClick={() => setIsOpen(true)}
        className="bg-gradient-to-br from-orange-100 to-orange-200
        hover:from-orange-200 hover:to-orange-300
        rounded-full p-4 shadow-xl transition-all
        hover:scale-110"
      >
        <Sparkles size={26} className="text-orange-600" />
      </button>
    )}

    {isOpen && (
      <div className="
        bg-white rounded-2xl shadow-2xl
        w-[92vw] sm:w-[380px]
        h-[85vh] sm:h-[600px]
        flex flex-col overflow-hidden
      ">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="font-semibold text-sm">AI Learning Assistant</h3>
              <p className="text-xs text-gray-300">Here to clarify your doubts</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)}>
            <X size={18} />
          </button>
        </div>

      
        <div className="flex-1 overflow-y-auto px-4 py-5 bg-gray-50 space-y-6">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`
                   sm:max-w-[90%]
                  ${msg.role === "user"
                    ? "bg-orange-500 text-white"
                    : "bg-white"}
                  rounded-2xl px-4 py-3 shadow-sm
                `}
              >
                {msg.role === "model" ? (
                  <div className="prose prose-sm max-w-none text-gray-800">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h2: ({ children }) => (
                          <h2 className="text-sm font-semibold mt-4 mb-2">
                            {children}
                          </h2>
                        ),
                        p: ({ children }) => (
                          <p className="leading-6 mb-2">{children}</p>
                        ),
                        ul: ({ children }) => (
                          <ul className="list-disc pl-5 space-y-1">{children}</ul>
                        ),
                        code: ({ inline, children }) =>
                          inline ? (
                            <code className="bg-gray-100 px-1 py-0.5 rounded text-orange-600 text-xs">
                              {children}
                            </code>
                          ) : (
                            <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 text-xs my-3 overflow-x-auto">
                              <code>{children}</code>
                            </pre>
                          ),
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                )}
              </div>
            </div>
          ))}

       
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white px-4 py-3 rounded-2xl shadow-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150" />
                  <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t bg-white">
          <div className="flex gap-2 items-center">
            <input
              value={chatbotInputs}
              onChange={(e) => setChatbot(e.target.value)}
              placeholder="Ask a doubt from this lecture…"
              className="flex-1 px-4 py-3 rounded-xl border
              focus:ring-2 focus:ring-orange-400/30 outline-none text-sm"
            />
            <button
              onClick={() => handleSend()}
              disabled={!chatbotInputs.trim()}
              className="bg-orange-500 hover:bg-orange-600
              text-white p-3 rounded-xl disabled:opacity-50"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);

}