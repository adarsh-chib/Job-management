import { Request, Response, NextFunction } from "express";
import { createProfile } from "../services/profile.services";
import { ApiResponse } from "../utils/api.response";
import { ApiError } from "../utils/api.error";

export const createProfileController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const userId = req.user?.id;      //req.user = decoded

        if (!userId) {
            throw new ApiError(401, "User not authenticated");
        }

        const profileData = {
            ...req.body,
            userId
        };

        const newProfile = await createProfile(profileData);

        return res
            .status(201)
            .json(new ApiResponse(201, "Profile created successfully", newProfile));
    } catch (error) {
        next(error);
    }
};


