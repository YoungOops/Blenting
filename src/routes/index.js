import { Router } from 'express';
import { meetingsRouter } from './meetings.router.js';
import { messagesRouter } from './messages.router.js';
import { authRouter } from './auth.router.js';
import { usersRouter } from './users.router.js';
import { paymentRouter } from './payment.router.js';

const apiRouter = Router();

// 블랜팅
// 채팅룸
apiRouter.use('/meetings', meetingsRouter);

// 메세지
apiRouter.use('/messages', messagesRouter);

// 회원
apiRouter.use('/auth', authRouter);

// 프로필
apiRouter.use('/user', usersRouter);

// 결제
apiRouter.use('/payment', paymentRouter);

export { apiRouter };
