import { AuthService } from '../services/auth.service.js';
import { UsersService } from '../services/users.service.js';
import { AdminService } from '../services/admin.service.js';

export class AdminController {
  authService = new AuthService();
  usersService = new UsersService();
  adminService = new AdminService();

  // 회원가입
  signup = async (req, res, next) => {
    try {
      const createAuthData = req.body;

      const isValidData =
        'email' in createAuthData &&
        'password' in createAuthData &&
        'checkPassword' in createAuthData &&
        'nickName' in createAuthData &&
        'gender' in createAuthData;

      if (!isValidData) {
        const error = new Error('유효하지 않은 데이터입니다.');
        error.status = 400;
        throw error;
      }

      const userProfile = await this.usersService.createAdminProfile(
        createAuthData,
      );
      const userId = userProfile.id;

      const result = await this.authService.signup(userId, createAuthData);

      return res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  };

  /** 유저 전체 조회 */
  findAllUsers = async (req, res, next) => {
    try {
      const user = await this.adminService.findAllUsers();
      return res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  };

  /** 유저 필터링 후 조회 */
  filterUsers = async (req, res, next) => {
    try {
      // 클라이언트로부터 전달받은 쿼리 파라미터를 각 변수에 할당합니다.
      const {
        figure,
        height,
        want1,
        want2,
        want3,
        mbti,
        reportCount,
        reportPoint,
        ticket,
      } = req.query;

      // 필터링할 조건들을 객체로 구성합니다. 값이 존재하는 경우에만 필터 옵션에 추가합니다.
      const filterOptions = {
        ...(figure && { figure }), // figure 파라미터가 있으면 figure로 필터링
        ...(height && { height }), // height 파라미터가 있으면 height로 필터링
        ...(want1 && { want1 }), // want1 파라미터가 있으면 want1로 필터링
        ...(want2 && { want2 }), // want1 파라미터가 있으면 want1로 필터링
        ...(want3 && { want3 }), // want1 파라미터가 있으면 want1로 필터링
        ...(mbti && { mbti }), // want1 파라미터가 있으면 want1로 필터링

        /** reportCount, reportPoint, ticket은 숫자여야 하므로 정수로 변환 */
        // ...(reportCount && { reportCount: parseInt(reportCount) }),
        // ...(reportPoint && { reportPoint: parseInt(reportPoint) }),
        // ...(ticket && { ticket: parseInt(ticket) }),
      };
      console.log(
        '🚀 ~ UsersController ~ getAllProfiles= ~ filterOptions:',
        filterOptions,
      );

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

  /** 유저 상세 조회 */
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
      // //객체에서 userId 꺼내서 사용하는 거임
      // const { userId } = req.body;
      const userId = req.params.userId;

      const deleteUser = await this.adminService.deleteById(userId);

      return res.status(200).json(deleteUser);
    } catch (err) {
      next(err);
    }
  };
}
