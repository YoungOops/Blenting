import { UsersService } from '../services/users.service.js';

export class UsersController {
  usersService = new UsersService();

  getProfile = async (req, res, next) => {
    try {
      const { userId } = req.user;

      // 서비스 계층에 구현된 findUserById 사용
      const user = await this.usersService.findUserById(userId);

      return res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  };
  /** 유저 전체조회 */
  getAllProfiles = async (req, res, next) => {
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
      const users = await this.usersService.findAllUsers(filterOptions);

      // 필터링된 유저 데이터를 HTTP 응답으로 클라이언트에 반환합니다.
      // 상태 코드 200은 요청이 성공적으로 처리되었음을 나타냅니다.
      return res.status(200).json(users);
    } catch (err) {
      // 에러가 발생한 경우 에러 핸들링 미들웨어로 에러를 전달합니다.
      next(err);
    }
  };

  updateProfile = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const updateUserData = req.body;

      const isValidData =
        'age' in updateUserData &&
        'district' in updateUserData &&
        'height' in updateUserData &&
        'figure' in updateUserData &&
        'mbti' in updateUserData &&
        'hobby' in updateUserData &&
        'job' in updateUserData &&
        'want1' in updateUserData &&
        'want2' in updateUserData &&
        'want3' in updateUserData &&
        'description' in updateUserData;

      if (!isValidData) {
        const error = new Error('유효하지 않은 데이터입니다.');
        error.status = 400;
        throw error;
      }

      // 서비스 계층에 구현된 updateUser 로직을 실행합니다.
      const updateUser = await this.usersService.updateUserById(
        userId,
        updateUserData,
      );

      return res.status(201).json(updateUser);
    } catch (err) {
      next(err);
    }
  };

  deleteUser = async (req, res, next) => {
    try {
      const { userId } = req.user;

      const deleteUser = await this.usersService.deleteUserById(userId);

      return res.status(200).json(deleteUser);
    } catch (err) {
      next(err);
    }
  };

  deleteUserByAdmin = async (req, res, next) => {
    try {
      const { userId } = req.body;

      const deleteUser = await this.usersService.deleteUserById(userId);

      return res.status(200).json(deleteUser);
    } catch (err) {
      next(err);
    }
  };
}
