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
import { BidService } from './bid.service';

@Controller('bid')
export class BidController {
  constructor(private readonly bidService: BidService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll() {
    return this.bidService.find();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.bidService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() data: Prisma.BidCreateInput) {
    return this.bidService.create(data);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: Prisma.BidUpdateInput) {
    return this.bidService.updateById(id, data);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.bidService.deleteById(id);
  }
}
