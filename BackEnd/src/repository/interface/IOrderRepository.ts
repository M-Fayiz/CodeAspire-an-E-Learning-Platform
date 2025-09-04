import { Types } from "mongoose";
import { IOrderModel } from "../../models/order.model";
import { IOrder } from "../../types/order.type";

export interface IOrderRepository{
    createOrder(order:IOrder):Promise<IOrderModel|null>
    findOrder(id:Types.ObjectId):Promise<IOrderModel|null>
    updateOrderStatus(id:Types.ObjectId,status:string):Promise<IOrderModel|null>
    updateOrder(id:Types.ObjectId,data:Partial<IOrderModel>):Promise<IOrderModel|null>

}