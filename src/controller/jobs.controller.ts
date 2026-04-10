import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api.error";
import {
  deleteJobService,
  getAllJobsService,
  getJobByIdService,
  jobCreateService,
  updateJobService,
} from "../services/jobs.service";
import { ApiResponse } from "../utils/api.response";

export const jobsCreate = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new ApiError(401, "User not authenticated");
    }

    const {
      title,
      description,
      skillsRequired,
      experienceRequired,
      company,
      location,
      salary,
      jobType,
    } = req.body;

    const jobsCreation = await jobCreateService(
      title,
      description,
      skillsRequired,
      experienceRequired,
      company,
      location,
      salary,
      jobType,
      userId,
    );

    res
      .status(201)
      .json(new ApiResponse(201, "new job has been posted", jobsCreation));
  } catch (err) {
    next(err);
  }
};

export const getAllJobs = async (
  _req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const jobs = await getAllJobsService();

    res
      .status(200)
      .json(new ApiResponse(200, "jobs fetched successfully", jobs));
  } catch (err) {
    next(err);
  }
};

export const getJobById = async (
  req: Request<{ jobId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const job = await getJobByIdService(req.params.jobId);

    res.status(200).json(new ApiResponse(200, "job fetched successfully", job));
  } catch (err) {
    next(err);
  }
};

export const updateJob = async (
  req: Request<{ jobId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new ApiError(401, "User not authenticated");
    }

    const updatedJob = await updateJobService(req.params.jobId, userId, req.body);

    res
      .status(200)
      .json(new ApiResponse(200, "job updated successfully", updatedJob));
  } catch (err) {
    next(err);
  }
};

export const deleteJob = async (
  req: Request<{ jobId: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      throw new ApiError(401, "User not authenticated");
    }

    const deletedJob = await deleteJobService(req.params.jobId, userId);

    res
      .status(200)
      .json(new ApiResponse(200, "job deleted successfully", deletedJob));
  } catch (err) {
    next(err);
  }
};
