import express from 'express'
const adminRouter=express.Router()

import { UserRepository } from '../repository/implementation/userRepo'
import { AdminService } from '../services/implementation/AdminService'
import { AdminController } from '../controllers/implementation/AdminController'

const userRepository=new UserRepository()
const adminService=new AdminService(userRepository)
const adminController=new AdminController(adminService)

adminRouter.get('/users',adminController.fetchAllUsers)
adminRouter.delete('/user/:id',adminController.blockUser)


export default adminRouter