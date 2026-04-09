import prisma from "../configs/prisma";

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
