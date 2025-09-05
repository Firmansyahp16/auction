import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis, { Redis as RedisClient } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  private pubClient: RedisClient;
  private subClient: RedisClient;
  constructor() {
    this.pubClient = new Redis({
      host: 'redis',
      port: 6379,
    });
    this.subClient = new Redis({
      host: 'redis',
      port: 6379,
    });
  }

  publish = async (channel: string, message: any) => {
    await this.pubClient.publish(channel, JSON.stringify(message));
  };

  subscribe = async (channel: string, callback: (message: any) => void) => {
    await this.subClient.subscribe(channel);
    this.subClient.on('message', (ch, msg) => {
      if (ch === channel) {
        callback(JSON.parse(msg));
      }
    });
  };

  async onModuleDestroy() {
    await this.pubClient.quit();
    await this.subClient.quit();
  }
}
