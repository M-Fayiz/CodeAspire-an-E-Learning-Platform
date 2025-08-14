import express from "express";
import { CourseRepository } from "../repository/implementation/CourseRepository";
import { CourseService } from "../services/implementation/CourseService";
import { CourseController } from "../controllers/implementation/CourseController";
import { verifyUser } from "../middlewares/authentication.middleware";
import { authorizedRole } from "../middlewares/authorisation.middleware";
import { CategoryRepository } from "../repository/implementation/CategoryRepository";

const courseRepository = new CourseRepository();
const categoryRepository = new CategoryRepository();
const courseService = new CourseService(courseRepository, categoryRepository);
const courseController = new CourseController(courseService);

const courseRouter = express.Router();

courseRouter.use(verifyUser)
courseRouter.use(authorizedRole('mentor'))
courseRouter.post("/", courseController.addCourse);
courseRouter.put("/:id", courseController.updateCourse);
courseRouter.put('/:id/sessions',courseController.addSession)
courseRouter.put('/:courseId/sessions/:sessionId',courseController.addLecture)
courseRouter.get("/", courseController.fetchCourse); 
courseRouter.get("/drafted-courses",courseController.getMentorDraftedCourseList)
courseRouter.get("/:id",courseController.getCourse)

export default courseRouter;
