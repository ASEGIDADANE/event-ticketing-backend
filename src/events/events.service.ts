import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';
import { CreateEventDto } from './create-event.dto';
import { FilterEventsDto } from './dto/filter-events.dto';
import { UpdateEventDto } from './dto/update-event.dto';


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



  async getAllEvents(filterDto: FilterEventsDto) {
    const { location, fromDate, toDate, isPublished } = filterDto;

    const filters: any = {};

    if (isPublished !== undefined) {
        filters.isPublished = isPublished === 'true';
    }

    if (fromDate || toDate) {
        filters.date = {};
        if (fromDate) filters.date.gte = new Date(fromDate);
        if (toDate) filters.date.lte = new Date(toDate);
    }

    if (location) {
        filters.venue = {
        location: {
            contains: location,
            mode: 'insensitive',
        },
        };
    }

    return this.prisma.event.findMany({
        where: filters,
        include: {
        venue: true,
        organizer: true,
        },
    });
}

async getEventById(id: string) {
  const event = await this.prisma.event.findUnique({
    where: { id },
    include: {
      venue: true,
      organizer: true,
    },
  });

  if (!event) {
    throw new NotFoundException('Event not found');
  }

  return event;
}


async updateEvent(id: string, updateDto: UpdateEventDto, userId: string) {
  const event = await this.prisma.event.findUnique({ where: { id } });

  if (!event) {
    throw new NotFoundException('Event not found');
  }

  if (event.organizerId !== userId) {
    throw new ForbiddenException('You can only update your own events');
  }

  return this.prisma.event.update({
    where: { id },
    data: updateDto,
  });
}


async deleteEvent(id: string, userId: string) {
  const event = await this.prisma.event.findUnique({ where: { id } });

  if (!event) {
    throw new NotFoundException('Event not found');
  }

  if (event.organizerId !== userId) {
    throw new ForbiddenException('You can only delete your own events');
  }

  return this.prisma.event.delete({
    where: { id },
  });
}



}
