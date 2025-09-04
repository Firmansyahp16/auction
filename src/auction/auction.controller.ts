import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { JwtAuthGuard } from '../auth/auth.guard';
import { AuctionService } from './auction.service';

@Controller('Auction')
export class AuctionController {
  constructor(private readonly auctionService: AuctionService) {}

  @Get()
  async findAll() {
    return this.auctionService.find();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.auctionService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() data: Prisma.AuctionCreateInput) {
    return this.auctionService.create(data);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Prisma.AuctionUpdateInput,
  ) {
    return this.auctionService.updateById(id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.auctionService.deleteById(id);
  }
}
