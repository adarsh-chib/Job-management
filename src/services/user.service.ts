import prisma from "../configs/prisma";
import bcrypt from "bcrypt";
import { ApiError } from "../utils/api.error";
import { generateAccessToken } from "../utils/generateaccesstoken";
import { generateRefreshToken } from "../utils/generaterefreshtoken";
import { Role } from "../../generated/prisma/client";

export const userRegisterService = async (data: {
  fullName: string;
  email: string;
  password: string;
  role: Role;
}) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new ApiError(409, "user already existed");
  }
  const hashPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      fullName: data.fullName,
      email: data.email,
      password: hashPassword,
      role: data.role,
    },
  });

  const { password, ...userWithoutPassword } = user;

  return userWithoutPassword;
};

export const userLoginService = async (data: {
  email: string;
  password: string;
  role: string;
}) => {
  const findUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!findUser) {
    throw new ApiError(404, "user not found");
  }

  if (!findUser.password) {
    throw new ApiError(400, "password login is not available for this user");
  }

  const comparePassword = await bcrypt.compare(
    data.password,
    findUser.password,
  );

  if (!comparePassword) {
    throw new ApiError(402, "invalid email and password");
  }

  const payload = {
    email: findUser.email,
    role: findUser.role,
    id: findUser.id,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  const { password, ...userWithoutPassword } = findUser;

  return {
    userWithoutPassword,
    accessToken,
    refreshToken,
  };
};

export const resetPasswordServices = async (data: {
  email: string;
  newpassword: string;
  role: Role;
}) => {
  const { email, newpassword, role } = data;
  const findUser = await prisma.user.findFirst({
    where: {
      email: email,
      role: role,
    },
  });

  if (!findUser) {
    throw new ApiError(404, "user not found");
  }

  const hashedPassword = await bcrypt.hash(newpassword, 10);

  const updatedUser = await prisma.user.update({
    where: { email: email },
    data: { password: hashedPassword },
  });

  const { password, ...userWithoutPassword } = updatedUser;
  return userWithoutPassword;
};

export const userDeleteServices = async (data: {
  email: string;
  password: string;
  confirm: string;
}) => {
  const findUser = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!findUser) {
    throw new ApiError(404, "User doesn't exists");
  }

  if (!findUser.password) {
    throw new ApiError(400, "password delete is not available for this user");
  }

  const confirmPassword = await bcrypt.compare(
    data.password,
    findUser.password,
  );

  if (!confirmPassword) {
    throw new ApiError(404, "invalid email and password");
  }

  if (data.confirm !== "delete") {
    throw new ApiError(400, "confirm delete first ");
  }

  await prisma.profile.deleteMany({
    where: {
      userId: findUser.id,
    },
  });

  const userDelete = await prisma.user.delete({
    where: {
      email: data.email,
    },
  });

  const { password, ...userwithoutPassword } = userDelete;
  return userwithoutPassword;
};

export const getUsersDataServices = async () => {
  const user = await prisma.user.findMany({
    select: {
      id: true,
      fullName: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      Profile: {
        select: {
          bio: true,
        },
      },
    },
  });

  return user;
};
