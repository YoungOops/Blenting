import { Router } from 'express';

import { AuthController } from '../controllers/auth.controller.js';
import { UsersController } from '../controllers/users.controller.js';
import { AdminController } from '../controllers/admin.controller.js';

import { AuthMiddleware } from '../middlewares/auth.middleware.js';

const adminRouter = Router();

const authController = new AuthController();
const usersController = new UsersController();
const adminController = new AdminController();
const authMiddleware = new AuthMiddleware();

/** 관리자 회원 가입 */
adminRouter.post('/adminSignup', adminController.signup);

/** 로그인 API **/
adminRouter.post('/adminSignin', adminController.signin);

/** 관리자용 유저 전체 조회 */
adminRouter.get(
  '/allUsers',
  authMiddleware.isAdmin,
  adminController.findAllUsers,
);

/** 관리자용 유저 필터링 후 조회 */
adminRouter.get(
  '/filterProfiles',
  authMiddleware.isAdmin,
  adminController.filterUsers,
);

/** 유저 상세 조회 @@@@@@@@ 이거는 이렇게해도 되는지?*/
adminRouter.get(
  '/profile/:userId',
  authMiddleware.isAdmin,
  adminController.findProfile,
);

/** 관리자용 유저 삭제 */
adminRouter.delete(
  '/deleteUser/:userId',
  authMiddleware.isAdmin,
  adminController.deleteUser,
);

export { adminRouter };
