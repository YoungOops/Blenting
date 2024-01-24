import express from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

// 인스턴스 생성
const authController = new AuthController();

/** 로그인 API **/
router.post('/signin', authController.signin);

/** 회원가입 API **/
router.post('/signup', authController.signup);

export default router;
