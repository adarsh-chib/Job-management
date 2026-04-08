import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api.error";
import { createExperienceServices } from "../services/experience.service";
import { ApiResponse } from "../utils/api.response";

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

    const experienceData = { ...req.body, userId };

    const experienceCreate = await createExperienceServices(experienceData);

    res
      .status(201)
      .json(
        new ApiResponse(201, "experience has been added", experienceCreate),
      );
  } catch (err) {
    next(err);
  }
};
