import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

import { NotFoundException } from '@nestjs/common/exceptions/not-found.exception';
import { CreateEventDto } from './create-event.dto';
import { FilterEventsDto } from './dto/filter-events.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Cache, CACHE_MANAGER} from '@nestjs/cache-manager';
import { FindEventQueryDto } from './dto/find-event-query.dto';
import { promises } from 'dns';
import { paginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { PaginationResponse } from 'src/common/interfaces/pagination-response.interface';
import { Event as EventEntity } from '../../generated/prisma';




@Injectable()
export class EventsService {
    private eventsCacheKey:Set<string> = new Set();
    constructor(
        private prisma: PrismaService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}


    private eventListCacheKey (query:FindEventQueryDto): string {
        const { page, limit,name } = query;
        return `events:${name || ''}:page:${page || 1}:limit:${limit || 10}`;
    }

    
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
    // Invalidate cache for the event list
    this.eventsCacheKey.forEach(async (key) => {
      await this.cacheManager.del(key);
    });

    return event;
  }


  async getAllEvents(query: FindEventQueryDto): Promise<PaginationResponse<EventEntity>> {
    const cacheKey = this.eventListCacheKey(query);
    this.eventsCacheKey.add(cacheKey);
    const cachedEvents = await this.cacheManager.get<PaginationResponse<EventEntity>>(cacheKey);

    if (cachedEvents) {
      console.log('cache hit');
      return cachedEvents;
    }

    console.log('cache miss');

    const { page = 1, limit = 10, name } = query;

    const skip = (page - 1) * limit;
 

    const where: any = {};
    if (name) {
      where.name = { contains: name, mode: 'insensitive' };
    }

    const [events, total] = await Promise.all([
      this.prisma.event.findMany({
        where,
        include: {
          venue: true,
          organizer: true,
        },
        skip,
        take: limit,
        orderBy: { date: 'desc' },
      }),
      this.prisma.event.count({ where }),
    ]);

    const result: PaginationResponse<EventEntity> = {
      items: events as EventEntity[],
      metadata: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < Math.ceil(total / limit),
        hasPreviousPage: page > 1,
      },
};

    await this.cacheManager.set(cacheKey, result, 60); // cache for 60 seconds

    return result;
      






}



//   async getAllEvents(filterDto: FilterEventsDto) {
//     const { location, fromDate, toDate, isPublished } = filterDto;

//     const filters: any = {};

//     if (isPublished !== undefined) {
//         filters.isPublished = isPublished === 'true';
//     }

//     if (fromDate || toDate) {
//         filters.date = {};
//         if (fromDate) filters.date.gte = new Date(fromDate);
//         if (toDate) filters.date.lte = new Date(toDate);
//     }

//     if (location) {
//         filters.venue = {
//         location: {
//             contains: location,
//             mode: 'insensitive',
//         },
//         };
//     }

//     return this.prisma.event.findMany({
//         where: filters,
//         include: {
//         venue: true,
//         organizer: true,
//         },
//     });
// }



async getEventById(id: string) {
  const cacheKey = `event:${id}`;
  this.eventsCacheKey.add(cacheKey);
  const cachedEvent = await this.cacheManager.get<EventEntity>(cacheKey);
  if (cachedEvent) {
    console.log('cache hit');
    return cachedEvent;
  }
  console.log('cache miss');

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

  await this.cacheManager.set(cacheKey, event, 60);

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
// invalidate cache for the specific event
  await this.cacheManager.del(`event:${id}`); 
  this.eventsCacheKey.forEach(async (key) => {
    await this.cacheManager.del(key);
  });


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

  await this.cacheManager.del(`event:${id}`); // Invalidate cache for the specific event
  this.eventsCacheKey.forEach(async (key) => {
    await this.cacheManager.del(key);
  });
  

  return this.prisma.event.delete({
    where: { id },
  });
}



}
