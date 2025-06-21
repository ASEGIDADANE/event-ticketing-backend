import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { RequestWithUser } from 'src/auth/interfaces/request.interface';

@Controller('tickets')
export class TicketsController {
    constructor(private readonly ticketsService: TicketsService) {}
    @Post('tickets')
    @UseGuards(JwtAuthGuard, RolesGuard)
    // @Roles('organizer')
    async createTicket(@Body() dto: CreateTicketDto, @Req() req: RequestWithUser) {
        const userId = req.user.id; // Now TypeScript knows this exists
        return this.ticketsService.createTicket(dto, userId);
    }

   
    @Get('events/:id/tickets')
    async getTicketsByEvent(@Param('id') eventId: string) {
        return this.ticketsService.getTicketsByEvent(eventId);
    }

}
