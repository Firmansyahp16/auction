import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { QueueModule } from '../queue/queue.module';
import { RedisModule } from '../redis/redis.module';
import { BidController } from './bid.controller';
import { BidService } from './bid.service';

@Module({
  controllers: [BidController],
  providers: [BidService],
  imports: [DatabaseModule, RedisModule, QueueModule],
})
export class BidModule {}
