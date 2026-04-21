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

/**
 * @swagger
 * /api/jobApplication/my-applications:
 *   get:
 *     summary: Get candidate's applications
 *     tags: [Applications]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: List of candidate's applications }
 */
jobApplicationRouter.get(
  "/my-applications",
  authenticationMiddleware,
  authorizationMiddleware("candidate"),
  myAppliedJobs,
);

/**
 * @swagger
 * /api/jobApplication/apply:
 *   post:
 *     summary: Apply for a job
 *     tags: [Applications]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [jobId, resume, coverLetter]
 *             properties:
 *               jobId: { type: string }
 *               resume: { type: string }
 *               coverLetter: { type: string }
 *     responses:
 *       201: { description: Applied successfully }
 */
jobApplicationRouter.post(
  "/apply",
  authenticationMiddleware,
  authorizationMiddleware("candidate"),
  validate(createJobApplication),
  applyToJob,
);

/**
 * @swagger
 * /api/jobApplication/{jobId}/applicants:
 *   get:
 *     summary: Get applicants for a job (Manager only)
 *     tags: [Applications]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: jobId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: List of applicants }
 */
jobApplicationRouter.get(
  "/:jobId/applicants",
  authenticationMiddleware,
  authorizationMiddleware("manager"),
  appliedApplicants,
);

/**
 * @swagger
 * /api/jobApplication/{applicationId}/status:
 *   patch:
 *     summary: Update application status (Manager only)
 *     tags: [Applications]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: applicationId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status: { type: string, enum: [applied, shortlisted, rejected] }
 *     responses:
 *       200: { description: Status updated }
 */
jobApplicationRouter.patch(
  "/:applicationId/status",
  authenticationMiddleware,
  authorizationMiddleware("manager"),
  updateApplicationStatus,
);

export default jobApplicationRouter;
