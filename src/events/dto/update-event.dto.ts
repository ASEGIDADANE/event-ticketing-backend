// 📄 src/events/dto/update-event.dto.ts

import { IsOptional, IsString, IsDateString, IsUUID } from 'class-validator';

export class UpdateEventDto {
  @IsOptional()
  @IsString({ message: 'Name must be a string.' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string.' })
  description?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Date must be a valid ISO date string.' })
  date?: string;

  @IsOptional()
  @IsUUID('4', { message: 'venueId must be a valid UUID.' })
  venueId?: string;

  @IsOptional()
  isPublished?: boolean;
}
