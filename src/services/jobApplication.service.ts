import prisma from "../configs/prisma";
import { ApiError } from "../utils/api.error";

export const applyToJobServices = async (
  jobId: string,
  candidateId: string,
  resume: string,
  coverLetter: string,
) => {
  const findjob = await prisma.job.findUnique({
    where: {
      id: jobId,
    },
  });

  if (!findjob) {
    throw new ApiError(404, "job not found");
  }

  const existing = await prisma.jobApplication.findFirst({
    where: {
      jobId,
      candidateId,
    },
  });

  if (existing) {
    throw new ApiError(409, "you have already applied for this job");
  }

  const applyForjob = await prisma.jobApplication.create({
    data: {
      jobId,
      candidateId,
      resume,
      coverLetter,
    },
  });

  return applyForjob;
};
