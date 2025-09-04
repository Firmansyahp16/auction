import { Module } from '@nestjs/common';
import { BidService } from './bid.service';
import { BidController } from './bid.controller';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  controllers: [BidController],
  providers: [BidService],
  imports: [DatabaseModule],
})
export class BidModule {}
