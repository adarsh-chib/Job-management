import { Request, Response, NextFunction } from "express";
import {
  appliedApplicantsService,
  applyToJobServices,
  updateApplicationStatus as updateApplicationStatusService,
  getAppliedJobsServices,
} from "../services/jobApplication.service";
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

export const appliedApplicants = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const managerId = req.user?.id;
    const { jobId } = req.params;

    if (!managerId) {
      throw new ApiError(404, "user not found");
    }

    const appliedApplicantsJobs = await appliedApplicantsService(
      jobId as string,
      managerId as string,
    );

    res
      .status(200)
      .json(new ApiResponse(200, "Applied applicants", appliedApplicantsJobs));
  } catch (err) {
    next(err);
  }
};

export const updateApplicationStatus = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const managerId = req.user?.id;
    const { applicationId } = req.params;
    const { status } = req.body;

    if (!managerId) {
      throw new ApiError(404, "user not found");
    }

    const updatedApplication = await updateApplicationStatusService(
      applicationId as string,
      status,
      managerId as string,
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          `Application status updated to ${status}`,
          updatedApplication,
        ),
      );
  } catch (err) {
    next(err);
  }
};

export const myAppliedJobs = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const candidateId = req.user?.id;

    if (!candidateId) {
      throw new ApiError(401, "User not authenticated");
    }

    const applications = await getAppliedJobsServices(candidateId);

    res
      .status(200)
      .json(new ApiResponse(200, "Your applications retrieved successfully", applications));
  } catch (err) {
    next(err);
  }
};
