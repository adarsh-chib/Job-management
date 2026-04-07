import {Request, Response,  NextFunction } from "express";
import { ApiError } from "../utils/api.error";
import { jobCreateService } from "../services/jobs.service";
import { ApiResponse } from "../utils/api.response";


export const jobsCreate = async(
    req : Request,
    res : Response,
    next: NextFunction
)=>{
    try{
        const userId = req.user?.id       
            if (!userId) {
              throw new ApiError(401, "User not authenticated");
            }

            const { title,
            description,
            company,
            location,
            userI } = req.body

            const jobsCreation = await jobCreateService(title, description, company, location, userId);

            res.status(201).json(new ApiResponse(201, "new job has been posted", jobsCreation));
    }
    catch(err){
        next(err);
    }
}