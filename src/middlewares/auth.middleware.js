import { UsersRepository } from '../repositories/users.repository.js';
// jwt 토큰 가져오기
import jwt from 'jsonwebtoken';
// dotenv 가져오기
import dotenv from 'dotenv';
dotenv.config(); // 이거 넣어주고 쓰라고 해서 넣었음.

export class AuthMiddleware {
  UsersRepository = new UsersRepository();

  // isAuth 미들웨어 함수를 export
  isAuth = async (req, res, next) => {
    //요청 헤더s에서 'authorization' 항목을 추출합니다.
    const { authorization, Authorization } = req.headers;
    console.log(
      '🚀 ~ AuthMiddleware ~ isAuth= ~ authorization:',
      authorization,
    );
    console.log(
      '🚀 ~ AuthMiddleware ~ isAuth= ~ Authorization:',
      Authorization,
    );

    // 'authorization' 헤더를 공백을 기준으로 분리하여 authType과 authToken을 구합니다.
    const [authType, authToken] = (authorization || '').split(' ');
    console.log(
      '🚀 ~ AuthMiddleware ~ isAuth= ~ authType, authToken:',
      authType,
      authToken,
    );
    // authToken이 없거나 authType이 'Bearer'가 아닌 경우 에러를 발생시킵니다.
    if (!authToken || authType !== 'Bearer') {
      const error = new Error('로그인 후 이용 가능한 기능입니다.');
      error.status = 401; // HTTP 상태 코드 401을 에러 객체에 설정합니다.
      throw error; // 에러를 던집니다.
    }

    //토큰 검증 시크릿키로 검증함
    try {
      //아래 유저는 페이로드 객체를 받아옴 jwt.verify() 함수 사용
      //토큰이 유효하면 토큰의 페이로드(즉, 토큰에 담긴 데이터)를 반환
      const user = jwt.verify(authToken, process.env.JWT_SECRET);
      req.user = user; // 요청 객체에 user 정보를 추가합니다.
      next();
    } catch (err) {
      return res.status(401).send('로그인 후 이용 가능한 기능입니다.');
    }
  };

  isAdmin = async (req, res, next) => {
    const { authorization } = req.headers;
    const [authType, authToken] = (authorization || '').split(' ');
    console.log(authType, authToken, '!@@@@@@@@@@@@@');
    if (!authToken || authType !== 'Bearer') {
      const error = new Error('로그인 후 이용 가능한 기능입니다.');
      error.status = 401;
      throw error;
    }

    try {
      const user = jwt.verify(authToken, process.env.JWT_SECRET);
      req.user = user;
      const { role } = await this.UsersRepository.readOneById(user.userId);

      if (role !== 'ADMIN') {
        const error = new Error('관리자 권한이 없습니다.');
        console.log('관리자 권한이 없습니다.');
        error.status = 401;
        throw error;
      }

      next();
    } catch (err) {
      return res.status(401).send('로그인 후 이용 가능한 기능입니다.');
    }
  };
}
