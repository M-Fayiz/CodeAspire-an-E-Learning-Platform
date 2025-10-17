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

chatRouter.get("/:chatId/messages", verifyUser, chatController.getChatMessages);
chatRouter.get("/users/:senderId", verifyUser, chatController.listUsers);
chatRouter.post("/get-or-create", verifyUser, chatController.getOrCreateChat);

export default chatRouter;
