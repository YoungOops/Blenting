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
    const findUser = await prisma.Users.findUnique({
      where: { id: userId },
    });
    return findUser;
  };

  /** 유저 전체 조회 */
  readAll = async () => {
    const findUser = await prisma.Users.findMany();
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
}
