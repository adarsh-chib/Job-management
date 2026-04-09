import prisma from "../configs/prisma";
import { ApiError } from "../utils/api.error";

type CreateEducationInput = {
  institutionName: string;
  qualification: string;
  fieldOfStudy?: string;
  startDate: Date;
  endDate?: Date;
  grade?: string;
  description?: string;
  profile: {
    connect: {
      id: string;
    };
  };
};

export const createEducationServices = async (data: CreateEducationInput[]) => {
  return await Promise.all(
    data.map((education: CreateEducationInput) =>
      prisma.education.create({
        data: education,
      }),
    ),
  );
};

export const updateEducationServices = async (
  educationId: string,
  userId: string,
  data: {
    institutionName?: string;
    qualification?: string;
    fieldOfStudy?: string;
    startDate?: Date;
    endDate?: Date;
    grade?: string;
    description?: string;
  },
) => {
  const profile = await prisma.profile.findUnique({
    where: { userId },
  });
  if (!profile) {
    throw new ApiError(404, "profile not found");
  }

  const existingEducation = await prisma.education.findFirst({
    where: {
      id: educationId,
      profileId: profile.id,
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
  const profile = await prisma.profile.findUnique({
    where: {
      userId,
    },
  });

  if (!profile) {
    throw new ApiError(400, "profile does not exists");
  }

  const existingEducation = await prisma.education.findFirst({
    where: {
      id: educationId,
      profileId: profile.id,
    },
  });

  if (!existingEducation) {
    throw new ApiError(404, "education id does not exist");
  }

  return await prisma.education.delete({
    where: {
      id: educationId,
    },
  });
};


