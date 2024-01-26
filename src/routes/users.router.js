import { Router } from 'express';
import { UsersController } from '../controllers/users.controller.js';
import { isAuth } from '../middlewares/auth.middleware.js';

const usersRouter = Router();

// 클래스
const usersController = new UsersController();

/** 유저 상세 조회 */
usersRouter.get('/profile', isAuth, usersController.getProfile);

/** 유저 프로필 수정 **/
usersRouter.patch('/updateProfile', isAuth, usersController.updateProfile);

export { usersRouter };
//디폴트로 하면 하나의 클래스,함수 객체 내보내는 거임
//하고 받을 때 import router from "./경로/router.js"; 이러케 받으면 됨
