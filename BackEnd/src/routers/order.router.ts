import express from 'express'
const orderRouter=express.Router()

import { OrderRepositoy } from '../repository/implementation/OrderRepository'
import { OrderController } from '../controllers/implementation/OrderController'
import { OrderService } from '../services/implementation/OrderService'
import { CourseRepository } from '../repository/implementation/CourseRepository'

const orderRepository=new OrderRepositoy()
const courseRepository=new CourseRepository()
const orderService=new OrderService(orderRepository,courseRepository)
const orderController=new OrderController(orderService)


orderRouter.post('/payment/create-intent',orderController.create_intent)

const webhookRouter=express.Router()
webhookRouter.post('/payment', (req, res, next) => {
  console.log("🚀 Webhook router hit!");
  next();
}, orderController.paymentWebhok);

export {
    webhookRouter,
    orderRouter
} 