import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/api.error";
import jwt from "jsonwebtoken";
import { JWT_ACCESS_SECRET } from "../configs/jwt";
import { IUserPayload } from "../types/express";
export const authenticationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ApiError(401, "access token is required"));
  }
  const token = authHeader.split(" ")[1];

  if (!JWT_ACCESS_SECRET) {
    return next(new ApiError(500, "JWT access secret is not configured"));
  }

  try {
    const decoded = jwt.verify(token, JWT_ACCESS_SECRET) as IUserPayload;
    req.user = decoded;
    next();
  } catch (err) {
    next(new ApiError(401, "invalid or expired access token"));
  }
};





