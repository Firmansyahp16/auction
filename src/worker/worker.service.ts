import { Injectable } from '@nestjs/common';
import { Job, Worker } from 'bullmq';
import { QueueName } from '../queue/queue.service';

@Injectable()
export class WorkerService {
  private bidWorker: Worker;

  constructor() {
    this.bidWorker = new Worker(
      QueueName.BID,
      async (job) => this.processBid(job),
      {
        connection: {
          host: 'redis',
          port: 6379,
        },
        concurrency: 1,
      },
    );
    this.bidWorker.on('failed', (job, err) => {
      console.log(`Job ${job?.id} failed: ${err.message}`);
    });
    this.bidWorker.on('completed', (job) => {
      console.log(`Job ${job?.id} completed`);
    });
  }

  getBidWorker() {
    return this.bidWorker;
  }

  private processBid = async (job: Job) => {
    const { auctionId, amount, bidderId } = job.data;
    console.log(
      `Processing bid for auction ${auctionId} with amount ${amount} from ${bidderId}`,
    );
    // Process the bid
  };
}
