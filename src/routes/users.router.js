import { Router } from 'express';
import { UsersController } from '../controllers/users.controller.js';
import { AuthMiddleware } from '../middlewares/auth.middleware.js';

const usersRouter = Router();

// 클래스
const usersController = new UsersController();
const authMiddleware = new AuthMiddleware();

/** 유저 상세 조회 */
usersRouter.get('/profile', authMiddleware.isAuth, usersController.getProfile);

/** 유저 마이페이지 */
usersRouter.get('/myPage', authMiddleware.isAuth, usersController.getMyPage);

/** 유저 프로필 수정 **/
usersRouter.patch(
  '/updateProfile',
  authMiddleware.isAuth,
  usersController.updateProfile,
);

/** 유저 삭제 **/
usersRouter.delete(
  '/deleteUser',
  authMiddleware.isAuth,
  usersController.deleteUser,
);

//민재님 옮겼습니다...! 퐈이팅!!

export { usersRouter };
//디폴트로 하면 하나의 클래스,함수 객체 내보내는 거임
//하고 받을 때 import router from "./경로/router.js"; 이러케 받으면 됨
