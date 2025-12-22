import { BaseRepository } from "../baseRepository";
import { IOrderRepository } from "../interface/IOrderRepository";
import { IOrderModel, OrderModel } from "../../models/order.model";
import { FilterQuery, Types } from "mongoose";
import { IOrder } from "../../types/order.type";

export class OrderRepositoy
  extends BaseRepository<IOrderModel>
  implements IOrderRepository
{
  constructor() {
    super(OrderModel);
  }
  async findOrder(id: Types.ObjectId): Promise<IOrderModel | null> {
    return await this.findById(id);
  }
  async updateOrderStatus(
    id: Types.ObjectId,
    status: string,
  ): Promise<IOrderModel | null> {
    return await this.findByIDAndUpdate(id, { status: status });
  }
  async createOrder(order: IOrder): Promise<IOrderModel | null> {
    return await this.create(order);
  }
  async updateOrder(
    id: Types.ObjectId,
    data: Partial<IOrderModel>,
  ): Promise<IOrderModel | null> {
    return await this.findByIDAndUpdate(id, data);
  }
  async  isOrdered(filter: FilterQuery<IOrderModel>): Promise<IOrderModel | null> {
    return await this.findOne(filter)
  }
}
