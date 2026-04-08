import Express from "express";
import { authenticationMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import { createExperienceValidator } from "../validators/experience.validator";
import { createExperience } from "../controller/experience.controller";

const experienceRouter = Express.Router();

experienceRouter.post(
  "/create",
  authenticationMiddleware,
  validate(createExperienceValidator),
  createExperience,
);

export default experienceRouter;
