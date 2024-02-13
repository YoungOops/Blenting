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
    console.log('🚀 ~ UsersRepository ~ readOneById= ~ userId:', userId);
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

  /* 페이지네이션 */
  readSomeUsers = async (pageNo, countPerPage) => {
    //클래스의 `constructor`에서 `prisma` 인스턴스를 받아 클래스 프로퍼티로 설정하고 메서드 내에서는 `this.prisma`를 사용합니다.
    const findUsers = await this.prisma.Users.findMany({
      skip: (pageNo - 1) * countPerPage, // 앞선 페이지의 항목들을 건너뜁니다.
      take: countPerPage, // 현재 페이지에서 가져올 항목 수를 지정합니다.
      include: { Auths: true },
    });
    // `skip`은 건너뛸 레코드 수를 지정하고, `take`는 반환할 레코드 수를 지정합니다.
    return findUsers;
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
}
