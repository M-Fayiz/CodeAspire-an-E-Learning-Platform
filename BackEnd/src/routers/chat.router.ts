import express from "express";
const chatRouter = express.Router();

import { ChatRepository } from "../repository/implementation/ChatRepository";
import { ChatService } from "../services/implementation/ChatService";
import { ChatCOntroller } from "../controllers/implementation/ChatController";
import { verifyUser } from "../middlewares/authentication.middleware";
import { MessageRepository } from "../repository/implementation/MessageRespository";

const chatRepository = new ChatRepository();
const messageRepository = new MessageRepository();
const chatService = new ChatService(chatRepository, messageRepository);
const chatController = new ChatCOntroller(chatService);

chatRouter.post("/get-or-create", verifyUser, chatController.getOrCreateChat);
chatRouter.get("/users/:senderId", verifyUser, chatController.listUsers);

export default chatRouter;
