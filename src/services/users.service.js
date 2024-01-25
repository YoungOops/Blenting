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
}
