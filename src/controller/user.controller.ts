import { NextFunction, Request, Response } from "express"
import { userLoginService, userRegisterService } from "../services/user.service";
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