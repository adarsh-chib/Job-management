import Express from "express";
import {
  authenticationMiddleware,
  authorizationMiddleware,
} from "../middleware/auth.middleware";
import {
  deleteJob,
  getAllJobs,
  getJobById,
  getMyJobs,
  jobsCreate,
  searchJobs,
  updateJob,
} from "../controller/jobs.controller";
import { validate, validateParams } from "../middleware/validation.middleware";
import {
  createJobValidator,
  jobIdParamValidator,
  updateJobValidator,
} from "../validators/jobs.validator";

const jobRouter = Express.Router();

jobRouter.get("/all", authenticationMiddleware, getAllJobs);

jobRouter.get("/search", authenticationMiddleware, searchJobs);

jobRouter.get(
  "/my-jobs",
  authenticationMiddleware,
  authorizationMiddleware("admin", "manager"),
  getMyJobs,
);

jobRouter.get(
  "/:jobId",
  authenticationMiddleware,
  validateParams(jobIdParamValidator),
  getJobById,
);

jobRouter.post(
  "/create",
  authenticationMiddleware,
  authorizationMiddleware("admin", "manager"),
  validate(createJobValidator),
  jobsCreate,
);

jobRouter.patch(
  "/update/:jobId",
  authenticationMiddleware,
  authorizationMiddleware("admin", "manager"),
  validateParams(jobIdParamValidator),
  validate(updateJobValidator),
  updateJob,
);

jobRouter.delete(
  "/delete/:jobId",
  authenticationMiddleware,
  authorizationMiddleware("admin", "manager"),
  validateParams(jobIdParamValidator),
  deleteJob,
);

export default jobRouter;
