import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api.error";
import {
  createExperienceServices,
  deleteExperienceServices,
  updateExperienceServices,
} from "../services/experience.service";
import { ApiResponse } from "../utils/api.response";
import prisma from "../configs/prisma";

type ExperienceInput = {
  companyName: string;
  jobTitle: string;
  employmentType?: string;
  location?: string;
  locationType?: string;
  startDate: Date;
  endDate?: Date;
  isCurrent?: boolean;
  description?: string;
  skills: string[];
};

export const createExperience = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new ApiError(404, "user not found");
    }

    const profile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new ApiError(404, "profile not found");
    }

    const experienceData = req.body.map((experience: ExperienceInput) => ({
      ...experience,
      profile: {
        connect: {
          id: profile.id,
        },
      },
    }));

    const experienceCreate = await createExperienceServices(experienceData);

    res
      .status(201)
      .json(new ApiResponse(201, "experience has been added", experienceCreate));
  } catch (err) {
    next(err);
  }
};

export const updateExperience = async (
  req: Request<{ experienceId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new ApiError(404, "user not found");
    }

    const experienceId = req.params.experienceId;

    if (!experienceId) {
      throw new ApiError(400, "experience id is required");
    }

    const updatedExperience = await updateExperienceServices(
      experienceId,
      userId,
      req.body,
    );

    res
      .status(200)
      .json(
        new ApiResponse(200, "experience has been updated", updatedExperience),
      );
  } catch (err) {
    next(err);
  }
};

export const deleteExperience = async (
  req: Request<{ experienceId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new ApiError(404, "user not found");
    }

    const experienceId = req.params.experienceId;

    if (!experienceId) {
      throw new ApiError(400, "experience id is required");
    }

    const deletedExperience = await deleteExperienceServices(
      experienceId,
      userId,
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "experience has been deleted",
          deletedExperience,
        ),
      );
  } catch (err) {
    next(err);
  }
};
