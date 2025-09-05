import { Injectable } from '@nestjs/common';
import { Queue, QueueEvents } from 'bullmq';

export enum QueueName {
  BID = 'bidQueue',
}

@Injectable()
export class QueueService {
  private bidQueue: Queue;
  private bidQueueEvents: QueueEvents;
  constructor() {
    this.bidQueue = new Queue(QueueName.BID, {
      connection: {
        host: 'redis',
        port: 6379,
      },
    });
    this.bidQueueEvents = new QueueEvents(QueueName.BID, {
      connection: {
        host: 'redis',
        port: 6379,
      },
    });
    this.bidQueue.waitUntilReady().then(() => console.log('BID Queue ready'));
    this.bidQueueEvents
      .waitUntilReady()
      .then(() => console.log('BID Queue Events ready'));
  }

  getBidQueue() {
    return this.bidQueue;
  }

  getBidQueueEvents() {
    return this.bidQueueEvents;
  }
}
