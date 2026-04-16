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

profileRouter.post(
  "/create",
  authenticationMiddleware,
  uploadProfileAssets,
  normalizeProfileBody,
  validate(createProfileValidator),
  createProfile,
);

profileRouter.patch(
  "/update",
  authenticationMiddleware,
  uploadProfileAssets,
  normalizeProfileBody,
  validate(updatePRofileValidator),
  updateProfile,
);

profileRouter.delete("/delete", authenticationMiddleware, deleteProfile);

profileRouter.get(
  "/profiles",
  authenticationMiddleware,
  authorizationMiddleware("admin"),
  getAllProfiles,
);

profileRouter.get("/profile", authenticationMiddleware, getMyProfile);

profileRouter.get(
  "/:username",
  authenticationMiddleware,
  getProfileByUsername,
);

profileRouter.put(
  "/upsert",
  authenticationMiddleware,
  validate(updatePRofileValidator),
  upsertProfile,
);

profileRouter.put(
  "/update-with-relations",
  authenticationMiddleware,
  validate(updateProfileWithRelationsValidator),
  updateProfileWithRelations,
);

export default profileRouter;
