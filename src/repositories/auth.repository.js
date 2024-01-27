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
    } catch (userId) {
      return await this.usersRepository.deleteOneById(userId);
    }
  };

  readOneByEmail = async (email) => {
    const users = await prisma.Auths.findUnique({
      where: { email: email },
    });

    return users;
  };
}
