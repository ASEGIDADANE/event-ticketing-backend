// 📄 src/events/dto/create-event.dto.ts

import { IsNotEmpty, IsString, IsUUID, IsDateString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty({ message: 'Event name is required.' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Description is required.' })
  description: string;

  @IsDateString({}, { message: 'Date must be a valid ISO date string.' })
  date: string; // Use string to accept ISO-formatted date input

  @IsUUID('4', { message: 'venueId must be a valid UUID.' })
  venueId: string;
}
