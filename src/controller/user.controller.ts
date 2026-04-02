import { NextFunction, Request, Response } from "express"
import { getUsersDataServices, resetPasswordServices, userDeleteServices, userLoginService, userRegisterService } from "../services/user.service";
import { ApiResponse } from "../utils/api.response";

export const userRegister = async (req: Request, res: Response, next: NextFunction) => {



    const { fullName, email, password, role } = req.body;




    try {
        const createUser = await userRegisterService({ fullName, email, password, role });

        res.status(201).json(new ApiResponse(201, "new user has been created", createUser))
    }
    catch (err) {
        next(err)
    }
}

export const userLogin = async (
    req : Request,
    res : Response,
    next : NextFunction,
)=>{
   
    const {email, password, role} = req.body

    try{
        const getUser = await userLoginService({email, password, role})

        res.status(200).json(new ApiResponse(200, "user login",getUser))
    }
    catch(err){
        next(err);
    }
}

export const resetPassword = async(
    req : Request,
    res : Response,
    next : NextFunction
)=>{
    
    const {email, newpassword, role} = req.body

    try{
        const passwordReset = await resetPasswordServices({email, newpassword, role});

        res.status(200).json(new ApiResponse(200, "Password reset", passwordReset))
    }

    catch(err){
        next(err);
    }
}

export const userDelete = async (
    req : Request,
    res : Response,
    next : NextFunction
)=>{
    const {email, password, confirm} = req.body

    try{
        const userAccountDelete = await userDeleteServices({email, password, confirm})

        res.status(200).json(new ApiResponse(200, "user has been deleted",userAccountDelete));
    }
    catch(err){
        next(err);
    }
}


export const getUserdata = async(
    req : Request,
    res : Response,
    next : NextFunction
)=>{
    try{
        const usersData = await getUsersDataServices();
        res.status(200).json(new ApiResponse(200, "All profile fetched",usersData))
    }
    catch(err){
        next(err);
    }
}