import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'generated/prisma';
import { CreateBookingDto } from './dto/create-booking.dto';
import { currentUser } from 'src/auth/decorators/current-user.decorator';

@Controller('bookings')
export class BookingsController {
    constructor(private readonly bookingsService: BookingsService) {}
    @UseGuards(JwtAuthGuard)
    @Post()
    async createBooking(
        @Body() createBookingDto: CreateBookingDto,
        @currentUser() user: User,
    ) {
        return this.bookingsService.createBooking(createBookingDto, user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Get('me')
    async getMyBookings(@currentUser() user: User) {
        return this.bookingsService.getUserBookings(user.id);
    }
}
