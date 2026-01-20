"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConnect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const env_config_1 = require("./env.config");
const URL = env_config_1.env.MONGO_URL;
const dbConnect = async () => {
    try {
        await mongoose_1.default.connect(URL);
        console.log("🗳️  DB Connected ");
    }
    catch (error) {
        console.log('DB ERROR :', error);
    }
};
exports.dbConnect = dbConnect;
