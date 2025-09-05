import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { generateID, IDType } from 'src/utils/generateID';
import { QueueService } from '../queue/queue.service';

@Injectable()
export class BidService {
  constructor(
    private db: DatabaseService,
    private queue: QueueService,
  ) {}

  find = async (where?: Prisma.BidWhereInput, select?: Prisma.BidSelect) => {
    return this.db.bid.findMany({
      where: where ? where : {},
      select: select ? select : {},
    });
  };

  findById = async (id: string, select?: Prisma.BidSelect) => {
    return this.db.bid.findUnique({
      where: { id },
      select: select ? select : {},
    });
  };

  create = async (data: Prisma.BidCreateInput) => {
    return this.db.bid.create({
      data: {
        ...data,
        id: generateID(IDType.BID),
      },
    });
  };

  updateById = async (id: string, data: Prisma.BidUpdateInput) => {
    return this.db.bid.update({
      where: { id },
      data,
    });
  };

  deleteById = async (id: string) => {
    return this.db.bid.delete({
      where: { id },
    });
  };

  submitBid = async (auctionId: string, bidderId: string, amount: number) => {
    await this.queue
      .getBidQueue()
      .add('submitBid', { auctionId, bidderId, amount });
  };
}
