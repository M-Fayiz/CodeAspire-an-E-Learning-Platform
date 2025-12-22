"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionRepositoy = void 0;
const transaction_model_1 = require("../../models/transaction.model");
const baseRepository_1 = require("../baseRepository");
const transaction_const_1 = require("../../const/transaction.const");
class TransactionRepositoy extends baseRepository_1.BaseRepository {
    constructor() {
        super(transaction_model_1.transactionModel);
    }
    async createTransaction(transactionData) {
        return this.create(transactionData);
    }
    async getCourseDashboardRevenue(courseId) {
        console.log(courseId);
        return await this.aggregate([
            { $match: { courseId } },
            {
                $group: {
                    _id: null,
                    adminSum: { $sum: "$adminShare" },
                    mentorSum: { $sum: "$mentorShare" },
                },
            },
        ]);
    }
    async getMentorTotalRevenue(mentorId, start, end) {
        return await this.aggregate([
            {
                $match: {
                    mentorId: mentorId,
                    createdAt: { $gte: start, $lte: end },
                    status: { $ne: transaction_const_1.TransactionStatus.REFUNDED }
                },
            },
            {
                $group: {
                    _id: "$paymentType",
                    revenue: {
                        $sum: "$mentorShare",
                    },
                },
            },
        ]);
    }
    async getAdminRevenue(start, end) {
        return this.aggregate([
            { $match: { createdAt: { $gte: start, $lte: end }, status: { $ne: transaction_const_1.TransactionStatus.REFUNDED } } },
            {
                $group: {
                    _id: "$paymentType",
                    value: { $sum: "$adminShare" },
                },
            },
        ]);
    }
    async getMentorRevanueONSlot(filter) {
        return await this.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    },
                    value: { $sum: "$mentorShare" },
                },
            },
            {
                $project: {
                    _id: 0,
                    date: "$_id.date",
                    value: 1,
                },
            },
            { $sort: { date: 1 } },
        ]);
    }
    async getMentorRevanueONCourse(filter) {
        return await this.aggregate([
            { $match: filter },
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    },
                    value: { $sum: "$mentorShare" },
                },
            },
            {
                $project: {
                    _id: 0,
                    date: "$_id.date",
                    value: 1,
                },
            },
            { $sort: { date: 1 } },
        ]);
    }
    async findTransaction(filter) {
        return await this.findOne(filter);
    }
    async updateTransaction(transactionId, updateData) {
        return await this.findByIDAndUpdate(transactionId, updateData);
    }
}
exports.TransactionRepositoy = TransactionRepositoy;
