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


export const deleteProfileServices = async(email : string,
    userID : string
)=>{

    const user = await prisma.user.findUnique({
        where : {email}
    });

    if(!user){
        throw new ApiError(404, "user not found")
    }

    await prisma.profile.delete({
        where : {
            userId : userID
        }
    })

}
