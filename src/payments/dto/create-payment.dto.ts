

import { IsUUID, IsNumber, Min, IsString, IsNotEmpty } from 'class-validator';

export class CreatePaymentDto {
  @IsUUID()
  bookingId: string;

  @IsNumber()
  @Min(0.01, { message: 'Amount must be greater than 0' })
  amount: number;

  @IsString()
  @IsNotEmpty({ message: 'Payment method is required' })
  method: string;
}
