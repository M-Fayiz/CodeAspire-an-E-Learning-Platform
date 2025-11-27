import express from "express";
import { CourseRepository } from "../repository/implementation/CourseRepository";
import { CourseService } from "../services/implementation/CourseService";
import { CourseController } from "../controllers/implementation/CourseController";
import { verifyUser } from "../middlewares/authentication.middleware";
import { authorizedRole } from "../middlewares/authorisation.middleware";
import { CategoryRepository } from "../repository/implementation/CategoryRepository";
import { EnrolledRepository } from "../repository/implementation/EnrolledRepository";
import { IRole } from "../types/user.types";
import { NotificationRepository } from "../repository/implementation/NotificationRepository";

const courseRepository = new CourseRepository();
const categoryRepository = new CategoryRepository();
const enrolledRepositoy = new EnrolledRepository();
const notificationRepository = new NotificationRepository();
const courseService = new CourseService(
  courseRepository,
  categoryRepository,
  enrolledRepositoy,
  notificationRepository,
);
const courseController = new CourseController(courseService);

const courseRouter = express.Router();

courseRouter.get("/", courseController.fetchCourse);

courseRouter.use(verifyUser);
courseRouter.use(authorizedRole(IRole.Mentor, IRole.Admin, IRole.Learner));
courseRouter.post("/", courseController.addCourse);
courseRouter.get("/my-courses", courseController.getMentorDraftedCourseList);
courseRouter.get("/admin-courses", courseController.getAdminCoursList);
courseRouter.get("/:courseId", courseController.getCourse);
courseRouter.get("/admin/:courseId", courseController.getCourseDetails);
courseRouter.get("/mentor/:mentorId", courseController.getCourseListSlot);
courseRouter.get("/form/:courseId", courseController.getCourseFormData);
// courseRouter.put("/:id", courseController.updateCourse);
courseRouter.put("/:courseId", courseController.updateBaseInfo);
courseRouter.put("/:courseId/sessions", courseController.addSession); 
courseRouter.put("/:courseId/sessions/:sessionId", courseController.addLecture);
courseRouter.put(
  "/:courseId/sessions/:sessionId/lectures/:lectureId",
  courseController.editLecture,
);
courseRouter.patch("/publish/:courseId", courseController.publishCourse);
courseRouter.patch("/admin/approve/:courseId", courseController.approveCourse);
courseRouter.patch("/admin/reject/:courseId", courseController.rejectCourse);
export default courseRouter;
