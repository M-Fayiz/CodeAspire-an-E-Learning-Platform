import express from 'express'
const chatBotRouter=express.Router()

import { ChatbotRepository } from '../repository/implementation/ChatbotRepository'
import { ChatbotService } from '../services/implementation/ChatbotService'
import { ChatbotController } from '../controllers/implementation/ChatBotController'

const chatbotRepository=new ChatbotRepository()
const chatbotService=new ChatbotService(chatbotRepository)
const chatbotController=new ChatbotController(chatbotService)

chatBotRouter.post('/',chatbotController.chat)


export default chatBotRouter