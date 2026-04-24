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

/**
 * @swagger
 * /api/job/all:
 *   get:
 *     summary: Get all jobs
 *     tags: [Jobs]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: List of all jobs }
 */
jobRouter.get("/all", authenticationMiddleware, getAllJobs);

/**
 * @swagger
 * /api/job/search:
 *   get:
 *     summary: Search jobs
 *     tags: [Jobs]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema: { type: string }
 *       - in: query
 *         name: location
 *         schema: { type: string }
 *     responses:
 *       200: { description: Filtered jobs }
 */
jobRouter.get("/search", authenticationMiddleware, searchJobs);

/**
 * @swagger
 * /api/job/my-jobs:
 *   get:
 *     summary: Get jobs posted by the manager
 *     tags: [Jobs]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Manager's jobs }
 */
jobRouter.get(
  "/my-jobs",
  authenticationMiddleware,
  authorizationMiddleware("admin", "manager"),
  getMyJobs,
);

/**
 * @swagger
 * /api/job/{jobId}:
 *   get:
 *     summary: Get job by ID
 *     tags: [Jobs]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Job details }
 */
jobRouter.get(
  "/:jobId",
  authenticationMiddleware,
  validateParams(jobIdParamValidator),
  getJobById,
);

/**
 * @swagger
 * /api/job/create:
 *   post:
 *     summary: Create a new job
 *     tags: [Jobs]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               skillsRequired: { type: array, items: { type: string } }
 *               experienceMin: { type: integer }
 *               experienceMax: { type: integer }
 *               company: { type: string }
 *               salaryMin: { type: integer }
 *               salaryMax: { type: integer }
 *               location: { type: string }
 *               jobType: { type: string, enum: [remote, onsite, hybrid] }
 *     responses:
 *       201: { description: Job created }
 */
jobRouter.post(
  "/create",
  authenticationMiddleware,
  authorizationMiddleware("admin", "manager"),
  validate(createJobValidator),
  jobsCreate,
);

/**
 * @swagger
 * /api/job/update/{jobId}:
 *   patch:
 *     summary: Update a job
 *     tags: [Jobs]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *     responses:
 *       200: { description: Job updated }
 */
jobRouter.patch(
  "/update/:jobId",
  authenticationMiddleware,
  authorizationMiddleware("admin", "manager"),
  validateParams(jobIdParamValidator),
  validate(updateJobValidator),
  updateJob,
);

/**
 * @swagger
 * /api/job/delete/{jobId}:
 *   delete:
 *     summary: Delete a job
 *     tags: [Jobs]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Job deleted }
 */
jobRouter.delete(
  "/delete/:jobId",
  authenticationMiddleware,
  authorizationMiddleware("admin", "manager"),
  validateParams(jobIdParamValidator),
  deleteJob,
);

export default jobRouter;
