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
  postedByType?: "company" | "freelancer";
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
    postedByType?: "company" | "freelancer";
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
    prisma.experince.deleteMany({
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
  const getProfile = await prisma.profile.findMany({
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
      createdAt: "desc", // means new profile will come at top
    },
    select: {
      id: true,
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
      companyName: true,
      designation: true,
      postedByType: true,
      educations: {
        select: {
          id: true,
          institutionName: true,
          qualification: true,
          fieldOfStudy: true,
          grade: true,
        },
      },
      experince: {
        select: {
          companyName: true,
          jobTitle: true,
          employmentType: true,
          location: true,
          locationType: true,
          skills: true,
        },
      },
    },
  });

  return getProfile;
};

export const getMyProfileService = async (userId: string) => {
  const profile = await prisma.profile.findUnique({
    where: { userId },
    select: {
      id: true,
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
      postedByType: true,
      educations: {
        select: {
          id: true,
          institutionName: true,
          qualification: true,
          fieldOfStudy: true,
          startDate: true,
          endDate: true,
          grade: true,
        },
      },
    },
  });
  if (!profile) {
    throw new ApiError(404, "profile not found");
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
    postedByType?: "company" | "freelancer";
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
    postedByType?: "company" | "freelancer";
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
    if (Object.keys(profile).length > 0) {
      await tx.profile.update({
        where: { userId },
        data: profile,
      });
    }

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
        const existingEducation = await tx.education.findFirst({
          where: {
            id: educationItem.id,
            profileId: existingProfile.id,
          },
          select: { id: true },
        });

        if (!existingEducation) {
          throw new ApiError(
            404,
            `education not found for id ${educationItem.id}`,
          );
        }

        await tx.education.update({
          where: { id: educationItem.id },
          data: educationData,
        });
      } else {
        await tx.education.create({
          data: {
            ...educationData,
            profile: {
              connect: {
                id: existingProfile.id,
              },
            },
          },
        });
      }
    }

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
        const existingExperience = await tx.experince.findFirst({
          where: {
            id: experienceItem.id,
            profileId: existingProfile.id,
          },
          select: { id: true },
        });

        if (!existingExperience) {
          throw new ApiError(
            404,
            `experience not found for id ${experienceItem.id}`,
          );
        }

        await tx.experince.update({
          where: { id: experienceItem.id },
          data: experienceData,
        });
      } else {
        await tx.experince.create({
          data: {
            ...experienceData,
            profile: {
              connect: {
                id: existingProfile.id,
              },
            },
          },
        });
      }
    }

    if (deletedEducationIds.length > 0) {
      const educationCount = await tx.education.count({
        where: {
          id: { in: deletedEducationIds },
          profileId: existingProfile.id,
        },
      });

      if (educationCount !== deletedEducationIds.length) {
        throw new ApiError(
          404,
          "one or more education ids were not found for this profile",
        );
      }

      await tx.education.deleteMany({
        where: {
          id: { in: deletedEducationIds },
          profileId: existingProfile.id,
        },
      });
    }

    if (deletedExperienceIds.length > 0) {
      const experienceCount = await tx.experince.count({
        where: {
          id: { in: deletedExperienceIds },
          profileId: existingProfile.id,
        },
      });

      if (experienceCount !== deletedExperienceIds.length) {
        throw new ApiError(
          404,
          "one or more experience ids were not found for this profile",
        );
      }

      await tx.experince.deleteMany({
        where: {
          id: { in: deletedExperienceIds },
          profileId: existingProfile.id,
        },
      });
    }
  });

  return prisma.profile.findUnique({
    where: { userId },
    select: {
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
      postedByType: true,
      githubUrl: true,
      portfolioUrl: true,
      linkedinUrl: true,
      educations: {
        orderBy: {
          createdAt: "desc",
        },
      },
      experince: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
};
