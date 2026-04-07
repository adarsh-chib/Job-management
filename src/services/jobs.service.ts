import { jobType } from "../../generated/prisma";
import prisma from "../configs/prisma";

export const jobCreateService = async (
  title: string,
  description: string,
  skillsRequired: string[],
  experienceRequired: string,
  company: string,
  location: string,
  salary: string,
  jobType: jobType,
  createdById: string,
) => {
  return await prisma.job.create({
    data: {
      title,
      description,
      skillsRequired,
      experienceRequired,
      company,
      location,
      salary,
      jobType,
      createdById,
    },
  });
};
