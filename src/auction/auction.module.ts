import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { DatabaseModule } from '../database/database.module';
import { AuctionController } from './auction.controller';
import { AuctionService } from './auction.service';

@Module({
  controllers: [AuctionController],
  providers: [AuctionService],
  imports: [DatabaseModule, AuthModule],
})
export class AuctionModule {}
