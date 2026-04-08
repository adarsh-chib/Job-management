import prisma from "../configs/prisma";

export const createExperienceServices = async (data: {
  profileId: string;
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
}) => {
  return await prisma.experince.create({
    data: {
      ...data,
    },
  });
};
