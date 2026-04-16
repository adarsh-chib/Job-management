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

export const appliedApplicantsService = async (
  jobId: string,
  managerId: string,
) => {
  const job = await prisma.job.findFirst({
    where: {
      id: jobId,
      createdById: managerId,
    },
  });

  if (!job) {
    throw new ApiError(404, "job not found");
  }

  const applications = await prisma.jobApplication.findMany({
    where: { jobId },
    include: {
      candidate: {
        select: {
          id: true,
          fullName: true,
          email: true,
          Profile: {
            select: {
              headline: true,
              location: true,
              avatar: true,
              resume: true,
              skills: true,
            },
          },
        },
      },
    },
  });

  return applications;
};


export const updateApplicationStatus = async (
  applicationId: string,
  status: string,
  managerId: string
) => {
  const allowedStatus = ["shortlisted", "rejected"];
  if (!allowedStatus.includes(status)) {
    throw new Error("Invalid status");
  }
  const application = await prisma.jobApplication.findUnique({
    where: { id: applicationId },
    include: { job: true }
  });

  if (!application) {
    throw new Error("Application not found");
  }
  if (application.job.createdById !== managerId) {
    throw new Error("Unauthorized");
  }
  if (application.status !== "applied") {
    throw new Error("Application already decided");
  }

  const updatedApplication = await prisma.jobApplication.update({
    where: { id: applicationId },
    data: {
      status: status as any
    }
  });

  return updatedApplication;
};

export const getAppliedJobsServices = async (candidateId: string) => {
  const applications = await prisma.jobApplication.findMany({
    where: {
      candidateId,
    },
    include: {
      job: {
        select: {
          id: true,
          title: true,
          company: true,
          location: true,
          jobType: true,
          skillsRequired: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc", 
    },
  });

  return applications;
};




