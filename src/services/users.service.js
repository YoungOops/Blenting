import { UsersRepository } from '../repositories/users.repository.js';

//유저 상세
export class UsersService {
  usersRepository = new UsersRepository();

  createProfile = async (createAuthData) => {
    const { nickName, gender } = createAuthData;

    const user = await this.usersRepository.createUser(nickName, gender);

    return {
      id: user.id,
    };
  };

  createAdminProfile = async (createAuthData) => {
    const { nickName, gender } = createAuthData;

    const user = await this.usersRepository.createAdmin(nickName, gender);

    return {
      id: user.id,
    };
  };

  findUserById = async (userId) => {
    return await this.usersRepository.readOneById(userId);
  };
  /**유저 전체 조회 */
  findAllUsers = async () => {
    return await this.usersRepository.readAll();
  };

  updateUserById = async (userId, updateUserData) => {
    return await this.usersRepository.updateOneById(userId, updateUserData);
  };

  deleteUserById = async (userId) => {
    return await this.usersRepository.deleteOneById(userId);
  };
}
