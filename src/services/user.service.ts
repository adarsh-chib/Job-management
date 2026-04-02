import prisma from "../configs/prisma";
import bcrypt from 'bcrypt'
import { ApiError } from "../utils/api.error";
import { generateAccessToken } from "../utils/generateaccesstoken";
import { generateRefreshToken } from "../utils/generaterefreshtoken";
import { ref } from "node:process";

export const userRegisterService = async (data: {
  fullName: string;
  email: string;
  password : string;
  role : string;
}) => {
    
  const existingUser = await prisma.user.findUnique({
    where : {email : data.email}
  })

  if(existingUser){
    throw new ApiError(409, "user already existed");
  }
  const hashPassword = await bcrypt.hash(data.password, 10)
  
  const user = await prisma.user.create({
    data: {
      fullName: data.fullName,
      email: data.email,
      password : hashPassword,
      role : data.role
    },
  });
   
  const {password, ...userWithoutPassword} = user;


  return userWithoutPassword;
};

export const userLoginService = async (
  data : {
    email : string
    password : string
    role : string
  }
)=>{
  const findUser = await prisma.user.findUnique({
    where : {
      email : data.email
    }
  })

  if(!findUser){
    throw new ApiError(404, "user not found")
  }

  

  const comparePassword =  await bcrypt.compare(data.password, findUser.password);

  if(!comparePassword){
    throw new ApiError(402, "invalid email and password")
  }

  const payload = {
    email : findUser.email,
    role : findUser.role,
    id : findUser.id
  }

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload)

  const {password, ...userWithoutPassword} = findUser;


  return {
    userWithoutPassword,
    accessToken,
    refreshToken
  }
}
