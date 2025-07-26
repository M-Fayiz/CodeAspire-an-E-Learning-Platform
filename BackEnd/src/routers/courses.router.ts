import express from 'express'
import { CourseRepository } from '../repository/implementation/CourseRepository' 
import { CourseService } from '../services/implementation/CourseService' 
import { CourseController } from '../controllers/implementation/CourseController'

const courseRepository=new CourseRepository()
const courseService=new CourseService(courseRepository)
const courseController=new CourseController(courseService)

const courseRouter=express.Router()
courseRouter.post('/',courseController.addCourse)


export default courseRouter
