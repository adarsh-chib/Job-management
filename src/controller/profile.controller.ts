import { Request, Response, NextFunction } from "express";
import {
  createProfile,
  deleteProfileServices,
  updateProfileServices,
} from "../services/profile.service";
import { ApiResponse } from "../utils/api.response";
import { ApiError } from "../utils/api.error";
import { uploadBufferToCloudinary } from "../utils/cloudinary-upload";

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
  req: Request<{ email: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const email = req.params.email;

    if (!email) {
      throw new ApiError(400, "Email is required");
    }

    const userId = req.user?.id;

    if (!userId) {
      throw new ApiError(404, "User not found");
    }

    await deleteProfileServices(email, userId);

    return res
      .status(200)
      .json(new ApiResponse(200, "Profile deleted successfully", email));
  } catch (error) {
    next(error);
  }
};
