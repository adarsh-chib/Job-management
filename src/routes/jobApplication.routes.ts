import Express from "express";
import {
  authenticationMiddleware,
  authorizationMiddleware,
} from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import { createJobApplication } from "../validators/jobApplication.validator";
import { applyToJob } from "../controller/jobApplication.controller";

const jobApplicationRouter = Express.Router();

jobApplicationRouter.post(
  "/apply",
  authenticationMiddleware,
  authorizationMiddleware("candidate"),
  validate(createJobApplication),
  applyToJob,
);

export default jobApplicationRouter;
