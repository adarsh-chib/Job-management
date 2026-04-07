import Express from "express";
import {
  authenticationMiddleware,
  authorizationMiddleware,
} from "../middleware/auth.middleware";
import { jobsCreate } from "../controller/jobs.controller";
import { validate } from "../middleware/validation.middleware";
import { createJobValidator } from "../validators/jobs.validator";

const jobRouter = Express.Router();

jobRouter.post(
  "/create",
  authenticationMiddleware,
  authorizationMiddleware("admin"),
  validate(createJobValidator),
  jobsCreate,
);

export default jobRouter;
