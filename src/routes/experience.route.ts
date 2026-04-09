import Express from "express";
import { authenticationMiddleware } from "../middleware/auth.middleware";
import { validate, validateParams } from "../middleware/validation.middleware";
import {
  createExperienceValidator,
  experienceIdParamValidator,
  updateExperienceValidator,
} from "../validators/experience.validator";
import {
  createExperience,
  deleteExperience,
  updateExperience,
} from "../controller/experience.controller";

const experienceRouter = Express.Router();

experienceRouter.post(
  "/create",
  authenticationMiddleware,
  validate(createExperienceValidator),
  createExperience,
);

experienceRouter.patch(
  "/update/:experienceId",
  authenticationMiddleware,
  validateParams(experienceIdParamValidator),
  validate(updateExperienceValidator),
  updateExperience,
);

experienceRouter.delete(
  "/delete/:experienceId",
  authenticationMiddleware,
  validateParams(experienceIdParamValidator),
  deleteExperience,
);

export default experienceRouter;
