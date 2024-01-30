import { prisma } from '../utils/prisma/index.js';

export class UsersRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  createUser = async (nickName, gender) => {
    const result = await prisma.Users.create({
      data: {
        nickName,
        gender,
        role: 'CUSTOMER',
      },
    });
    return result;
  };

  createAdmin = async (nickName, gender) => {
    const result = await prisma.Users.create({
      data: {
        nickName,
        gender,
        role: 'ADMIN',
      },
    });
    return result;
  };

  readOneById = async (userId) => {
    console.log('🚀 ~ UsersRepository ~ readOneById= ~ userId:', userId);
    const findUser = await prisma.Users.findUnique({
      where: { id: userId },
    });
    return findUser;
  };

  updateOneById = async (userId, updateUserData) => {
    const updateUser = await prisma.Users.update({
      where: { id: userId },
      data: updateUserData,
    });
    return updateUser;
  };

  deleteOneById = async (userId) => {
    const deleteUser = await prisma.Users.delete({
      where: { id: userId },
    });
    return deleteUser;
  };

  /* 유저 전체 조회 */
  readAll = async () => {
    const findUser = await prisma.Users.findMany({
      //include로 연결된 테이블의 데이터 불러오기.
      include: { Auths: true },
    });
    return findUser;
  };
  //filtering
  readFiltering = async (filterOptions) => {
    const findUser = await prisma.Users.findMany({
      //include로 연결된 테이블의 데이터 불러오기.
      where: filterOptions,
      include: { Auths: true },
    });
    return findUser;
  };
  //여기서 parseInt(userId, 10)는 userId를 10진수 정수로 변환합니다.
  readOne = async (userId) => {
    const findUser = await prisma.Users.findUnique({
      where: { id: +userId }, // 문자열 userId를 숫자로 변환1
    });
    return findUser;
  };

  deleteOne = async (userId) => {
    const deleteUser = await prisma.Users.delete({
      where: { id: parseInt(userId, 10) }, // 문자열 userId를 숫자로 변환2
    });
    return deleteUser;
  };
}
