import { PaymentService } from '../services/payment.service.js';
import { UsersService } from '../services/users.service.js';

export class PaymentController {
  paymentService = new PaymentService();
  usersService = new UsersService();

  buyPackage = async (req, res, next) => {
    try {
      const { userId } = req.user;
      const { packageId } = req.body;

      const addTickets = await this.paymentService.findPackageById(packageId);
      const haveTickets = await this.usersService.findUserById(userId);
      const ticketCounts = addTickets.ticketCount + haveTickets.ticket;

      const updateUser = await this.usersService.updateUserById(userId, {
        ticket: ticketCounts,
      });

      return res.status(201).json(updateUser);
    } catch (err) {
      next(err);
    }
  };

  getPackages = async (req, res, next) => {
    try {
      const readPackages = await this.usersService.readAllPackages();
      return res.status(200).json(readPackages);
    } catch (err) {
      next(err);
    }
  };
}
