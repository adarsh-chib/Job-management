import { Request, Response, NextFunction } from "express";
import {
  sendMessageService,
  getChatHistoryService,
  getUserConversationsService,
} from "../services/message.service";
import { ApiError } from "../utils/api.error";
import { io, onlineUsers } from "../index";

export const sendMessage = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const senderId = req.user?.id;

  if (!senderId) {
    throw new ApiError(401, "unauthorized");
  }
  const { receiverId, content } = req.body;

  try {
    const message = await sendMessageService(senderId, receiverId, content);

    const receiverSocketId = onlineUsers.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", {
        id: message.id,
        senderId,
        content,
        createdAt: message.createdAt,
      });
    }

    res.status(201).json({
      status: 201,
      message: "message send successfully",
      data: message,
    });
  } catch (err) {
    next(err);
  }
};

export const getChatHistory = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?.id;
  const otherUserId = req.params.userId as string;

  if (!userId) {
    throw new ApiError(401, "unauthorized");
  }

  try {
    const messages = await getChatHistoryService(userId, otherUserId);
    res.status(200).json({
      status: 200,
      message: "Chat history fetched successfully",
      data: messages,
    });
  } catch (err) {
    next(err);
  }
};

export const getUserConversations = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new ApiError(401, "unauthorized");
  }

  try {
    const conversations = await getUserConversationsService(userId);
    res.status(200).json({
      status: 200,
      message: "Conversations fetched successfully",
      data: conversations,
    });
  } catch (err) {
    next(err);
  }
};
