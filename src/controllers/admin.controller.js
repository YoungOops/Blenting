import { AuthService } from '../services/auth.service.js';
import { UsersService } from '../services/users.service.js';

export class AdminController {
  authService = new AuthService();
  usersService = new UsersService();

  // 회원가입
  signup = async (req, res, next) => {
    try {
      const createAuthData = req.body;

      const isValidData =
        'email' in createAuthData &&
        'password' in createAuthData &&
        'checkPassword' in createAuthData &&
        'nickName' in createAuthData &&
        'gender' in createAuthData;

      if (!isValidData) {
        const error = new Error('유효하지 않은 데이터입니다.');
        error.status = 400;
        throw error;
      }

      const userProfile = await this.usersService.createAdminProfile(
        createAuthData,
      );
      const userId = userProfile.id;

      const result = await this.authService.signup(userId, createAuthData);

      return res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  };
}
