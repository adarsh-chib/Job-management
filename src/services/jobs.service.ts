import prisma from "../configs/prisma"

export const jobCreateService = async(
    title : string,
    description : string,
    company : string,
    location : string,
    createdById : string
)=>{
    return await prisma.job.create({
        data : {
            title,
            description,
            company,
            location,
            createdById,
        }
    })
}