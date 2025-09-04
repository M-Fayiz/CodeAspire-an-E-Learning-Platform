import { Request, Response, NextFunction } from "express";
import { IOrderController } from "../interface/IOrderController";
import { IOrderService } from "../../services/interface/IOrderService";
import { HttpStatus } from "../../const/http-status";
import { HttpResponse } from "../../const/error-message";
import { successResponse } from "../../utility/response.util";


export class OrderController implements IOrderController{
    constructor(private _orderService:IOrderService){}

    paymentWebhok=async(req: Request, res: Response, next: NextFunction): Promise<void> =>{
        try {
            console.warn('thhin jknas ngn')
            await this._orderService.processEvent(req)
        } catch (error) {
            next(error)
        }
    }
    create_intent=async(req: Request, res: Response, next: NextFunction): Promise<void>=>{
        try {
            const {userId,courseId}=req.body
            const {clientSecret,orderId}=await this._orderService.paymentIntent(userId,courseId)
            res.status(HttpStatus.OK).json(successResponse(HttpResponse.OK,{ clientSecret,orderId}))
        } catch (error) {
            next(error)
        }
    }
}