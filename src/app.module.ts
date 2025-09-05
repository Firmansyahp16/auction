import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuctionModule } from './auction/auction.module';
import { AuditModule } from './audit/audit.module';
import { AuthModule } from './auth/auth.module';
import { BidModule } from './bid/bid.module';
import { DatabaseModule } from './database/database.module';
import { QueueModule } from './queue/queue.module';
import { QueueService } from './queue/queue.service';
import { RedisModule } from './redis/redis.module';
import { RedisService } from './redis/redis.service';
import { UserModule } from './user/user.module';
import { WorkerModule } from './worker/worker.module';
import { WorkerService } from './worker/worker.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRoot({
      connection: {
        host: 'redis',
        port: 6379,
      },
      defaultJobOptions: {
        attempts: 3,
      },
    }),
    DatabaseModule,
    UserModule,
    AuctionModule,
    BidModule,
    AuditModule,
    AuthModule,
    JwtModule,
    RedisModule,
    QueueModule,
    WorkerModule,
  ],
  controllers: [AppController],
  providers: [AppService, RedisService, QueueService, WorkerService],
})
export class AppModule {}
