import { Router } from "express";
import {
  login,
  registerUser,
  getCurrentUser,
} from "../controller/authController.js";
import verifyToken from "../middleware/authMiddleware.js";

const authRoutes = Router();

authRoutes.post("/", registerUser);
authRoutes.get("/login", login);
authRoutes.get("/me", verifyToken, getCurrentUser);

export default authRoutes;


