//일단 복사

import { UsersRepository } from "../repositories/users.repository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import env from "dotenv";
env.config();

const accessTokenSecretKey = process.env.ACCESS_TOKEN_SECRET_KEY;

const comparePassword = async (password, hash) => {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.log(error);
  }
  return false;
};

export class AuthService {
  authRepository = new UsersRepository();

  login = async (email, password) => {
    // 저장소(Repository)에게 특정 유저정보 하나를 요청합니다.
    const user = await this.authRepository.findUsersByEmail(email);
    // 비밀번호 확인
    const isValidPass = await comparePassword(password, user.password);
    if (!isValidPass) throw new Error("NotCorrectPassword");

    // jwt 토큰 생성
    const accessToken = jwt.sign({ id: user.id }, accessTokenSecretKey, {
      expiresIn: "10h"
    });

    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      accessToken
    };
  };
}
