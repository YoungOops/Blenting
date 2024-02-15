import { prisma } from '../utils/prisma/index.js';

export class UsersRepository {
  constructor() {
    this.prisma = prisma;
  }

  createUser = async (nickName, gender) => {
    const result = await this.prisma.Users.create({
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
    const result = await this.prisma.Users.create({
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
    const findUser = await this.prisma.Users.findUnique({
      where: { id: userId },
    });
    return findUser;
  };

  updateOneById = async (userId, updateUserData) => {
    const updateUser = await this.prisma.Users.update({
      where: { id: userId },
      data: updateUserData,
    });
    return updateUser;
  };

  deleteOneById = async (userId) => {
    const deleteUser = await this.prisma.Users.delete({
      where: { id: userId },
    });
    return deleteUser;
  };

  /* 페이지네이션을 통한 유저 조회 */
  readSomeUsers = async (pageNo, countPerPage) => {
    // 올바른 건너뛰기 값을 계산하기 위해,
    // (현재 페이지 번호 - 1)에 페이지당 개수를 곱합니다.
    const skip = (pageNo - 1) * countPerPage;
    const users = await this.prisma.Users.findMany({
      skip: skip, // 계산된 값을 skip으로 사용합니다.
      take: countPerPage, // 현재 페이지에서 가져올 항목 수를 지정합니다.
      include: { Auths: true }, // 관련된 Auths 테이블 데이터도 함께 가져옵니다.
    });
    return users;
  };
  /** 유저 토탈 카운트 메서드 */
  getTotalCount = async () => {
    const count = await this.prisma.Users.count();
    return count;
  };

  /* admin 유저 전체 조회 */
  readAll = async () => {
    const findUser = await this.prisma.Users.findMany({
      //include로 연결된 테이블의 데이터 불러오기.
      include: { Auths: true },
    });
    return findUser;
  };

  /** admin filtering */
  readFiltering = async (filterOptions) => {
    const findUser = await this.prisma.Users.findMany({
      //include로 연결된 테이블의 데이터 불러오기.
      where: filterOptions,
      include: { Auths: true },
    });
    return findUser;
  };

  readOne = async (userId) => {
    const findUser = await this.prisma.Users.findUnique({
      where: { id: +userId }, // 문자열 userId를 숫자로 변환
      include: { Auths: true },
      //아래 parseInt 방식과 같은 효과임.
    });
    return findUser;
  };
  //admin
  deleteOne = async (userId) => {
    const deleteUser = await this.prisma.Users.delete({
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
