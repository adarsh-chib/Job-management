import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

export const validate =
  (schema: z.ZodTypeAny) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
      //parseAsync check whether the data follows the rule or not
    } catch (error) {
      if (error instanceof ZodError) {
        //checks it this zod validation error or something else
        return res.status(400).json({
          status: 400,
          message: "validation failed",
          errors: error.issues,
        });
      }
      next(error);
    }
  };
