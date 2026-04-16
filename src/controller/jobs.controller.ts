import { Request, Response, NextFunction } from "express";
import { jobType } from "../generated/prisma";
import { ApiError } from "../utils/api.error";
import {
  deleteJobService,
  getAllJobsService,
  getJobByIdService,
  getMyJobsService,
  jobCreateService,
  searchJobsService,
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
      experienceMin,
      experienceMax,
      company,
      salaryMin,
      salaryMax,
      location,
      jobType,
    } = req.body;

    const jobsCreation = await jobCreateService(
      title,
      description,
      skillsRequired,
      experienceMin,
      experienceMax,
      company,
      location,
      salaryMin,
      salaryMax,
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

    const updatedJob = await updateJobService(
      req.params.jobId,
      userId,
      req.body,
    );

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

export const searchJobs = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const jobs = await searchJobsService(
      {
        title:
          typeof req.query.title === "string"
            ? req.query.title.trim()
            : undefined,
        location:
          typeof req.query.location === "string"
            ? req.query.location.trim()
            : undefined,
        company:
          typeof req.query.company === "string"
            ? req.query.company.trim()
            : undefined,
        jobType:
          typeof req.query.jobType === "string"
            ? (req.query.jobType.trim() as jobType)
            : undefined,
        skillsRequired:
          typeof req.query.skillsRequired === "string"
            ? req.query.skillsRequired
                .split(",")
                .map((skill) => skill.trim())
                .filter(Boolean)
            : undefined,
      },
      page,
      limit,
    );

    res
      .status(200)
      .json(new ApiResponse(200, "jobs fetched successfully", jobs));
  } catch (err) {
    next(err);
  }
};

export const getMyJobs = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.id;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    if (!userId) {
      throw new ApiError(401, "User not authenticated");
    }

    const jobs = await getMyJobsService(
      userId,
      {
        title:
          typeof req.query.title === "string"
            ? req.query.title.trim()
            : undefined,
        location:
          typeof req.query.location === "string"
            ? req.query.location.trim()
            : undefined,
        company:
          typeof req.query.company === "string"
            ? req.query.company.trim()
            : undefined,
        jobType:
          typeof req.query.jobType === "string"
            ? (req.query.jobType.trim() as jobType)
            : undefined,
      },
      page,
      limit,
    );

    res
      .status(200)
      .json(new ApiResponse(200, "my jobs fetched successfully", jobs));
  } catch (err) {
    next(err);
  }
};
