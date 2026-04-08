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

export const deleteProfileServices = async (email: string, userID: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError(404, "user not found");
  }

  await prisma.profile.delete({
    where: {
      userId: userID,
    },
  });
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
          grade : true,
        },
      },
    },
  });

  return getProfile;
};
