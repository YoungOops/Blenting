import express from "express";
import { AuthController } from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// 인스턴스 생성
const authController = new AuthController();

/** 로그인 API **/
router.post("/login", authController.login);

/** 로그아웃 API **/
router.post("/logout", authMiddleware, authController.logout);

export default router;
