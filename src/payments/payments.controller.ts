import { Controller, Req } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { RequestWithUser } from 'src/auth/interfaces/request.interface';

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) {}

    async createPayment(dto: CreatePaymentDto, @Req() req: RequestWithUser) {
        const userId = req.user.id;
        return this.paymentsService.createPayment(dto, userId);
    }
}
