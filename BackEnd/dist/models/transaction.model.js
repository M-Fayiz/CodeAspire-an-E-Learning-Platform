"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const modelName_const_1 = require("../const/modelName.const");
const TransactionSchema = new mongoose_1.default.Schema({
    orderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: modelName_const_1.DbModelName.ORDER,
    },
    slotId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: modelName_const_1.DbModelName.SLOT,
    },
    slotBookingId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: modelName_const_1.DbModelName.SLOT_BOOKING,
    },
    paymentType: {
        type: String,
        enum: ["COURSE_PURCHASE", "SLOT_BOOKING"],
        required: true,
    },
    status: {
        type: String,
        enum: ["success", "failed", "refunded"],
    },
    amount: {
        type: Number,
        required: true,
    },
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: modelName_const_1.DbModelName.USER,
    },
    mentorId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: modelName_const_1.DbModelName.USER,
    },
    gatewayTransactionId: {
        type: String,
    },
    paymentMethod: {
        enum: ["stripe", "wallet"],
    },
    courseId: {
        type: mongoose_1.Schema.Types.ObjectId,
        required: true,
        ref: modelName_const_1.DbModelName.COURSE,
    },
    adminShare: { type: Number, required: true },
    mentorShare: { type: Number, required: true },
}, { timestamps: true });
exports.transactionModel = mongoose_1.default.model(modelName_const_1.DbModelName.TRANSACTION, TransactionSchema);
