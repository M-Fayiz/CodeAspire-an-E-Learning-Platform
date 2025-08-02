import express from 'express'
import { CourseRepository } from '../repository/implementation/CourseRepository' 
import { CourseService } from '../services/implementation/CourseService' 
import { CourseController } from '../controllers/implementation/CourseController'
import { verify } from 'crypto'
import { verifyUser } from '../middlewares/authentication.middleware'
import { authorizedRole } from '../middlewares/authorisation.middleware'

const courseRepository=new CourseRepository()
const courseService=new CourseService(courseRepository)
const courseController=new CourseController(courseService)

const courseRouter=express.Router()

// courseRouter.use(verifyUser)
// courseRouter.use(authorizedRole('mentor'))
courseRouter.post('/',courseController.addCourse)


export default courseRouter
