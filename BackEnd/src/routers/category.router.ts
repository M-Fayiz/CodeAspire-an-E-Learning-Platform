import  express  from "express";
const categoryRouter=express.Router()

import { CategoryController } from "../controllers/implementation/CategoryController";
import { CategoryRepository } from "../repository/implementation/CategoryRepository";
import { CategoryService } from "../services/implementation/CategoryService";

const categoryRepository = new CategoryRepository()
const categoryService = new CategoryService(categoryRepository)
const categoryController=new CategoryController(categoryService)


categoryRouter.post('/', categoryController.createCategory);
categoryRouter.get('/', categoryController.listCategories);

export default categoryRouter