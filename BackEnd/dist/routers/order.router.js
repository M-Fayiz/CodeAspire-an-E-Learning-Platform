"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderRouter = express_1.default.Router();
const OrderRepository_1 = require("../repository/implementation/OrderRepository");
const OrderController_1 = require("../controllers/implementation/OrderController");
const OrderService_1 = require("../services/implementation/OrderService");
const CourseRepository_1 = require("../repository/implementation/CourseRepository");
const EnrolledRepository_1 = require("../repository/implementation/EnrolledRepository");
const authentication_middleware_1 = require("../middlewares/authentication.middleware");
const authorisation_middleware_1 = require("../middlewares/authorisation.middleware");
const TransactionRepository_1 = require("../repository/implementation/TransactionRepository");
const user_types_1 = require("../types/user.types");
const transactionRepository = new TransactionRepository_1.TransactionRepositoy();
const orderRepository = new OrderRepository_1.OrderRepositoy();
const courseRepository = new CourseRepository_1.CourseRepository();
const enrolledRepository = new EnrolledRepository_1.EnrolledRepository();
const orderService = new OrderService_1.OrderService(orderRepository, courseRepository, enrolledRepository, transactionRepository);
const orderController = new OrderController_1.OrderController(orderService);
orderRouter.get("/stripe/:id", authentication_middleware_1.verifyUser, (0, authorisation_middleware_1.authorizedRole)(user_types_1.IRole.Learner), orderController.get_payment_data);
orderRouter.post("/payment/create-checkout-session", 
// verifyUser,
// authorizedRole(IRole.Learner),
orderController.create_intent);
exports.default = orderRouter;
