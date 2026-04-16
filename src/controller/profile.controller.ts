import { Request, Response, NextFunction } from "express";
import {
  deleteProfileServices,
  getAllProfilesService,
  getMyProfileService,
  getProfileByUsernameService,
  updateProfileWithRelationsService,
  updateProfileServices,
  upsertProfileServices,
  createProfileService,
} from "../services/profile.service";
import { ApiResponse } from "../utils/api.response";
import { ApiError } from "../utils/api.error";
import { uploadBufferToCloudinary } from "../utils/cloudinary-upload";

const getUploadedFiles = (req: Request) => {
  if (!req.files || Array.isArray(req.files)) {
    return {
      avatarFile: undefined,
      resumeFile: undefined,
    };
  }

  return {
    avatarFile: req.files.avatar?.[0],
    resumeFile: req.files.resume?.[0],
  };
};

export const createProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new ApiError(401, "User not authenticated");
    }

    const { avatarFile, resumeFile } = getUploadedFiles(req);
    let avatar: string | undefined;
    let resume: string | undefined;

    if (avatarFile) {
      const uploadedImage = await uploadBufferToCloudinary(avatarFile.buffer, {
        folder: "profile-images",
        resource_type: "image",
      });

      avatar = uploadedImage.secure_url;
    }

    if (resumeFile) {
      const uploadedResume = await uploadBufferToCloudinary(resumeFile.buffer, {
        folder: "profile-resumes",
        resource_type: "raw",
      });

      resume = uploadedResume.secure_url;
    }

    const profileData = {
      ...req.body,
      userId,
      ...(avatar && { avatar }),
      ...(resume && { resume }),
    };

    const newProfile = await createProfileService(profileData);

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

    const { avatarFile, resumeFile } = getUploadedFiles(req);

    if (avatarFile) {
      const uploadedImage = await uploadBufferToCloudinary(avatarFile.buffer, {
        folder: "profile-images",
        resource_type: "image",
      });

      updateData.avatar = uploadedImage.secure_url;
    }

    if (resumeFile) {
      const uploadedResume = await uploadBufferToCloudinary(resumeFile.buffer, {
        folder: "profile-resumes",
        resource_type: "raw",
      });

      updateData.resume = uploadedResume.secure_url;
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

export const getProfileByUsername = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username } = req.params;
    const profile = await getProfileByUsernameService(username);

    res
      .status(200)
      .json(new ApiResponse(200, "Profile fetched successfully", profile));
  } catch (err) {
    next(err);
  }
};

export const upsertProfile = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?.id;
  const data = req.body;

  if (!userId) {
    throw new ApiError(404, "user not found");
  }

  try {
    const upsertProfile = await upsertProfileServices(userId, data);

    res.status(200).json(new ApiResponse(200, "ok", upsertProfile));
  } catch (err) {
    next(err);
  }
};

export const updateProfileWithRelations = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new ApiError(401, "User not authenticated");
    }

    const updatedProfile = await updateProfileWithRelationsService(
      userId,
      req.body,
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Profile updated successfully",
          updatedProfile,
        ),
      );
  } catch (error) {
    next(error);
  }
};
