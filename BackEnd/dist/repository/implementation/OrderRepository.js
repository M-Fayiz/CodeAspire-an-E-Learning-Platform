"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRepositoy = void 0;
const baseRepository_1 = require("../baseRepository");
const order_model_1 = require("../../models/order.model");
class OrderRepositoy extends baseRepository_1.BaseRepository {
    constructor() {
        super(order_model_1.OrderModel);
    }
    async findOrder(id) {
        return await this.findById(id);
    }
    async updateOrderStatus(id, status) {
        return await this.findByIDAndUpdate(id, { status: status });
    }
    async createOrder(order) {
        return await this.create(order);
    }
    async updateOrder(id, data) {
        return await this.findByIDAndUpdate(id, data);
    }
}
exports.OrderRepositoy = OrderRepositoy;
