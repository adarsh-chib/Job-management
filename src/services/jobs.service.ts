import { jobType } from "../generated/prisma";
import prisma from "../configs/prisma";
import { ApiError } from "../utils/api.error";

export const jobCreateService = async (
  title: string,
  description: string,
  skillsRequired: string[],
  experienceMin: number | undefined,
  experienceMax: number | undefined,
  company: string | undefined,
  location: string | undefined,
  salaryMin: number | undefined,
  salaryMax: number | undefined,
  jobType: jobType | undefined,
  createdById: string,
) => {
  if (!company) {
    throw new ApiError(400, "company is required");
  }

  return await prisma.job.create({
    data: {
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
      createdById,
    },
  });
};

type UpdateJobInput = {
  title?: string;
  description?: string;
  skillsRequired?: string[];
  experienceMin?: number;
  experienceMax?: number;
  company?: string;
  salaryMin?: number;
  salaryMax?: number;
  location?: string;
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
  skillsRequired?: string[];
};

export const searchJobsService = async (
  filters: SearchJobsFilters,
  page: number,
  limit: number,
) => {
  const skip = (page - 1) * limit;

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
      ...(filters.skillsRequired?.length && {
        skillsRequired: {
          hasSome: filters.skillsRequired,
        },
      }),
    },
    orderBy: {
      createdAt: "desc",
    },
    skip,
    take: limit,
  });
};

export const getMyJobsService = async (
  userId: string,
  filters: SearchJobsFilters,
  page: number,
  limit: number,
) => {
  const skip = (page - 1) * limit;
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
    skip,
    take: limit,
  });
};
