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

/**
 * @swagger
 * /api/experience/create:
 *   post:
 *     summary: Add experience record
 *     tags: [Profile Data]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [companyName, jobTitle, startDate]
 *             properties:
 *               companyName: { type: string }
 *               jobTitle: { type: string }
 *               employmentType: { type: string }
 *               location: { type: string }
 *               locationType: { type: string }
 *               startDate: { type: string, format: date }
 *               endDate: { type: string, format: date }
 *               isCurrent: { type: boolean }
 *               description: { type: string }
 *               skills: { type: array, items: { type: string } }
 *     responses:
 *       201: { description: Experience added }
 */
experienceRouter.post(
  "/create",
  authenticationMiddleware,
  validate(createExperienceValidator),
  createExperience,
);

/**
 * @swagger
 * /api/experience/update/{experienceId}:
 *   patch:
 *     summary: Update experience record
 *     tags: [Profile Data]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: experienceId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Experience updated }
 */
experienceRouter.patch(
  "/update/:experienceId",
  authenticationMiddleware,
  validateParams(experienceIdParamValidator),
  validate(updateExperienceValidator),
  updateExperience,
);

/**
 * @swagger
 * /api/experience/delete/{experienceId}:
 *   delete:
 *     summary: Delete experience record
 *     tags: [Profile Data]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: experienceId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Experience deleted }
 */
experienceRouter.delete(
  "/delete/:experienceId",
  authenticationMiddleware,
  validateParams(experienceIdParamValidator),
  deleteExperience,
);

export default experienceRouter;
