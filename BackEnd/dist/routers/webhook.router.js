"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const webhookRouter = express_1.default.Router();
const WebhookController_1 = require("../controllers/implementation/WebhookController");
const WebhookService_1 = require("../services/implementation/WebhookService");
const OrderService_1 = require("../services/implementation/OrderService");
const SlotBookingService_1 = require("../services/implementation/SlotBookingService");
//slot service Repository
const SlotRepository_1 = require("../repository/implementation/SlotRepository");
const SlotBookingRepositoy_1 = require("../repository/implementation/SlotBookingRepositoy");
const slotRepository = new SlotRepository_1.SlotRepository();
const slotBookingRepository = new SlotBookingRepositoy_1.SlotBookingRepository();
// Order Servie Repository
const OrderRepository_1 = require("../repository/implementation/OrderRepository");
const CourseRepository_1 = require("../repository/implementation/CourseRepository");
const EnrolledRepository_1 = require("../repository/implementation/EnrolledRepository");
const TransactionRepository_1 = require("../repository/implementation/TransactionRepository");
const NotificationRepository_1 = require("../repository/implementation/NotificationRepository");
const orderRepositoy = new OrderRepository_1.OrderRepositoy();
const courseRepositoy = new CourseRepository_1.CourseRepository();
const enrolledRepositoy = new EnrolledRepository_1.EnrolledRepository();
const transactionRepositoy = new TransactionRepository_1.TransactionRepositoy();
const notificationRepository = new NotificationRepository_1.NotificationRepository();
const ordreService = new OrderService_1.OrderService(orderRepositoy, courseRepositoy, enrolledRepositoy, transactionRepositoy);
const slotBookingService = new SlotBookingService_1.SlotBookingService(slotBookingRepository, slotRepository, transactionRepositoy, notificationRepository);
const webhookService = new WebhookService_1.WebhookService(ordreService, slotBookingService);
const webhookController = new WebhookController_1.WebhookController(webhookService);
webhookRouter.post("/payment", webhookController.handleStripeWebhook);
exports.default = webhookRouter;
