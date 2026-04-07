import { Response, Request, NextFunction } from "express";
import { ApiError } from "../utils/api.error";
import {
  createEducationServices,
  deleteEducationServices,
  getEducationsService,
  updateEducationServices,
} from "../services/education.service";
import { ApiResponse } from "../utils/api.response";
import logger from "../configs/logger";

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
      .status(201)
      .json(
        new ApiResponse(
          201,
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
      .status(200)
      .json(new ApiResponse(201, "data has been updated", updateData));
  } catch (err) {
    next(err);
  }
};

export const deleteEducation = async (
  req: Request<{ educationId: string }>,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?.id;
  if (!userId) {
    throw new ApiError(404, "user not found");
  }
  const educationId = req.params.educationId;
  if (!educationId) {
    throw new ApiError(400, "education id is required");
  }
  try {
    const deletedData = await deleteEducationServices(educationId, userId);

    logger.info("education data deleted", {
      education: deletedData,
    });

    res
      .status(200)
      .json(
        new ApiResponse(200, "education data has been deleted", deletedData),
      );
  } catch (err) {
    next(err);
  }
};


export const getEducations = async(
  req : Request,
  res : Response,
  next : NextFunction,
)=>{
  try{
    const allEducationsData = await getEducationsService()

    res.status(200).json(new ApiResponse(200, "all data fetched successfully", allEducationsData));
  }
  catch(err){
    next(err);
  }
}
