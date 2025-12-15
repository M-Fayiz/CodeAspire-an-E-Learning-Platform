"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sharedRouter = express_1.default.Router();
const SharedController_1 = require("../controllers/implementation/SharedController");
const SharedService_1 = require("../services/implementation/SharedService");
const sharedService = new SharedService_1.SharedService();
const sharedController = new SharedController_1.SharedController(sharedService);
sharedRouter.get("/s3/presigned-url/upload", sharedController.createS3BucketUplaodURL);
sharedRouter.get("/s3/presigned-url/download", sharedController.createS3BucketDownloadURL);
exports.default = sharedRouter;
