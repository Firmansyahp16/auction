import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
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

  create = async (data: Prisma.AuctionCreateInput) => {
    return this.db.auction.create({
      data: {
        ...data,
        id: generateID(IDType.AUCTION),
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
}
