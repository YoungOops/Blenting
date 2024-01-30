import { UsersRepository } from '../repositories/users.repository.js';

export class AdminService {
  usersRepository = new UsersRepository();

  createAdminProfile = async (createAuthData) => {
    const { nickName, gender } = createAuthData;

    const user = await this.usersRepository.createAdmin(nickName, gender);

    return {
      id: user.id,
    };
  };

  /** 유저 전체조회 */
  findAllUsers = async () => {
    return await this.usersRepository.readAll();
  };

  /** 유저 원하는 값 필터링 후 조회 */
  filterUsers = async (filterOptions) => {
    // where 조건에 filterOptions 객체를 전달하여 필터링 조건을 적용합니다.
    return await this.usersRepository.readFiltering(filterOptions);
  };

  /** 관리자 유저 조회 */
  findById = async (userId) => {
    return await this.usersRepository.readOne(userId);
  };

  /** 관리자 유저 삭제 */
  deleteById = async (userId) => {
    return await this.usersRepository.deleteOne(userId);
  };
}
