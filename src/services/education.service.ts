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
  const existingEducation = await prisma.education.findFirst({
    where: {
      userId: data.userId,
    },
  });

  if (existingEducation) {
    throw new ApiError(409, "education already exists for this user");
  }

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
    throw new ApiError(404, "education id does not exist");
  }

  return await prisma.education.update({
    where: {
      id: educationId,
    },
    data,
  });
};

export const deleteEducationServices = async (
  educationId: string,
  userId: string,
) => {
  const existingeducation = await prisma.education.findFirst({
    where: {
      id: educationId,
      userId,
    },
  });

  if (!existingeducation) {
    throw new ApiError(404, "education id does not exist");
  }
  return await prisma.education.delete({
    where: {
      id: educationId,
    },
  });
};



export const getEducationsService = async () => {
  return await prisma.education.findMany({
    orderBy: {
      startDate: "desc",
    },
  });
};
