import { prisma } from '../utils/prisma/index.js';

export class PaymentRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  readPackageById = async (packageId) => {
    const findUser = await prisma.Payments.findUnique({
      where: { id: packageId },
    });
    return findUser;
  };

  readAllPackages = async () => {
    const findAllPackages = await prisma.Payments.findMany();
    return findAllPackages;
  };
}
