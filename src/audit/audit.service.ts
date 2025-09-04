import { Injectable } from '@nestjs/common';
import { AuditAction, Prisma, ResourceType } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { generateID, IDType } from 'src/utils/generateID';

@Injectable()
export class AuditService {
  constructor(private db: DatabaseService) {}

  find = async ({
    startDate,
    endDate,
  }: {
    startDate?: Date;
    endDate?: Date;
  }) => {
    return await this.db.audit.findMany({
      where:
        startDate && endDate
          ? {
              timestamp: {
                gte: startDate,
                lte: endDate,
              },
            }
          : {},
    });
  };

  findById = async (id: string) => {
    return await this.db.audit.findUniqueOrThrow({
      where: {
        id: id,
      },
    });
  };

  updateById = async (id: string, data: Prisma.AuditUpdateInput) => {
    return await this.db.audit.update({
      where: {
        id: id,
      },
      data: data,
    });
  };

  deleteById = async (id: string) => {
    return await this.db.audit.delete({
      where: {
        id: id,
      },
    });
  };

  logAudit = async (
    entityResource: ResourceType,
    entityId: string,
    action: AuditAction,
    oldResource: Record<string, any>,
    newResource: Record<string, any>,
    ownerId: string,
  ) => {
    const id = generateID(IDType.AUCTION);
    await this.db.audit.create({
      data: {
        id: id,
        action: action,
        entityId: entityId,
        resource: entityResource,
        oldResource: oldResource,
        newResource: newResource,
        ownerId: ownerId,
        timestamp: new Date(),
      },
    });
    return await this.db.audit.findUniqueOrThrow({
      where: {
        id: id,
      },
    });
  };
}
