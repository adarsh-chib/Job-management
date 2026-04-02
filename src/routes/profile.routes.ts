import { Router } from "express";
import { createProfileController } from "../controller/profile.controller";
import { authenticationMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import { createProfileValidator } from "../validators/profile.validator";

const profileRouter = Router();


profileRouter.post(
    "/create",
    authenticationMiddleware,
    validate(createProfileValidator),
    createProfileController
);

export default profileRouter;
