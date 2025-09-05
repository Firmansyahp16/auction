import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { QueueName, QueueService } from './queue.service';

@Module({
  providers: [QueueService],
  exports: [QueueService],
  imports: [
    BullModule.registerQueue({
      name: QueueName.BID,
    }),
  ],
})
export class QueueModule {}
