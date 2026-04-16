import Express from "express";
import {
  authenticationMiddleware,
  authorizationMiddleware,
} from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import { createJobApplication } from "../validators/jobApplication.validator";
import {
  appliedApplicants,
  applyToJob,
  updateApplicationStatus,
  myAppliedJobs,
} from "../controller/jobApplication.controller";

const jobApplicationRouter = Express.Router();

jobApplicationRouter.get(
  "/my-applications",
  authenticationMiddleware,
  authorizationMiddleware("candidate"),
  myAppliedJobs,
);

jobApplicationRouter.post(
  "/apply",
  authenticationMiddleware,
  authorizationMiddleware("candidate"),
  validate(createJobApplication),
  applyToJob,
);

jobApplicationRouter.get(
  "/:jobId/applicants",
  authenticationMiddleware,
  authorizationMiddleware("manager"),
  appliedApplicants,
);

jobApplicationRouter.patch(
  "/:applicationId/status",
  authenticationMiddleware,
  authorizationMiddleware("manager"),
  updateApplicationStatus,
);

export default jobApplicationRouter;
