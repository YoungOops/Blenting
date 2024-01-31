import { PaymentRepository } from '../repositories/payment.repository.js';

//유저 상세
export class PaymentService {
  paymentRepository = new PaymentRepository();

  findPackageById = async (packageId) => {
    return await this.paymentRepository.readPackageById(packageId);
  };
}
