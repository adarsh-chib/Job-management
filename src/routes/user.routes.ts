import Express from "express";
import { userLogin, userRegister } from "../controller/user.controller";

const userRouter = Express.Router();

userRouter.post('/create', userRegister);
userRouter.get('/userlogin', userLogin);

export default userRouter;