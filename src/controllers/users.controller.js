import { UsersService } from '../services/users.service.js';

export class UsersController {
  usersService = new UsersService();

  getProfile = async (req, res, next) => {
    try {
      const { userId } = req.user;

      // 서비스 계층에 구현된 findUserById 사용
      const user = await this.usersService.findUserById(userId);

      return res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  };

  updateProfile = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const updateUserData = req.body;

      const isValidData =
        'age' in updateUserData &&
        'district' in updateUserData &&
        'height' in updateUserData &&
        'figure' in updateUserData &&
        'mbti' in updateUserData &&
        'hobby' in updateUserData &&
        'job' in updateUserData &&
        'want1' in updateUserData &&
        'want2' in updateUserData &&
        'want3' in updateUserData &&
        'description' in updateUserData;

      if (!isValidData) {
        const error = new Error('유효하지 않은 데이터입니다.');
        error.status = 400;
        throw error;
      }

      // 서비스 계층에 구현된 updateUser 로직을 실행합니다.
      const updateUser = await this.usersService.updateUserById(
        userId,
        updateUserData,
      );

      return res.status(201).json(updateUser);
    } catch (err) {
      next(err);
    }
  };

  deleteUser = async (req, res, next) => {
    try {
      const { userId } = req.user;

      const deleteUser = await this.usersService.deleteUserById(userId);

      return res.status(200).json(deleteUser);
    } catch (err) {
      next(err);
    }
  };
}
