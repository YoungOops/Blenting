import { prisma } from '../utils/prisma/index.js';

export class UsersRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  createUser = async (nickName, gender) => {
    const result = await prisma.Userss.create({
      data: {
        nickName,
        gender,
      },
    });
    return result;
  };
}
