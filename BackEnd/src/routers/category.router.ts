import express from "express";
const categoryRouter = express.Router();

import { CategoryController } from "../controllers/implementation/CategoryController";
import { CategoryRepository } from "../repository/implementation/CategoryRepository";
import { CategoryService } from "../services/implementation/CategoryService";
import { verifyUser } from "../middlewares/authentication.middleware";
import { authorizedRole } from "../middlewares/authorisation.middleware";

const categoryRepository = new CategoryRepository();
const categoryService = new CategoryService(categoryRepository);
const categoryController = new CategoryController(categoryService);


categoryRouter.get("/", categoryController.listCategories);
categoryRouter.use(verifyUser);
categoryRouter.use(authorizedRole("admin", "mentor"));
categoryRouter.post("/", categoryController.createCategory);
categoryRouter.put("/:id", categoryController.editCategory);

export default categoryRouter;
