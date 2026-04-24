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

/**
 * @swagger
 * /api/education/create:
 *   post:
 *     summary: Add education record
 *     tags: [Profile Data]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [institutionName, qualification, startDate]
 *             properties:
 *               institutionName: { type: string }
 *               qualification: { type: string }
 *               fieldOfStudy: { type: string }
 *               startDate: { type: string, format: date }
 *               endDate: { type: string, format: date }
 *               grade: { type: string }
 *               description: { type: string }
 *     responses:
 *       201: { description: Education added }
 */
educationRouter.post(
  "/create",
  authenticationMiddleware,
  validate(createEducationValidator),
  createEducation,
);

/**
 * @swagger
 * /api/education/update/{educationId}:
 *   patch:
 *     summary: Update education record
 *     tags: [Profile Data]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: educationId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Education updated }
 */
educationRouter.patch(
  "/update/:educationId",
  authenticationMiddleware,
  validate(updateEducationValidator),
  updateEducation,
);

/**
 * @swagger
 * /api/education/delete/{educationId}:
 *   delete:
 *     summary: Delete education record
 *     tags: [Profile Data]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: educationId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Education deleted }
 */
educationRouter.delete(
  "/delete/:educationId",
  authenticationMiddleware,
  deleteEducation,
);

// educationRouter.get("/get", authenticationMiddleware, getEducations);

export default educationRouter;
