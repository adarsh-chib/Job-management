import Express from "express";
import {
  getUserdata,
  resetPassword,
  userDelete,
  userLogin,
  userRegister,
} from "../controller/user.controller";
import { validate } from "../middleware/validation.middleware";
import { signinValidator, signupValidator } from "../validators/auth.validator";
import {
  authenticationMiddleware,
  authorizationMiddleware,
} from "../middleware/auth.middleware";

const userRouter = Express.Router();

/**
 * @swagger
 * /api/create:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fullName, email, password, role]
 *             properties:
 *               fullName: { type: string }
 *               email: { type: string }
 *               password: { type: string }
 *               role: { type: string, enum: [candidate, manager, admin] }
 *     responses:
 *       201: { description: User created }
 */
userRouter.post("/create", validate(signupValidator), userRegister);

/**
 * @swagger
 * /api/userlogin:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, role]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *               role: { type: string, enum: [candidate, manager, admin] }
 *     responses:
 *       200: { description: Login successful }
 */
userRouter.post("/userlogin", validate(signinValidator), userLogin);

/**
 * @swagger
 * /api/reset-password:
 *   patch:
 *     summary: Reset password
 *     tags: [Auth]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, newpassword, role]
 *             properties:
 *               email: { type: string }
 *               newpassword: { type: string }
 *               role: { type: string, enum: [candidate, manager, admin] }
 *     responses:
 *       200: { description: Password reset successful }
 */
userRouter.patch("/reset-password", authenticationMiddleware, resetPassword);

/**
 * @swagger
 * /api/delete:
 *   delete:
 *     summary: Delete user account
 *     tags: [Auth]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, confirm]
 *             properties:
 *               email: { type: string }
 *               password: { type: string }
 *               confirm: { type: string, description: "Must be 'DELETE'" }
 *     responses:
 *       200: { description: User deleted }
 */
userRouter.delete("/delete", authenticationMiddleware, userDelete);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Admin]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: List of all users }
 */
userRouter.get(
  "/users",
  authenticationMiddleware,
  authorizationMiddleware("admin"),
  getUserdata,
);

export default userRouter;
