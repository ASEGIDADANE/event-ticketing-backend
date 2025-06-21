import { Controller } from '@nestjs/common';
import { VenuesService } from './venues.service';
import { Post, Body, Get, Req, UseGuards } from '@nestjs/common';       
import { CreateVenueDto } from './dto/create-venues.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Request } from 'express';
import { Role } from '../auth/roles.enum';

@Controller('venues')
export class VenuesController {
    constructor(private readonly venuesService: VenuesService) {}

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(Role.organizer)
    async createVenue(
    @Body() createVenueDto: CreateVenueDto,
    @Req() req: Request,
    ) {
    const user = req.user as { userId: string };
    return this.venuesService.createVenue(createVenueDto, user.userId);
    }

    @Get()
    async getAllVenues() {
    return this.venuesService.getAllVenues();
    }
}
