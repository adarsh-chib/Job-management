import prisma from "../configs/prisma";
import { ApiError } from "../utils/api.error";

export const createProfileService = async (data: {
  userId: string;
  fullName: string;
  username: string;
  headline?: string;
  bio?: string;
  location?: string;
  avatar?: string;
  resume?: string;
  skills: string[];
  currentCompany?: string;
  currentPosition?: string;
  isOpenToWork: boolean;
  companyName?: string;
  designation?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
}) => {
  return await prisma.profile.create({
    data: {
      ...data,
    },
  });
};

export const updateProfileServices = async (
  userId: string,
  data: {
    fullName?: string;
    username?: string;
    headline?: string;
    bio?: string;
    location?: string;
    avatar?: string;
    resume?: string;
    skills?: string[];
    currentCompany?: string;
    currentPosition?: string;
    isOpenToWork?: boolean;
    companyName?: string;
    designation?: string;
    githubUrl?: string;
    portfolioUrl?: string;
    linkedinUrl?: string;
  },
) => {
  return await prisma.profile.update({
    where: {
      userId: userId,
    },
    data: data,
  });
};

export const deleteProfileServices = async (userId: string) => {
  const profile = await prisma.profile.findUnique({
    where: { userId },
  });

  if (!profile) {
    throw new ApiError(404, "profile not found");
  }

  await prisma.$transaction([
    prisma.education.deleteMany({
      where: { profileId: profile.id },
    }),
    prisma.experience.deleteMany({
      where: { profileId: profile.id },
    }),
    prisma.profile.delete({
      where: { userId },
    }),
  ]);
};

export const getAllProfilesService = async (
  skip: number,
  limit: number,
  search?: string,
) => {
  const profiles = await prisma.profile.findMany({
    where: search
      ? {
          OR: [
            { fullName: { contains: search, mode: "insensitive" } },
            { username: { contains: search, mode: "insensitive" } },
            { headline: { contains: search, mode: "insensitive" } },
            { location: { contains: search, mode: "insensitive" } },
            { currentCompany: { contains: search, mode: "insensitive" } },
            { currentPosition: { contains: search, mode: "insensitive" } },
            { skills: { has: search } },
          ],
        }
      : {},

    skip,
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      fullName: true,
      username: true,
      headline: true,
      bio: true,
      location: true,
      avatar: true,
      skills: true,
      currentCompany: true,
      currentPosition: true,
    },
  });

  return profiles;
};

const fullProfileSelect = {
  id: true,
  userId: true,
  fullName: true,
  username: true,
  headline: true,
  bio: true,
  location: true,
  avatar: true,
  resume: true,
  skills: true,
  currentCompany: true,
  currentPosition: true,
  isOpenToWork: true,
  companyName: true,
  designation: true,
  githubUrl: true,
  portfolioUrl: true,
  linkedinUrl: true,
  educations: {
    orderBy: {
      startDate: "desc" as const,
    },
  },
  experiences: {
    orderBy: {
      startDate: "desc" as const,
    },
  },
};

export const getMyProfileService = async (userId: string) => {
  const profile = await prisma.profile.findUnique({
    where: { userId },
    select: fullProfileSelect,
  });
  if (!profile) {
    throw new ApiError(404, "profile not found");
  }

  return profile;
};

export const getProfileByUsernameService = async (username: string) => {
  const profile = await prisma.profile.findUnique({
    where: { username },
    select: fullProfileSelect,
  });

  if (!profile) {
    throw new ApiError(404, "Profile not found");
  }

  return profile;
};

export const upsertProfileServices = async (
  userId: string,
  data: {
    fullName: string;
    username: string;
    headline?: string;
    bio?: string;
    location?: string;
    avatar?: string;
    resume?: string;
    skills: string[];
    currentCompany?: string;
    currentPosition?: string;
    isOpenToWork: boolean;
    companyName?: string;
    designation?: string;
    githubUrl?: string;
    portfolioUrl?: string;
    linkedinUrl?: string;
  },
) => {
  return await prisma.profile.upsert({
    where: { userId },
    update: {
      ...data,
    },
    create: {
      ...data,
      user: {
        connect: {
          id: userId,
        },
      },
    },
  });
};

type UpdateNestedEducationInput = {
  id?: string;
  institutionName: string;
  qualification: string;
  fieldOfStudy?: string;
  startDate: Date;
  endDate?: Date;
  grade?: string;
  description?: string;
};

type UpdateNestedExperienceInput = {
  id?: string;
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
};

type UpdateProfileWithRelationsInput = {
  profile: {
    fullName?: string;
    username?: string;
    headline?: string;
    bio?: string;
    location?: string;
    avatar?: string;
    resume?: string;
    skills?: string[];
    currentCompany?: string;
    currentPosition?: string;
    isOpenToWork?: boolean;
    companyName?: string;
    designation?: string;
    githubUrl?: string;
    portfolioUrl?: string;
    linkedinUrl?: string;
  };
  education?: UpdateNestedEducationInput[];
  experience?: UpdateNestedExperienceInput[];
  deletedEducationIds?: string[];
  deletedExperienceIds?: string[];
};

export const updateProfileWithRelationsService = async (
  userId: string,
  payload: UpdateProfileWithRelationsInput,
) => {
  const {
    profile,
    education = [],
    experience = [],
    deletedEducationIds = [],
    deletedExperienceIds = [],
  } = payload;

  const existingProfile = await prisma.profile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!existingProfile) {
    throw new ApiError(404, "profile not found");
  }

  await prisma.$transaction(async (tx) => {
    if (profile && Object.keys(profile).length > 0) {
      await tx.profile.update({
        where: { userId },
        data: profile,
      });
    }

    // Process Education
    for (const educationItem of education) {
      const educationData = {
        institutionName: educationItem.institutionName,
        qualification: educationItem.qualification,
        fieldOfStudy: educationItem.fieldOfStudy,
        startDate: educationItem.startDate,
        endDate: educationItem.endDate,
        grade: educationItem.grade,
        description: educationItem.description,
      };

      if (educationItem.id) {
        await tx.education.update({
          where: { id: educationItem.id, profileId: existingProfile.id },
          data: educationData,
        });
      } else {
        await tx.education.create({
          data: {
            ...educationData,
            profileId: existingProfile.id,
          },
        });
      }
    }

    // Process Experience
    for (const experienceItem of experience) {
      const experienceData = {
        companyName: experienceItem.companyName,
        jobTitle: experienceItem.jobTitle,
        employmentType: experienceItem.employmentType,
        location: experienceItem.location,
        locationType: experienceItem.locationType,
        startDate: experienceItem.startDate,
        endDate: experienceItem.endDate,
        isCurrent: experienceItem.isCurrent,
        description: experienceItem.description,
        skills: experienceItem.skills,
      };

      if (experienceItem.id) {
        await tx.experience.update({
          where: { id: experienceItem.id, profileId: existingProfile.id },
          data: experienceData,
        });
      } else {
        await tx.experience.create({
          data: {
            ...experienceData,
            profileId: existingProfile.id,
          },
        });
      }
    }

    // Process Deletions
    if (deletedEducationIds.length > 0) {
      await tx.education.deleteMany({
        where: {
          id: { in: deletedEducationIds },
          profileId: existingProfile.id,
        },
      });
    }

    if (deletedExperienceIds.length > 0) {
      await tx.experience.deleteMany({
        where: {
          id: { in: deletedExperienceIds },
          profileId: existingProfile.id,
        },
      });
    }
  });

  return prisma.profile.findUnique({
    where: { userId },
    select: fullProfileSelect,
  });
};
