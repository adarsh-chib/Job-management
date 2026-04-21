import { NextFunction, Request, Response, Router } from "express";
import {
  deleteProfile,
  getAllProfiles,
  getMyProfile,
  getProfileByUsername,
  updateProfileWithRelations,
  updateProfile,
  upsertProfile,
  createProfile,
} from "../controller/profile.controller";
import {
  authenticationMiddleware,
  authorizationMiddleware,
} from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import {
  createProfileValidator,
  updateProfileWithRelationsValidator,
  updatePRofileValidator,
} from "../validators/profile.validator";
import { uploadProfileAssets } from "../middleware/upload.middleware";

const profileRouter = Router();

const normalizeProfileBody = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  if (typeof req.body.skills === "string") {
    req.body.skills = req.body.skills
      .split(",")
      .map((item: string) => item.trim())
      .filter(Boolean);
  }

  if (typeof req.body.isOpenToWork === "string") {
    req.body.isOpenToWork = req.body.isOpenToWork === "true";
  }

  next();
};

/**
 * @swagger
 * /api/profile/create:
 *   post:
 *     summary: Create user profile
 *     tags: [Profile]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [fullName, username]
 *             properties:
 *               fullName: { type: string }
 *               username: { type: string }
 *               headline: { type: string }
 *               bio: { type: string }
 *               location: { type: string }
 *               skills: { type: string, description: "Comma separated skills" }
 *               avatar: { type: string, format: binary }
 *               resume: { type: string, format: binary }
 *     responses:
 *       201: { description: Profile created }
 */
profileRouter.post(
  "/create",
  authenticationMiddleware,
  uploadProfileAssets,
  normalizeProfileBody,
  validate(createProfileValidator),
  createProfile,
);

/**
 * @swagger
 * /api/profile/update:
 *   patch:
 *     summary: Update user profile
 *     tags: [Profile]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fullName: { type: string }
 *               headline: { type: string }
 *     responses:
 *       200: { description: Profile updated }
 */
profileRouter.patch(
  "/update",
  authenticationMiddleware,
  uploadProfileAssets,
  normalizeProfileBody,
  validate(updatePRofileValidator),
  updateProfile,
);

/**
 * @swagger
 * /api/profile/delete:
 *   delete:
 *     summary: Delete user profile
 *     tags: [Profile]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Profile deleted }
 */
profileRouter.delete("/delete", authenticationMiddleware, deleteProfile);

/**
 * @swagger
 * /api/profile/profiles:
 *   get:
 *     summary: Get all profiles (Admin only)
 *     tags: [Admin]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: List of all profiles }
 */
profileRouter.get(
  "/profiles",
  authenticationMiddleware,
  authorizationMiddleware("admin"),
  getAllProfiles,
);

/**
 * @swagger
 * /api/profile/profile:
 *   get:
 *     summary: Get my profile
 *     tags: [Profile]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: User's profile }
 */
profileRouter.get("/profile", authenticationMiddleware, getMyProfile);

/**
 * @swagger
 * /api/profile/{username}:
 *   get:
 *     summary: Get profile by username
 *     tags: [Profile]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Profile details }
 */
profileRouter.get(
  "/:username",
  authenticationMiddleware,
  getProfileByUsername,
);

/**
 * @swagger
 * /api/profile/upsert:
 *   put:
 *     summary: Upsert profile
 *     tags: [Profile]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Profile upserted }
 */
profileRouter.put(
  "/upsert",
  authenticationMiddleware,
  validate(updatePRofileValidator),
  upsertProfile,
);

/**
 * @swagger
 * /api/profile/update-with-relations:
 *   put:
 *     summary: Update profile with education and experience
 *     tags: [Profile]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               profile: { type: object }
 *               education: { type: array, items: { type: object } }
 *               experience: { type: array, items: { type: object } }
 *     responses:
 *       200: { description: Profile and relations updated }
 */
profileRouter.put(
  "/update-with-relations",
  authenticationMiddleware,
  validate(updateProfileWithRelationsValidator),
  updateProfileWithRelations,
);

export default profileRouter;
