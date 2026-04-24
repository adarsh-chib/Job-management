import Express from "express";
import { authenticationMiddleware } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import { sendMessageSchema } from "../validators/message.validator";
import { sendMessage, getChatHistory, getUserConversations } from "../controller/message.controller";

const messageRouter = Express.Router();

messageRouter.post(
  "/message",
  authenticationMiddleware,
  validate(sendMessageSchema),
  sendMessage,
);

messageRouter.get(
  "/message/chats",
  authenticationMiddleware,
  getUserConversations,
);

messageRouter.get(
  "/message/:userId",
  authenticationMiddleware,
  getChatHistory,
);

export default messageRouter;
