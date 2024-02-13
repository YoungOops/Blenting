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
      let countPerPage = parseInt(req.query.countPerPage, 10) || 10;
      let pageNo = parseInt(req.query.pageNo, 10) || 1;

      //db에서 사용자 목록 가져옴
      const allUsers = await this.adminService.findSomeUsers();
      const totalCount = allUsers.length;

      // 페이지네이션 로직
      const startItemNo = (pageNo - 1) * countPerPage;
      let endItemNo = pageNo * countPerPage - 1;

      // 페이지네이션을 적용하여 해당 페이지에 맞는 사용자 목록을 선별합니다.
      const paginatedUsers = allUsers.slice(
        startItemNo,
        startItemNo + countPerPage,
      );

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

  // 위의 코드 수정 사항은 다음과 같습니다:

  // - `boardList` 대신에 `allUsers`를 사용, `this.adminService.findAllUsers()` 함수로부터 모든 사용자를 비동기로 가져옵니다.
  // - `parseInt`의 두 번째 인자인 기수(radix)를 10으로 지정하여 항상 10진수로 파싱되도록 강제합니다.
  // - `pageNo`의 기본값을 0 대신 1로 설정합니다. 보통 페이지네이션은 1부터 시작합니다.
  // - 마지막 페이지의 `endItemNo` 계산은 불필요하며, `slice` 함수에 의해 처리되므로 제거합니다.
  // - 페이지 정보를 포함하는 `pageInfo` 객체를 응답에 추가하여 사용자가 현재 페이지와 관련 정보를 알 수 있도록 합니다.

  // 이렇게 수정하면, `boardList`의 정의와 데이터 소스가 명확해지고, 요청된 페이지에 맞는 데이터를 잘라내서 반환하는 페이지네이션 기능을 제대로 구현할 수 있습니다.

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
        // reportCount,
        // reportPoint,
        // ticket,
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

        /** reportCount, reportPoint, ticket은 숫자여야 하므로 정수로 변환 */
        // ...(reportCount && { reportCount: parseInt(reportCount) }),
        // ...(reportPoint && { reportPoint: parseInt(reportPoint) }),
        // ...(ticket && { ticket: parseInt(ticket) }),
      };

      // 서비스 계층의 findAllUsers 메소드를 호출하고 필터 옵션을 전달합니다.
      // 반환된 유저 데이터는 필터링된 결과를 포함합니다.
      const users = await this.adminService.filterUsers(filterOptions);

      // 필터링된 유저 데이터를 HTTP 응답으로 클라이언트에 반환합니다.
      // 상태 코드 200은 요청이 성공적으로 처리되었음을 나타냅니다.
      return res.status(200).json(users);
    } catch (err) {
      // 에러가 발생한 경우 에러 핸들링 미들웨어로 에러를 전달합니다.
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
