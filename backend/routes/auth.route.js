import express from "express";
import { signIn, signUp, logout } from "../controllers/auth.controller.js";
import { verifyToken } from "../middleware/middleware.js";

const router = express.Router();

router.post("/signin", signIn);
router.post("/signup", signUp);
router.post("/logout", verifyToken, logout);

export default router;
