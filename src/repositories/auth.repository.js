import { prisma } from '../utils/prisma/index.js';

export class AuthRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  createAuth = async ({ email, password, userId }) => {
    const result = await prisma.Auths.create({
      data: {
        email,
        password,
        userId,
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
