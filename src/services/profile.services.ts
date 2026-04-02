import prisma from "../configs/prisma";

export const createProfile = async (
    data: {
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
    }
) => {
    return await prisma.profile.create({
        data: {
            ...data
        }
    });
};


