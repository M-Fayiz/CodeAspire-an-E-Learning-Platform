"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificateModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const modelName_1 = require("../const/modelName");
const CertificateSchema = new mongoose_1.default.Schema({
    learnerId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: modelName_1.DbModelName.USER,
        required: true,
    },
    courseId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: modelName_1.DbModelName.COURSE,
        required: true,
    },
    programmTitle: { type: String },
    certificateId: { type: String, required: true, unique: true },
    certificateUrl: { type: String, required: true },
    preview_image: { type: String, required: true },
    issuedDate: { type: Date, default: Date.now },
}, { timestamps: true });
exports.CertificateModel = mongoose_1.default.model(modelName_1.DbModelName.CERTIFICATE, CertificateSchema);
