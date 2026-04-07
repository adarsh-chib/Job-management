import prisma from "../configs/prisma";
import { ApiError } from "../utils/api.error";

export const createEducationServices = async (data: {
  userId: string;
  schoolName: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: Date;
  endDate?: Date;
  grade?: string;
  description?: string;
}) => {
  return await prisma.education.create({
    data: {
      ...data,
    },
  });
};

export const updateEducationServices = async (
  educationId: string,
  userId: string,
  data: {
    schoolName?: string;
    degree?: string;
    fieldOfStudy?: string;
    startDate?: Date;
    endDate?: Date;
    grade?: string;
    description?: string;
  },
) => {
  const existingEducation = await prisma.education.findFirst({
    where: {
      id: educationId,
      userId,
    },
  });

  if (!existingEducation) {
    throw new ApiError(404, "education not found");
  }

  return await prisma.education.update({
    where: {
      id: educationId,
    },
    data,
  });
};
