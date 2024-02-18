import { AuthService } from '../services/auth.service.js';
import { UsersService } from '../services/users.service.js';
import { AdminService } from '../services/admin.service.js';

export class AdminController {
  authService = new AuthService(); // 인증 서비스의 인스턴스를 생성합니다.
  usersService = new UsersService(); // 사용자 서비스의 인스턴스를 생성합니다.
  adminService = new AdminService(); // 관리자 서비스의 인스턴스를 생성합니다.

  /* 회원가입 */
  signup = async (req, res, next) => {
    // 회원가입을 처리하는 메소드입니다.
    try {
      const createAuthData = req.body; // 요청에서 받은 데이터를 추출합니다.

      const isValidData = // 데이터의 유효성을 검사합니다.
        'email' in createAuthData &&
        'password' in createAuthData &&
        'checkPassword' in createAuthData &&
        'nickName' in createAuthData &&
        'gender' in createAuthData;

      if (!isValidData) {
        // 데이터가 유효하지 않으면 에러를 발생시킵니다.
        const error = new Error('유효하지 않은 데이터입니다.');
        error.status = 400;
        throw error;
      }

      //관리자 프로필 생성
      const userProfile = await this.adminService.createAdminProfile(
        createAuthData,
      );
      //생성 된 프로필의 ID 추출
      const userId = userProfile.id;
      // 사용자를 가입시킵니다.
      const result = await this.authService.signup(userId, createAuthData);
      // 성공적인 응답을 반환합니다.
      return res.status(201).json(result);
    } catch (err) {
      next(err); // 에러를 다음 미들웨어로 전달합니다.
    }
  };

  /* 로그인 */
  signin = async (req, res, next) => {
    try {
      const signinData = req.body; // 요청에서 받은 데이터를 추출합니다.

      const isValidData = 'email' in signinData && 'password' in signinData;

      if (!isValidData) {
        // 데이터가 유효하지 않으면 에러를 발생시킵니다.
        const error = new Error('유효하지 않은 데이터입니다.');
        error.status = 400;
        throw error;
      }
      // 관리자 로그인을 처리합니다.
      const result = await this.adminService.adminSignin(signinData);

      // 클라이언트로 전달
      res.header('accessToken', result); // 헤더에 액세스 토큰을 추가합니다.
      console.log('토큰 헤더 전송', result); // 토큰 전송을 로그에 기록합니다.

      return res.status(200).json({
        accessToken: 'Bearer ' + result,
      });
    } catch (err) {
      next(err);
    }
  };

  /* 유저 전체 조회 */
  findAllUsers = async (req, res, next) => {
    try {
      const countPerPage = parseInt(req.query.countPerPage, 10) || 10;
      const pageNo = parseInt(req.query.pageNo, 10) || 1;

      // 페이지네이션된 사용자 목록과 전체 사용자 수를 가져옵니다.
      const paginatedUsers = await this.adminService.readSomeUsers(
        pageNo,
        countPerPage,
      );
      const totalCount = await this.adminService.getTotalUserCount();

      // 선별된 사용자 목록을 JSON으로 반환합니다.
      return res.status(200).json({
        success: true,
        data: paginatedUsers,
        pageInfo: {
          currentPage: pageNo,
          countPerPage: countPerPage,
          totalCount: totalCount,
          totalPage: Math.ceil(totalCount / countPerPage),
        },
      });
    } catch (err) {
      // 에러 처리
      next(err);
    }
  };

  /* 유저 필터링 후 조회 */
  filterUsers = async (req, res, next) => {
    try {
      // 클라이언트로부터 전달받은 쿼리 파라미터를 각 변수에 할당합니다.
      const {
        height,
        gender,
        figure,
        want1,
        want2,
        want3,
        mbti,
        // reportCount,(미구현)
        // reportPoint,(미구현)
      } = req.query;

      // 필터링할 조건들을 객체로 구성합니다. 값이 존재하는 경우에만 필터 옵션에 추가합니다.
      const filterOptions = {
        ...(height && { height }), // height 파라미터가 있으면 height로 필터링
        ...(gender && { gender }), // figure 파라미터가 있으면 figure로 필터링
        ...(figure && { figure }), // figure 파라미터가 있으면 figure로 필터링
        ...(want1 && { want1 }), // want1 파라미터가 있으면 want1로 필터링
        ...(want2 && { want2 }), // want1 파라미터가 있으면 want1로 필터링
        ...(want3 && { want3 }), // want1 파라미터가 있으면 want1로 필터링
        ...(mbti && { mbti }), // want1 파라미터가 있으면 want1로 필터링
      };

      // 서비스 계층의 findAllUsers 메소드를 호출하고 필터 옵션을 전달합니다.
      const users = await this.adminService.filterUsers(filterOptions);

      return res.status(200).json(users);
    } catch (err) {
      next(err);
    }
  };

  /* 유저 상세 조회 */
  findProfile = async (req, res, next) => {
    try {
      // URL 경로에서 userId를 추출합니다.
      const userId = req.params.userId;

      // 추출한 userId를 사용하여 사용자 정보를 조회합니다.
      const user = await this.adminService.findById(userId);

      // 조회된 사용자 정보가 없다면, 적절한 에러 처리를 합니다.
      if (!user) {
        return res.status(404).json({ message: '유저를 찾을 수 없습니다.' });
      }

      // 조회된 사용자 정보를 응답으로 반환합니다.
      return res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  };

  /** 유저 삭제 */
  deleteUser = async (req, res, next) => {
    try {
      // 요청에서 userId를 추출합니다.
      const userId = req.params.userId;
      // userId를 사용하여 사용자를 삭제합니다.
      const deleteUser = await this.adminService.deleteById(userId);

      // 삭제된 사용자를 응답으로 반환합니다.
      return res.status(200).json(deleteUser);
    } catch (err) {
      next(err);
    }
  };
}
