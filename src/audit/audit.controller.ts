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
import { AuditAction, Prisma, ResourceType } from '@prisma/client';
import { JwtAuthGuard } from '../auth/auth.guard';
import { AuditService } from './audit.service';

@Controller('Audit')
export class AuditController {
  constructor(private auditService: AuditService) {}

  @Get()
  async findAll(@Param() params?: { startDate?: Date; endDate?: Date }) {
    const filter = {
      startDate: params ? params.startDate : undefined,
      endDate: params ? params.endDate : undefined,
    };
    return await this.auditService.find(filter);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.auditService.findById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body()
    data: {
      entityResource: ResourceType;
      entityId: string;
      action: AuditAction;
      oldResource: Record<string, any>;
      newResource: Record<string, any>;
      ownerId: string;
    },
  ) {
    return this.auditService.logAudit(
      data.entityResource,
      data.entityId,
      data.action,
      data.oldResource,
      data.newResource,
      data.ownerId,
    );
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: Prisma.BidUpdateInput) {
    return this.auditService.updateById(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.auditService.deleteById(id);
  }
}
