import express from "express";
import { CourseRepository } from "../repository/implementation/CourseRepository";
import { CourseService } from "../services/implementation/CourseService";
import { CourseController } from "../controllers/implementation/CourseController";
import { verifyUser } from "../middlewares/authentication.middleware";
import { authorizedRole } from "../middlewares/authorisation.middleware";
import { CategoryRepository } from "../repository/implementation/CategoryRepository";
import { EnrolledRepository } from "../repository/implementation/EnrolledRepository";
import { IRole } from "../types/user.types";

const courseRepository = new CourseRepository();
const categoryRepository = new CategoryRepository();
const enrolledRepositoy = new EnrolledRepository();
const courseService = new CourseService(
  courseRepository,
  categoryRepository,
  enrolledRepositoy,
);
const courseController = new CourseController(courseService);

const courseRouter = express.Router();

courseRouter.get("/", courseController.fetchCourse);

courseRouter.use(verifyUser);
courseRouter.use(authorizedRole(IRole.Mentor, IRole.Admin, IRole.Learner));
courseRouter.post("/", courseController.addCourse);
courseRouter.get("/my-courses", courseController.getMentorDraftedCourseList);
courseRouter.get("/admin-courses", courseController.getAdminCoursList);
courseRouter.get("/:id", courseController.getCourse);
courseRouter.get("/admin/:courseId", courseController.getCourseDetails);
// courseRouter.put("/:id", courseController.updateCourse);
courseRouter.put("/:courseId", courseController.updateBaseInfo);
courseRouter.put("/:id/sessions", courseController.addSession);
courseRouter.put("/:courseId/sessions/:sessionId", courseController.addLecture);
courseRouter.put(
  "/:courseId/sessions/:sessionId/lectures/:lectureId",
  courseController.editLecture,
);
courseRouter.patch("/publish/:courseId", courseController.publishCourse);
courseRouter.patch("/admin/approve/:courseId", courseController.approveCourse);
courseRouter.patch("/admin/reject/:courseId", courseController.approveCourse);
export default courseRouter;
