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
  //admin
  createAdmin = async (nickName, gender) => {
    const result = await prisma.Users.create({
      data: {
        nickName,
        gender,
        //어드민
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

  /* admin 유저 전체 조회 */
  readAll = async () => {
    const findUser = await prisma.Users.findMany({
      //include로 연결된 테이블의 데이터 불러오기.
      include: { Auths: true },
    });
    return findUser;
  };
  //admin filtering
  readFiltering = async (filterOptions) => {
    const findUser = await prisma.Users.findMany({
      //include로 연결된 테이블의 데이터 불러오기.
      where: filterOptions,
      include: { Auths: true },
    });
    return findUser;
  };

  readOne = async (userId) => {
    const findUser = await prisma.Users.findUnique({
      where: { id: +userId }, // 문자열 userId를 숫자로 변환
      include: { Auths: true },
      //아래 parseInt 방식과 같은 효과임.
    });
    return findUser;
  };
  //admin
  deleteOne = async (userId) => {
    const deleteUser = await prisma.Users.delete({
      //admin 여기서 parseInt(userId, 10)는 userId를 10진수 정수로 변환합니다.
      where: { id: parseInt(userId, 10) },
    });
    return deleteUser;
  };

  // 소개팅 방 입장 시 티켓 소모
  ticketConsumption = async (userId, ticket) => {
    const postConsumptionTicket = await prisma.Users.update({
      where: { id: userId },
      data: { ticket: ticket }
    });
    return postConsumptionTicket;
  }

}
