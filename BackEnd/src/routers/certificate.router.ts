import { Router } from "express";
const certificateRouter = Router();

import { CertificateRepository } from "../repository/implementation/ICertificateRepository";
import { CourseRepository } from "../repository/implementation/CourseRepository";
import { UserRepository } from "../repository/implementation/UserRepository";
import { CertificateController } from "../controllers/implementation/CertificateController";
import { CertificateService } from "../services/implementation/CertificateService";

const certificateRepositoy = new CertificateRepository();
const userRepository = new UserRepository();
const courseRepository = new CourseRepository();
const certificateService = new CertificateService(
  certificateRepositoy,
  userRepository,
  courseRepository,
);
const certificateController = new CertificateController(certificateService);

certificateRouter.post("/", certificateController.createCertificate);

export default certificateRouter;
