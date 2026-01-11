import { Types } from "mongoose";
import { HttpResponse } from "../../const/error-message.const";
import { HttpStatus } from "../../const/http-status.const";
import { chatbotDTO } from "../../dtos/chatbot.dto";
import { IChatbotRepository } from "../../repository/interface/IChatbotRepository";
import { ICourseRepository } from "../../repository/interface/ICourseRepository";
import { IEnrolledRepository } from "../../repository/interface/IEnrolledRepositoy";
import { systemInstruction } from "../../template/systemInstruction.template";
import { IchatbotUser, Sender } from "../../types/chatBot.type";
import { IChatbotDTO } from "../../types/dtos.type/chatbot.dto.type";
import { askGemini, GeminiMessage } from "../../utils/gemini.util";
import { createHttpError } from "../../utils/http-error";
import { IChatbotService } from "../interface/IChatbotService";


export class ChatbotService implements IChatbotService{

    constructor(private _chatbotRepository:IChatbotRepository, private _enrolledRepository:IEnrolledRepository, private _courseRepository:ICourseRepository){}

    async createChat(chatbotData: IchatbotUser,crntSessionTitle:string,currentLectureTitle:string): Promise<IChatbotDTO> {

        const {courseId,messages,learnerId}=chatbotData
        const course_Id=new Types.ObjectId(courseId);

        const isEnrolled=await this._enrolledRepository.findEnrlloedCourse({learnerId,courseId})

        if(!isEnrolled){
            throw createHttpError(HttpStatus.NOT_FOUND,HttpResponse.NOT_ENROLLED)
        }   
        console.log('course id :',course_Id)

        const course= await this._courseRepository.getCourse(course_Id)
        console.log(course)
        if(!course){
            throw createHttpError(HttpStatus.NOT_FOUND,HttpResponse.COURSE_NOT_FOUND)
        }

        let chat= await this._chatbotRepository.findChat({learnerId,courseId})

        if(!chat){
            chat=await this._chatbotRepository.createChat({learnerId,courseId,messages:[]})
        }
    
        chat.messages.push({
            role:Sender.USER,
            content:messages,
            createdAt:new Date()
        })

        const systemInstructionData=systemInstruction(course,crntSessionTitle,currentLectureTitle)

        const contents:GeminiMessage[] =[
            systemInstructionData,
            ...chat.messages.map(msg => ({
                role: msg.role,
                parts: [{ text: msg.content }],
            }))
        ] 

        const aiReply = await askGemini(contents);


        chat.messages.push({
            role: Sender.AI,
            content: aiReply as string,
            createdAt:new Date()
        });   

        const updatedChat= await this._chatbotRepository.updateChatbot(chat._id,{$set:{messages:chat.messages}})
        if(!updatedChat){
            throw createHttpError(HttpStatus.INTERNAL_SERVER_ERROR,HttpResponse.SERVER_ERROR)
        }
        return chatbotDTO(updatedChat)
    }
}