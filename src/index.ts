import "dotenv/config";
import Express from "express";
import userRouter from "./routes/user.route";
import logger from "./configs/logger";
import { errorHandler } from "./middleware/error.handler";
import { requestLogger } from "./middleware/logger.middleware";
import prisma from "./configs/prisma";
import profileRouter from "./routes/profile.route";
import educationRouter from "./routes/education.route";
import jobRouter from "./routes/job.route";
import experienceRouter from "./routes/experience.route";
import cors from "cors";
import jobApplicationRouter from "./routes/jobApplication.route";
import messageRouter from "./routes/message.route";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./configs/swagger";
import { createServer } from "http";
import { Server } from "socket.io";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const app = Express();
const server = createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(helmet());
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many requests, please try again later.",
  },
});
app.use(limiter);
app.use(requestLogger);

const PORT = process.env.PORT || 3000;

export const onlineUsers = new Map<string, string>();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // user joins
  socket.on("join", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  // send message
  socket.on("sendMessage", ({ senderId, receiverId, message }) => {
    const receiverSocketId = onlineUsers.get(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receiveMessage", {
        senderId,
        message,
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.use("/api", userRouter);
app.use("/api/profile", profileRouter);
app.use("/api/education", educationRouter);
app.use("/api/experience", experienceRouter);
app.use("/api/job", jobRouter);
app.use("/api/jobApplication", jobApplicationRouter);
app.use("/api", messageRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.status(200).json({
    status: 200,
    message: "everything have been working ok",
  });
});

app.use(errorHandler);
const startServer = async () => {
  try {
    await prisma.$connect();
    logger.info("Database has been connected successfully");

    server.listen(PORT, () => {
      logger.info(`server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    logger.error("Database connection failed", err);
    process.exit(1);
  }
};

startServer();
