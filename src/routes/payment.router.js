import { Router } from 'express';
import { PaymentController } from '../controllers/payment.controller.js';
import { AuthMiddleware } from '../middlewares/auth.middleware.js';

const paymentRouter = Router();

// 인스턴스 생성
const paymentController = new PaymentController();
const authMiddleware = new AuthMiddleware();

paymentRouter.patch(
  '/buyPackage',
  authMiddleware.isAuth,
  paymentController.buyPackage,
);

export { paymentRouter };
