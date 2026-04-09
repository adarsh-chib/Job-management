import { Request, Response, NextFunction } from "express";
import {
  createProfile,
  deleteProfileServices,
  getAllProfilesService,
  getMyProfileService,
  updateProfileServices,
} from "../services/profile.service";
import { ApiResponse } from "../utils/api.response";
import { ApiError } from "../utils/api.error";
import { uploadBufferToCloudinary } from "../utils/cloudinary-upload";
import { tr } from "zod/v4/locales";

export const createProfileController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new ApiError(401, "User not authenticated");
    }

    let avatar: string | undefined;

    if (req.file) {
      const uploadedImage = await uploadBufferToCloudinary(req.file.buffer, {
        folder: "profile-images",
        resource_type: "image",
      });

      avatar = uploadedImage.secure_url;
    }

    const profileData = {
      ...req.body,
      userId,
      ...(avatar && { avatar }),
    };

    const newProfile = await createProfile(profileData);

    return res
      .status(201)
      .json(new ApiResponse(201, "Profile created successfully", newProfile));
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new ApiError(401, "User not authenticated");
    }

    const updateData: Record<string, unknown> = {
      ...req.body,
    };

    if (req.file) {
      const uploadedImage = await uploadBufferToCloudinary(req.file.buffer, {
        folder: "profile-images",
        resource_type: "image",
      });

      updateData.avatar = uploadedImage.secure_url;
    }

    const updatedProfile = await updateProfileServices(userId, updateData);

    return res
      .status(200)
      .json(
        new ApiResponse(200, "Profile updated successfully", updatedProfile),
      );
  } catch (error) {
    next(error);
  }
};

export const deleteProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new ApiError(404, "User not found");
    }

    await deleteProfileServices(userId);

    return res
      .status(200)
      .json(new ApiResponse(200, "Profile deleted successfully", null));
  } catch (error) {
    next(error);
  }
};

export const getAllProfiles = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search =
    typeof req.query.search === "string" ? req.query.search.trim() : undefined;

  const skip = (page - 1) * limit;
  try {
    const profiles = await getAllProfilesService(skip, limit, search);

    res
      .status(200)
      .json(
        new ApiResponse(200, "all profiles fetched successfully", profiles),
      );
  } catch (err) {
    next(err);
  }
};

export const getMyProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(404, "user not found");
  }

  try {
    const getProfile = await getMyProfileService(userId);

    res
      .status(200)
      .json(
        new ApiResponse(200, "data has been fetched successfully", getProfile),
      );
  } catch (err) {
    next(err);
  }
};
