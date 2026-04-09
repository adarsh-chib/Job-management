import { NextFunction, Request, Response, Router } from "express";
import {
  createProfileController,
  deleteProfile,
  getAllProfiles,
  getMyProfile,
  updateProfile,
  upsertProfile,
} from "../controller/profile.controller";
import {
  authenticationMiddleware,
  authorizationMiddleware,
} from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import {
  createProfileValidator,
  updatePRofileValidator,
} from "../validators/profile.validator";
import { uploadProfileImage } from "../middleware/upload.middleware";

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
  uploadProfileImage,
  normalizeProfileBody,
  validate(createProfileValidator),
  createProfileController,
);

profileRouter.patch(
  "/update",
  authenticationMiddleware,
  uploadProfileImage,
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

profileRouter.put(
  "/upsert",
  authenticationMiddleware,
  validate(updatePRofileValidator),
  upsertProfile,
);

export default profileRouter;
