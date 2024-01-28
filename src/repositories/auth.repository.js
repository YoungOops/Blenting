import { prisma } from '../utils/prisma/index.js';
import { UsersRepository } from '../repositories/users.repository.js';

export class AuthRepository {
  usersRepository = new UsersRepository();
  constructor(prisma) {
    this.prisma = prisma;
  }

  createAuth = async ({ email, password, userId }) => {
    try {
      const result = await prisma.Auths.create({
        data: {
          email,
          password,
          userId,
        },
      });
      return result;
    } catch (err) {
      await this.usersRepository.deleteOneById(userId);
      const result = await prisma.Auths.create({
        data: {
          email,
          password,
          userId,
        },
      });
      return result;
    }
  };

  readOneByEmail = async (email) => {
    const users = await prisma.Auths.findUnique({
      where: { email: email },
    });

    return users;
  };
}
