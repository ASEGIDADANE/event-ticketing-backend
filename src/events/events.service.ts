import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';
import { CreateEventDto } from './create-event.dto';


@Injectable()
export class EventsService {
    constructor(private prisma: PrismaService) {}
    async createEvent(createEventDto: CreateEventDto, userId: string) {
        const { name, description, date, venueId } = createEventDto;

      
        const venue = await this.prisma.venue.findUnique({
        where: { id: venueId },
        });

        if (!venue) {
        throw new NotFoundException('Venue not found');
        }

       
        const event = await this.prisma.event.create({
        data: {
            name,
            description,
            date: new Date(date),
            organizerId: userId,
            venueId,
      },
    });

    return event;
  }
}
