import express from 'express'
const chatBotRouter=express.Router()

import { ChatbotRepository } from '../repository/implementation/ChatbotRepository'
import { ChatbotService } from '../services/implementation/ChatbotService'
import { ChatbotController } from '../controllers/implementation/ChatBotController'
import { EnrolledRepository } from '../repository/implementation/EnrolledRepository'
import { CourseRepository } from '../repository/implementation/CourseRepository'


const chatbotRepository=new ChatbotRepository()
const enrolledRepository=new EnrolledRepository()
const courseRepository=new CourseRepository()
const chatbotService=new ChatbotService(chatbotRepository,enrolledRepository,courseRepository)
const chatbotController=new ChatbotController(chatbotService)

chatBotRouter.post('/',chatbotController.chat)


export default chatBotRouter