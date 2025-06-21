import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTicketDto } from './dto/create-ticket.dto';

@Injectable()
export class TicketsService {
    constructor(private prisma: PrismaService) {}

    async createTicket(createTicketDto: CreateTicketDto, userId: string) {
    const { eventId, name, price, totalAvailable, maxPerUser } = createTicketDto;

    
    const event = await this.prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    
    if (event.organizerId !== userId) {
      throw new ForbiddenException('You are not the organizer of this event');
    }

    
    return this.prisma.ticketType.create({
      data: {
        name,
        price,
        totalAvailable,
        maxPerUser,
        eventId,
      },
    });
  }

  async getTicketsByEvent(eventId: string) {

    return this.prisma.ticketType.findMany({
      where: { eventId },
    });
  }
}
