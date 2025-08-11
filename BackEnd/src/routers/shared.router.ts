import express from "express";
const sharedRouter = express.Router();

import { SharedController } from "../controllers/implementation/SharedController";
import { SharedService } from "../services/implementation/SharedService";

const sharedService = new SharedService();
const sharedController = new SharedController(sharedService);

sharedRouter.get(
  "/s3/presigned-url/upload",
  sharedController.createS3BucketUplaodURL,
);

export default sharedRouter;
