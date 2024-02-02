import { UsersRepository } from '../repositories/users.repository.js';
import { AuthRepository } from '../repositories/auth.repository.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class AdminService {
  //레포지토리 초기화
  usersRepository = new UsersRepository();
  authRepository = new AuthRepository();

  createAdminProfile = async (createAuthData) => {
    // createAuthData에서 닉네임, 젠더를 구조분해할당
    const { nickName, gender } = createAuthData;

    // UsersRepository를 사용하여 관리자 사용자를 생성
    const user = await this.usersRepository.createAdmin(nickName, gender);

    return {
      // 생성된 사용자의 id를 반환합니다.
      id: user.id,
    };
  };

  adminSignin = async (signinData) => {
    // signinData에서 email과 password를 구조분해합니다.
    const { email, password } = signinData;

    // AuthRepository에서 이메일로 인증 데이터를 읽어옵니다.
    const auth = await this.authRepository.readOneByEmail(email);
    if (!auth) {
      // 인증 데이터가 없는 경우 오류를 생성합니다.
      const error = new Error('존재하지 않는 관리자 입니다.');
      error.status = 401;
      throw error;
    }
    // UsersRepository에서 id로 사용자 데이터를 읽어옵니다.
    const user = await this.usersRepository.readOneById(auth.userId);
    if (!user || user.role !== 'ADMIN') {
      // 사용자 데이터가 없거나 사용자가 관리자가 아닌 경우 오류를 생성합니다.
      const error = new Error('존재하지 않는 관리자 입니다.');
      error.status = 401;
      throw error;
    }
    // 제공된 비밀번호와 저장된 비밀번호를 비교합니다.
    const matchPassword = await bcrypt.compare(password, auth.password);

    if (!matchPassword) {
      const error = new Error('패스워드가 일치하지 않습니다.');
      error.status = 403;
      throw error;
    }

    return jwt.sign(
      // authId와 userId로 JWT 토큰을 서명합니다.
      { authId: auth.id, userId: auth.userId },
      // 환경 변수에서 JWT_SECRET를 사용합니다.
      process.env.JWT_SECRET,
      {
        //만료 24시간
        expiresIn: '24h',
      },
    );
  };

  /** 유저 전체조회 */
  findAllUsers = async () => {
    // UsersRepository를 사용하여 모든 사용자를 읽어옵니다.
    return await this.usersRepository.readAll();
  };

  /** 유저 원하는 값 필터링 후 조회 */
  filterUsers = async (filterOptions) => {
    // where 조건에 filterOptions 객체를 전달하여 필터링 조건을 적용합니다.
    return await this.usersRepository.readFiltering(filterOptions);
  };

  /** 관리자 유저 조회 */
  findById = async (userId) => {
    // UsersRepository를 사용하여 userId로 사용자를 읽어옵니다.
    return await this.usersRepository.readOne(userId);
  };

  /** 관리자 유저 삭제 */
  deleteById = async (userId) => {
    // UsersRepository를 사용하여 userId로 사용자를 삭제합니다.
    return await this.usersRepository.deleteOne(userId);
  };
}
