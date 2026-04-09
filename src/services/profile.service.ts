import { connect } from "node:http2";
import prisma from "../configs/prisma";
import { ApiError } from "../utils/api.error";

export const createProfile = async (data: {
  userId: string;
  fullName: string;
  username: string;
  headline?: string;
  bio?: string;
  location?: string;
  avatar?: string;
  skills: string[];
  currentCompany?: string;
  currentPosition?: string;
  isOpenToWork: boolean;
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
    skills?: string[];
    currentCompany?: string;
    currentPosition?: string;
    isOpenToWork?: boolean;
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
      skills: true,
      currentCompany: true,
      currentPosition: true,
      educations: {
        select: {
          id: true,
          institutionName: true,
          qualification: true,
          fieldOfStudy: true,
          grade: true,
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
    skills: string[];
    currentCompany?: string;
    currentPosition?: string;
    isOpenToWork: boolean;
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
