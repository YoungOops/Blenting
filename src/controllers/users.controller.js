import { UsersService } from "../services/users.service.js";
import validator from "validator"; //컨트롤러에서 벨리데이션

export class UsersController {
  usersService = new UsersService();

  getUsers = async (req, res, next) => {
    try {
      //this.~~Service.findAllUsers(); 그냥 이거 보면 해당하는 게시글들의 목록이 오겠구나 하면 되는것.
      const users = await this.usersService.findAllUsers();

      //위에꺼 나오고 그 다음에 리스폰스 넘겨 주는 순서
      return res.status(200).json({ data: users });
    } catch (err) {
      next(err); // 에러 미들웨어로 던질 준비
    }
  };

  getUserById = async (req, res, next) => {
    try {
      const { userId } = req.params;

      // 서비스 계층에 구현된 findUserById 사용
      const user = await this.usersService.findUserById(questionId);

      return res.status(200).json({ data: user });
    } catch (err) {
      next(err);
    }
  };

  createUser = async (req, res, next) => {
    try {
      const { email, password, confirmPassword } = req.body;

      if (!email || !password) throw new Error("InvalidParamsError");
      if (!validator.isEmail(email)) throw new Error("NotEmail");
      if (!validator.equals(password, confirmPassword)) throw new Error("NotSamePasswords");

      // 서비스 계층에 구현된 createUser 로직을 실행합니다.
      const createdUser = await this.usersService.createUser(email, password);

      return res.status(201).json({ data: createdUser });
    } catch (err) {
      next(err);
    }
  };

  updateUser = async (req, res, next) => {
    try {
      const id = req.user;
      const { name, password, confirmPassword } = req.body;
      if (!validator.equals(password, confirmPassword)) throw new Error("NotSamePasswords");

      // 서비스 계층에 구현된 updateUser 로직을 실행합니다.
      const updateUser = await this.usersService.updateUser(id, name, password);

      return res.status(200).json({ data: updateUser });
    } catch (err) {
      next(err);
    }
  };

  deleteUser = async (req, res, next) => {
    try {
      const { password } = req.body;
      const id = req.user;

      // 서비스 계층에 구현된 deleteUser 로직을 실행합니다.
      const deleteUser = await this.usersService.deleteUser(id, password);

      return res.status(200).json({ data: deleteUser });
    } catch (err) {
      next(err);
    }
  };
}
