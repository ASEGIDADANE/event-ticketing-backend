import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; 
import { CreateVenueDto } from './dto/create-venues.dto';

@Injectable()
export class VenuesService {
    constructor(private prisma: PrismaService) {}

    async createVenue(createVenueDto: CreateVenueDto, userId: string) {
    
    return this.prisma.venue.create({
      data: {
        ...createVenueDto,
        // optionally: createdById: userId
      },
    });
  }

   async getAllVenues() {
    return this.prisma.venue.findMany();
  }
}
