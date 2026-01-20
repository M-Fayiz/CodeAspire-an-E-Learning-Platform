import { axiosInstance } from "@/axios/createInstance"
import { API } from "@/constants/api.constant"
import type { ChatBot } from "@/types/DTOS/chatbot.dto"
import { throwAxiosError } from "@/utility/throwErrot"

const ChatbotService={
    fetchChats:async(learnerId:string,courseId:string):Promise<ChatBot>=>{
        try {
            const response=await axiosInstance.get(API.CHAT_BOT.FETCH_MESSAGE(learnerId,courseId))

            return response.data.chatMessage

        } catch (error) {
            throwAxiosError(error)
        }
    },
    createChat:async(learnerId:string,courseId:string,message:string):Promise<ChatBot>=>{
        try {
            const response=await axiosInstance.post(API.CHAT_BOT.createChat,{learnerId,courseId,message})
            return response.data.createdChat
        } catch (error) {
            throwAxiosError(error)
        }
    }
}

export default ChatbotService