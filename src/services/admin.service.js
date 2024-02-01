import { UsersRepository } from '../repositories/users.repository.js';
import { AuthRepository } from '../repositories/auth.repository.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AdminService {
  usersRepository = new UsersRepository();
  authRepository = new AuthRepository();

  createAdminProfile = async (createAuthData) => {
    const { nickName, gender } = createAuthData;

    const user = await this.usersRepository.createAdmin(nickName, gender);

    return {
      id: user.id,
    };
  };

  adminSignin = async (signinData) => {
    const { email, password } = signinData;

    const auth = await this.authRepository.readOneByEmail(email);
    console.log(auth, '@@@@@@@@@@@@@@@@@@@@@@@');
    if (!auth) {
      const error = new Error('존재하지 않는 관리자 입니다.');
      error.status = 401;
      throw error;
    }

    const user = await this.usersRepository.readOneById(auth.userId);
    console.log(auth, '@@@@@@@@@@@@@@@@@@@@@@@');
    if (!user || user.role !== 'ADMIN') {
      const error = new Error('존재하지 않는 관리자 입니다.');
      error.status = 401;
      throw error;
    }

    const matchPassword = await bcrypt.compare(password, auth.password);

    if (!matchPassword) {
      const error = new Error('패스워드가 일치하지 않습니다.');
      error.status = 403;
      throw error;
    }
    console.log('authService', auth);

    return jwt.sign(
      { authId: auth.id, userId: auth.userId },
      process.env.JWT_SECRET,
      {
        expiresIn: '24h',
      },
    );
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
