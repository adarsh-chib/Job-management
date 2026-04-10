import { jobType } from "../../generated/prisma";
import prisma from "../configs/prisma";
import { ApiError } from "../utils/api.error";

export const jobCreateService = async (
  title: string,
  description: string,
  skillsRequired: string[],
  experienceRequired: string,
  company: string | undefined,
  location: string | undefined,
  salary: string | undefined,
  jobType: jobType,
  createdById: string,
) => {
  const existingJob = await prisma.job.findFirst({
    where: {
      createdById,
    },
    select: {
      id: true,
    },
  });

  if (existingJob) {
    throw new ApiError(
      400,
      "You already have an active job. Delete the existing job before creating a new one.",
    );
  }

  const postingUser = await prisma.user.findUnique({
    where: {
      id: createdById,
    },
    select: {
      id: true,
      fullName: true,
      role: true,
      Profile: {
        select: {
          companyName: true,
          designation: true,
          postedByType: true,
        },
      },
    },
  });

  if (!postingUser) {
    throw new ApiError(404, "user not found");
  }

  if (!["admin", "manager"].includes(postingUser.role)) {
    throw new ApiError(403, "only admin or manager can create jobs");
  }

  if (!postingUser.Profile) {
    throw new ApiError(
      400,
      "Create your profile first with company or freelancer details before posting a job.",
    );
  }

  const { companyName, postedByType } = postingUser.Profile;

  if (!postedByType) {
    throw new ApiError(
      400,
      "Set postedByType in your profile as company or freelancer before posting a job.",
    );
  }

  if (postedByType === "company" && !companyName) {
    throw new ApiError(
      400,
      "Company name is required in profile for company job posting.",
    );
  }

  const resolvedCompany =
    postedByType === "company"
      ? companyName
      : company || companyName || `${postingUser.fullName} (Freelancer)`;

  if (!resolvedCompany) {
    throw new ApiError(400, "Company name could not be resolved for this job.");
  }

  return await prisma.job.create({
    data: {
      title,
      description,
      skillsRequired,
      experienceRequired,
      company: resolvedCompany,
      location,
      salary,
      jobType,
      createdById,
    },
  });
};

type UpdateJobInput = {
  title?: string;
  description?: string;
  skillsRequired?: string[];
  experienceRequired?: string;
  company?: string;
  location?: string;
  salary?: string;
  jobType?: jobType;
};

export const getAllJobsService = async () => {
  return prisma.job.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getJobByIdService = async (jobId: string) => {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
  });

  if (!job) {
    throw new ApiError(404, "job not found");
  }

  return job;
};

export const updateJobService = async (
  jobId: string,
  requesterId: string,
  data: UpdateJobInput,
) => {
  const existingJob = await prisma.job.findUnique({
    where: { id: jobId },
    select: { id: true, createdById: true },
  });

  if (!existingJob) {
    throw new ApiError(404, "job not found");
  }

  if (existingJob.createdById !== requesterId) {
    throw new ApiError(403, "you can only update your own job");
  }

  return prisma.job.update({
    where: { id: jobId },
    data,
  });
};

export const deleteJobService = async (jobId: string, requesterId: string) => {
  const existingJob = await prisma.job.findUnique({
    where: { id: jobId },
    select: { id: true, createdById: true },
  });

  if (!existingJob) {
    throw new ApiError(404, "job not found");
  }

  if (existingJob.createdById !== requesterId) {
    throw new ApiError(403, "you can only delete your own job");
  }

  return prisma.job.delete({
    where: { id: jobId },
  });
};


type SearchJobsFilters = {
  title?: string;
  location?: string;
  company?: string;
  jobType?: jobType;
};

export const searchJobsService = async (filters: SearchJobsFilters) => {
  return prisma.job.findMany({
    where: {
      ...(filters.title && {
        title: { contains: filters.title, mode: "insensitive" },
      }),
      ...(filters.location && {
        location: { contains: filters.location, mode: "insensitive" },
      }),
      ...(filters.company && {
        company: { contains: filters.company, mode: "insensitive" },
      }),
      ...(filters.jobType && {
        jobType: filters.jobType,
      }),
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getMyJobsService = async (
  userId: string,
  filters: SearchJobsFilters,
) => {
  return prisma.job.findMany({
    where: {
      createdById: userId,
      ...(filters.title && {
        title: { contains: filters.title, mode: "insensitive" },
      }),
      ...(filters.location && {
        location: { contains: filters.location, mode: "insensitive" },
      }),
      ...(filters.company && {
        company: { contains: filters.company, mode: "insensitive" },
      }),
      ...(filters.jobType && {
        jobType: filters.jobType,
      }),
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

