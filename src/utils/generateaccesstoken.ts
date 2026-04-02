import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_EXPRESS_IN, JWT_ACCESS_SECRET } from "../configs/jwt";

export const generateAccessToken = (payload: object) => {
    return jwt.sign(payload, JWT_ACCESS_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPRESS_IN
    });
}














