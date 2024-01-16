import { UsersRepository } from "../repositories/users.repository.js";
import bcrypt from "bcrypt";
//서비스에서 비크립트 씀

//이게 뭔지 확인하기
const comparePassword = async (password, hash) => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.log(error);
  }
  return false;
};

//유저 상세
export class UsersService {
  usersRepository = new UsersRepository();

  findAllUsers = async (id) => {
    const users = await this.usersRepository.findAllUsers(id);

    return users;
  };

  findUsersById = async (id) => {
    // 저장소(Repository)에게 특정 유저정보 하나를 요청합니다.
    const user = await this.usersRepository.findUsersById(id);

    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  };

  createUser = async (email, password) => {
    // 중복 email 확인
    const confirmEmail = await this.usersRepository.findUsersByEmail(email);
    if (confirmEmail) throw new Error("AlreadyExistEmail");

    // 비밀번호 hash
    const hashedPassword = await bcrypt.hash(password, 10);

    // 저장소(Repository)에게 데이터를 요청합니다.
    const createUser = await this.usersRepository.createUser(email, hashedPassword);

    // 비즈니스 로직을 수행한 후 사용자에게 보여줄 데이터를 가공합니다.
    return {
      id: createUser.id,
      email: createUser.email,
      createdAt: createUser.createdAt,
      updatedAt: createUser.updatedAt
    };
  };

  updateUser = async (id, password) => {
    // 저장소(Repository)에게 특정 게시글 하나를 요청합니다.
    const user = await this.usersRepository.findUsersById(id);
    if (!user) throw new Error("NoExistedUser");

    // 비밀번호 hash
    const hashedPassword = await bcrypt.hash(password, 10);

    // 저장소(Repository)에게 데이터 수정을 요청합니다.
    await this.usersRepository.updateUser(id, hashedPassword);

    // 변경된 데이터를 조회합니다.
    const updateUser = await this.usersRepository.findUsersById(id, name, password);

    return {
      id: updateUser.id,
      email: updateUser.email,
      createdAt: updateUser.createdAt,
      updatedAt: updateUser.updatedAt
    };
  };

  deleteUser = async (id, password) => {
    // 저장소(Repository)에게 특정 게시글 하나를 요청합니다.
    const user = await this.usersRepository.findUsersById(id);
    if (!user) throw new Error("NoExistedUser");

    // 비밀번호 확인
    const isValidPass = await comparePassword(password, user.password);
    if (!isValidPass) throw new Error("NotCorrectPassword");

    // 저장소(Repository)에게 데이터 삭제를 요청합니다.
    await this.usersRepository.deleteUser(id);

    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  };
}
