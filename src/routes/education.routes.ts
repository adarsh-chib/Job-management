import Express from "express";
import { createEducation } from "../controller/education.controller";
import { authenticationMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import { createEducationValidator } from "../validators/education.validator";

const educationRouter = Express.Router();

educationRouter.post(
  "/create",
  authenticationMiddleware,
  validate(createEducationValidator),
  createEducation,
);



export default educationRouter;