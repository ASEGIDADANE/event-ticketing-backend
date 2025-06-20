

import { IsOptional, IsString, IsDateString, IsBooleanString } from 'class-validator';

export class FilterEventsDto {
  @IsOptional()
  @IsString({ message: 'Location must be a string.' })
  location?: string;

  @IsOptional()
  @IsDateString({}, { message: 'fromDate must be a valid ISO date string.' })
  fromDate?: string;

  @IsOptional()
  @IsDateString({}, { message: 'toDate must be a valid ISO date string.' })
  toDate?: string;

  @IsOptional()
  @IsBooleanString({ message: 'isPublished must be a boolean value (true or false).' })
  isPublished?: string; 
}



