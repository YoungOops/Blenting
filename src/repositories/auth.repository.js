import { prisma } from '../utils/prisma/index.js';

export class AuthRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  createUser = async (hashCreateAuthData) => {
    const result = await prisma.Auths.create({
      data: {
        ...hashCreateAuthData,
      },
    });
    return result;
  };

  readOneByEmail = async (email) => {
    const users = await prisma.Auths.findUnique({
      where: { email: email },
    });

    return users;
  };
}
