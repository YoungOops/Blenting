import { prisma } from '../utils/prisma/index.js';

export class UsersRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  createUser = async (hashCreateAuthData) => {
    const result = await prisma.Users.create({
      data: {
        ...hashCreateAuthData,
      },
    });
    return result;
  };

  readOneByEmail = async (email) => {
    const users = await prisma.Users.findUnique({
      where: { email: email },
    });

    return users;
  };
}
