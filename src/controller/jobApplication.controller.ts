import { Request, Response, NextFunction } from "express";
import { applyToJobServices } from "../services/jobApplication.service";
import { ApiResponse } from "../utils/api.response";
import { ApiError } from "../utils/api.error";

export const applyToJob = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const candidateId = req.user?.id;
    if (!candidateId) {
      throw new ApiError(401, "User not authenticated");
    }
    const { jobId, resume, coverLetter } = req.body;
    const jobApplied = await applyToJobServices(
      jobId,
      candidateId,
      resume,
      coverLetter,
    );

    res
      .status(201)
      .json(new ApiResponse(201, "you have been applied", jobApplied));
  } catch (err) {
    next(err);
  }
};
