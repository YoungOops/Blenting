import { UsersRepository } from '../repositories/users.repository.js';
import { prisma } from '../utils/prisma/index.js';

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
  // findAllUsers 메소드는 필터링 옵션을 받아 유저 데이터를 조회합니다.
  findAllUsers = async (filterOptions) => {
    // Prisma client를 사용하여 데이터베이스에서 유저 데이터를 조회합니다.
    // where 조건에 filterOptions 객체를 전달하여 필터링 조건을 적용합니다.
    return await prisma.users.findMany({
      where: filterOptions,
    });
  };

  updateUserById = async (userId, updateUserData) => {
    return await this.usersRepository.updateOneById(userId, updateUserData);
  };

  deleteUserById = async (userId) => {
    return await this.usersRepository.deleteOneById(userId);
  };
}
