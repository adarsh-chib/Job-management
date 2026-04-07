import { Response, Request, NextFunction } from "express";
import { ApiError } from "../utils/api.error";
import {
  createEducationServices,
  updateEducationServices,
} from "../services/education.service";
import { ApiResponse } from "../utils/api.response";

export const createEducation = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new ApiError(404, "user not found");
    }

    const educationData = { ...req.body, userId };

    const educationCreate = await createEducationServices(educationData);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "education data has been created",
          educationCreate,
        ),
      );
  } catch (err) {
    next(err);
  }
};

export const updateEducation = async (
  req: Request<{ educationId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(404, "user not found");
    }

    const educationId = req.params.educationId;

    if (!educationId) {
      throw new ApiError(400, "education id is required");
    }
    const educationData = req.body;

    const updateData = await updateEducationServices(
      educationId,
      userId,
      educationData,
    );

    res
      .status(201)
      .json(new ApiResponse(201, "data has been updated", updateData));
  } catch (err) {
    next(err);
  }
};
