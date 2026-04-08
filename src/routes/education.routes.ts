import Express from "express";
import {
  createEducation,
  deleteEducation,
  // getEducations,
  updateEducation,
} from "../controller/education.controller";
import { authenticationMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import {
  createEducationValidator,
  updateEducationValidator,
} from "../validators/education.validator";

const educationRouter = Express.Router();

educationRouter.post(
  "/create",
  authenticationMiddleware,
  validate(createEducationValidator),
  createEducation,
);

educationRouter.patch(
  "/update/:educationId",
  authenticationMiddleware,
  validate(updateEducationValidator),
  updateEducation,
);

educationRouter.delete(
  "/delete/:educationId",
  authenticationMiddleware,
  deleteEducation,
);

// educationRouter.get("/get", authenticationMiddleware, getEducations);

export default educationRouter;
