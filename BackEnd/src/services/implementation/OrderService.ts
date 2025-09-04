import { Request } from "express";
import { IOrderRepository } from "../../repository/interface/IOrderRepository";
import { IOrderService } from "../interface/IOrderService";
import Stripe from "stripe";
import { env } from "../../config/env.config"; 
import { createHttpError } from "../../utility/http-error";
import { HttpStatus } from "../../const/http-status";
import { parseObjectId } from "../../mongoose/objectId";
import { HttpResponse } from "../../const/error-message";
import { ICourseRepository } from "../../repository/interface/ICourseRepository";

import { IOrder } from "../../types/order.type";
import logger from "../../config/logger.config";



export class OrderService implements IOrderService{
    constructor(private _orderRepository:IOrderRepository,private _courseRepository:ICourseRepository){}
    
    async processEvent(req: Request): Promise<void> {
        const sig=req.headers['stripe-signature']
        let event
        logger.info('this ths from even ❌')
         const stripeKey=env.STRIPE_SECRETE_KEY as string
        const stripe = new Stripe(stripeKey)
        try {
            event=stripe.webhooks.constructEvent(
                req.body,
                sig as string,
                env.WEB_HOOK_SECRETE_KEY as string
            )

            switch(event.type){
                case 'payment_intent.succeeded':{

                    const pi = event.data.object;
                    const orderId = pi.metadata?.orderId;
                    console.log('this is order id ',pi.metadata)
                    const _id=parseObjectId(orderId)
                    if(!_id){
                        throw createHttpError(HttpStatus.NOT_FOUND,HttpResponse.INVALID_ID)
                    }
                    const order=this._orderRepository.findOrder(_id)
                    if(!order){
                        throw createHttpError(HttpStatus.NOT_FOUND,'Order not found')
                    }
                    await this._orderRepository.updateOrderStatus(_id,'completed')
                }
            }
        } catch (error) {
            if(error instanceof Error){

                throw createHttpError(HttpStatus.INTERNAL_SERVER_ERROR,error.message)
            }
            throw createHttpError(HttpStatus.INTERNAL_SERVER_ERROR,'Something went wrong!')
        }

    }
    async paymentIntent(userId: string, courseId: string): Promise<{clientSecret:string,orderId:string}> {
        const course_id=parseObjectId(courseId)
        const user_Id=parseObjectId(userId)
        if(!course_id||!user_Id){
            throw createHttpError(HttpStatus.NOT_FOUND,HttpResponse.INVALID_ID)
        }
        const course=await this._courseRepository.findCourse(course_id)
        if(!course){
            throw createHttpError(HttpStatus.NOT_FOUND,'Course Not FOund')
        }
        const amount=course.price
        const currency='inr'
        const order:IOrder={
            userId:user_Id,
            courseId:course_id,
            totalAmount:amount,
            status:'pending'
        } 

        const orderData=await this._orderRepository.createOrder(order)
        if(!orderData){
            throw createHttpError(HttpStatus.INTERNAL_SERVER_ERROR,HttpResponse.SERVER_ERROR)
        }
        const orderId=String(orderData._id)
        const idemKey = `order_${orderData._id}`;
        const stripeKey=env.STRIPE_SECRETE_KEY as string
        const stripe = new Stripe(stripeKey)
        const paymentIntent=await stripe.paymentIntents.create({
            amount:course.price * 100,
            currency,
            metadata:{
                orderId,
                courseId,
                userId
            },
            automatic_payment_methods: { enabled: true }
        },{ idempotencyKey: idemKey })
        await this._orderRepository.updateOrder(orderData._id,{paymentIntentId:paymentIntent.id})

        return {clientSecret:paymentIntent.client_secret as string,orderId:String(orderData._id)}
    }
}