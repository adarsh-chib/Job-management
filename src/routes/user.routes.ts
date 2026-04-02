import Express from "express";
import {
    getUserdata,
  resetPassword,
  userDelete,
  userLogin,
  userRegister,
} from "../controller/user.controller";
import { validate } from "../middleware/validation.middleware";
import { signinValidator, signupValidator } from "../validators/auth.validator";
import { authenticationMiddleware } from "../middleware/auth.middleware";

const userRouter = Express.Router();

userRouter.post("/create", validate(signupValidator), userRegister);
userRouter.post("/userlogin", validate(signinValidator), userLogin);
userRouter.patch("/reset-password", authenticationMiddleware, resetPassword);
userRouter.delete("/delete", authenticationMiddleware, userDelete);
userRouter.get('/users',authenticationMiddleware, getUserdata);

export default userRouter;
