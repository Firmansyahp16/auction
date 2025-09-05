import { Injectable } from '@nestjs/common';
import { AuctionStatus, Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import { generateID, IDType } from '../utils/generateID';

@Injectable()
export class AuctionService {
  constructor(private db: DatabaseService) {}

  find = async (
    where?: Prisma.AuctionWhereInput,
    select?: Prisma.AuctionSelect,
  ) => {
    return this.db.auction.findMany({
      where: where ? where : {},
      select: select ? select : {},
    });
  };

  findById = async (id: string, select?: Prisma.AuctionSelect) => {
    return this.db.auction.findUnique({
      where: { id },
      select: select ? select : {},
    });
  };

  create = async (data: Prisma.AuctionCreateInput, ownerId: string) => {
    return await this.db.auction.create({
      data: {
        ...data,
        id: generateID(IDType.AUCTION),
        owner: {
          connect: {
            id: ownerId,
          },
        },
      },
    });
  };

  updateById = async (id: string, data: Prisma.AuctionUpdateInput) => {
    return this.db.auction.update({
      where: { id },
      data,
    });
  };

  deleteById = async (id: string) => {
    return this.db.auction.delete({
      where: { id },
    });
  };

  review = async (
    id: string,
    approvedById: string,
    data: {
      status: AuctionStatus;
      startTime: Date;
      endTime: Date;
    },
  ) => {
    return this.db.auction.update({
      where: { id },
      data: {
        status: data.status,
        startTime: data.startTime,
        endTime: data.endTime,
        approvedBy: {
          connect: {
            id: approvedById,
          },
        },
      },
    });
  };
}
