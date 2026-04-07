import {Response, Request, NextFunction } from "express";
import { ApiError } from "../utils/api.error";
import { createEducationServices } from "../services/education.service";
import { ApiResponse } from "../utils/api.response";

export const createEducation = async(
    req : Request,
    res : Response,
    next : NextFunction
)=>{
    try{
        const userId = req.user?.id
         
        if(!userId){
            throw new ApiError(404, "user not found");
        }

        const educationData = { ...req.body, userId}

        const educationCreate = await createEducationServices(educationData);

        res.status(200).json( new ApiResponse(200, "education data has been created", educationCreate))
    }

    catch(err){
        next(err);
    }
}