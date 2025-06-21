import { Controller } from '@nestjs/common';
import { EventsService } from './events.service';
import { Post, Body, Get, Query, Param, ParseUUIDPipe, Patch, Delete, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateEventDto } from './create-event.dto';
import { FilterEventsDto } from './dto/filter-events.dto';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UpdateEventDto } from './dto/update-event.dto';
import { RequestWithUser } from 'src/auth/interfaces/request.interface';

@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) {}

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
//  @Roles('organizer')
    async createEvent(
        @Body() createEventDto: CreateEventDto,
        @Req() req: RequestWithUser,
    ) {
        return this.eventsService.createEvent(createEventDto, req.user.id);
    }


    @Get()
    async getAllEvents(@Query() filterDto: FilterEventsDto) {
        return this.eventsService.getAllEvents(filterDto);
    }

 
    @Get(':id')
    async getEventById(@Param('id', ParseUUIDPipe) id: string) {
        return this.eventsService.getEventById(id);
    }

  
    @Patch(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    //   @Roles('organizer')
    async updateEvent(
        @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateEventDto,
    @Req() req: RequestWithUser,
    ) {
        return this.eventsService.updateEvent(id, updateDto, req.user.id);
    }

  
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
//   @Roles('organizer')
  async deleteEvent(
    @Param('id', ParseUUIDPipe) id: string,
    @Req() req: RequestWithUser,
  ) {
    return this.eventsService.deleteEvent(id, req.user.id);
  }
}
