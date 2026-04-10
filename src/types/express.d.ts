import { JwtPayload } from "jsonwebtoken";

export interface IUserPayload extends JwtPayload 
{
  id: string;
  email: string;
  role: "candidate" | "admin" | "manager";

}

declare global {
  namespace Express {
    interface Request {
      user?: IUserPayload;
      file?: Express.Multer.File;
      files?:
        | {
            [fieldname: string]: Express.Multer.File[];
          }
        | Express.Multer.File[];
    }
  }
}
