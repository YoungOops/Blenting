import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { AdminController } from '../controllers/admin.controller.js';

const authRouter = Router();

// 인스턴스 생성
const authController = new AuthController();
const adminController = new AdminController();

/** 로그인 API **/
authRouter.post('/signin', authController.signin);

/** 회원가입 API **/
authRouter.post('/signup', authController.signup);
authRouter.post('/adminSignup', adminController.signup);

export { authRouter };
