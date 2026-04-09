import prisma from "../configs/prisma";
import { ApiError } from "../utils/api.error";

type CreateExperienceInput = {
  companyName: string;
  jobTitle: string;
  employmentType?: string;
  location?: string;
  locationType?: string;
  startDate: Date;
  endDate?: Date;
  isCurrent?: boolean;
  description?: string;
  skills: string[];
  profile: {
    connect: {
      id: string;
    };
  };
};

export const createExperienceServices = async (
  data: CreateExperienceInput[],
) => {
  return await Promise.all(
    data.map((experience: CreateExperienceInput) =>
      prisma.experince.create({
        data: experience,
      }),
    ),
  );
};

type UpdateExperienceInput = {
  companyName?: string;
  jobTitle?: string;
  employmentType?: string;
  location?: string;
  locationType?: string;
  startDate?: Date;
  endDate?: Date;
  isCurrent?: boolean;
  description?: string;
  skills?: string[];
};

export const updateExperienceServices = async (
  experienceId: string,
  userId: string,
  data: UpdateExperienceInput,
) => {
  const profile = await prisma.profile.findUnique({
    where: {
      userId,
    },
  });

  if (!profile) {
    throw new ApiError(404, "profile not found");
  }

  const existingExperience = await prisma.experince.findFirst({
    where: {
      id: experienceId,
      profileId: profile.id,
    },
  });

  if (!existingExperience) {
    throw new ApiError(404, "experience id does not exist");
  }

  return await prisma.experince.update({
    where: {
      id: experienceId,
    },
    data,
  });
};

export const deleteExperienceServices = async (
  experienceId: string,
  userId: string,
) => {
  const profile = await prisma.profile.findUnique({
    where: {
      userId,
    },
  });

  if (!profile) {
    throw new ApiError(404, "profile not found");
  }

  const existingExperience = await prisma.experince.findFirst({
    where: {
      id: experienceId,
      profileId: profile.id,
    },
  });

  if (!existingExperience) {
    throw new ApiError(404, "experience id does not exist");
  }

  return await prisma.experince.delete({
    where: {
      id: experienceId,
    },
  });
};
