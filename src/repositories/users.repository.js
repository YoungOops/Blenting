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

  updateOneById = async (userId, updateUserData) => {
    const updateUser = await prisma.Users.update({
      where: { id: userId },
      data: updateUserData,
    });
    return updateUser;
  };
}
