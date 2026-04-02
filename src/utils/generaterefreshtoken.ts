import jwt from "jsonwebtoken";
import { JWT_REFRESH_SECRET, REFRESH_TOKEN_EXPIRES_IN } from "../configs/jwt";

export const generateRefreshToken = (payload: object) => {
    return jwt.sign(payload, JWT_REFRESH_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRES_IN
    });
}














