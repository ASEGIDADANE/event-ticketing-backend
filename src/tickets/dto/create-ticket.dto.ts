// src/tickets/dto/create-ticket.dto.ts

import { IsString, IsNotEmpty, IsUUID, IsNumber, Min } from 'class-validator';

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @Min(1)
  totalAvailable: number;

  @IsNumber()
  @Min(1)
  maxPerUser: number;

  @IsUUID()
  @IsNotEmpty()
  eventId: string;
}
