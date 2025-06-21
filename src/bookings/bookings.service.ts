import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
    constructor(private readonly prisma: PrismaService) {}

     async createBooking(dto: CreateBookingDto, userId: string) {
        return await this.prisma.$transaction(async (tx) => {
        const ticket = await tx.ticketType.findUnique({
            where: { id: dto.ticketTypeId },
        });

        if (!ticket) {
            throw new NotFoundException('Ticket type not found');
        }

        const totalBooked = await tx.booking.aggregate({
            where: { ticketTypeId: dto.ticketTypeId },
            _sum: { quantity: true },
        });

        const userBooked = await tx.booking.aggregate({
            where: { ticketTypeId: dto.ticketTypeId, userId },
            _sum: { quantity: true },
        });

        const alreadyTaken = totalBooked._sum.quantity || 0;
        const alreadyUserBooked = userBooked._sum.quantity || 0;

        if (alreadyTaken + dto.quantity > ticket.totalAvailable) {
            throw new ForbiddenException('Not enough tickets available');
        }

        if (alreadyUserBooked + dto.quantity > ticket.maxPerUser) {
            throw new ForbiddenException('User booking limit exceeded');
        }

        return await tx.booking.create({
            data: {
            quantity: dto.quantity,
            ticketTypeId: dto.ticketTypeId,
            userId,
            status: 'confirmed',
            },
        });
        });
    }

    async getUserBookings(userId: string) {
        return await this.prisma.booking.findMany({
        where: { userId },
        include: {
            ticketType: {
            include: {
                event: true,
            },
            },
        },
        });
    }
}
