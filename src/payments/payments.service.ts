import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';

@Injectable()
export class PaymentsService {
    constructor(private readonly prisma: PrismaService) {}

     async createPayment(dto: CreatePaymentDto, userId: string) {
   
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    
    if (booking.userId !== userId) {
      throw new ForbiddenException('You do not own this booking');
    }

    
    const existingPayment = await this.prisma.payment.findUnique({
      where: { bookingId: dto.bookingId },
    });

    if (existingPayment) {
      throw new BadRequestException('Payment already processed for this booking');
    }

    
    const isSuccess = Math.random() > 0.2; 
    const paymentStatus = isSuccess ? 'success' : 'fail';

    
    const payment = await this.prisma.payment.create({
      data: {
        amount: dto.amount,
        method: dto.method,
        status: paymentStatus,
        bookingId: dto.bookingId,
      },
    });

    
    // if (isSuccess) {
    //   await this.prisma.booking.update({
    //     where: { id: dto.bookingId },
    //     data: {
          
    //       status: 'paid',
    //     },
    //   });
    // }

    
    return payment;
  }
}
