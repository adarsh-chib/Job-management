import "dotenv/config";
import Express from "express";
import userRouter from "./routes/user.routes";
import logger from "./configs/logger";
import { errorHandler } from "./middleware/error.handler";
import { requestLogger } from "./middleware/logger.middleware";
import prisma from "./configs/prisma";
import profileRouter from "./routes/profile.routes";
import educationRouter from "./routes/education.routes";
import jobRouter from "./routes/job.routes";
import experienceRouter from "./routes/experience.route";
import cors from "cors";
import jobApplicationRouter from "./routes/jobApplication.routes";

const app = Express();
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(Express.json());
app.use(Express.urlencoded({ extended: true }));

app.use(requestLogger);

const PORT = process.env.PORT || 3000;

app.use("/api", userRouter);
app.use("/api/profile", profileRouter);
app.use("/api/education", educationRouter);
app.use("/api/experience", experienceRouter);
app.use("/api/job", jobRouter);
app.use("/api/jobApplication", jobApplicationRouter);

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

    app.listen(PORT, () => {
      logger.info(`server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    logger.error("Database connection failed", err);
    process.exit(1);
  }
};

startServer();
