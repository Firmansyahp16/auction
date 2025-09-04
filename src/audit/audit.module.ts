import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AuditController } from './audit.controller';
import { AuditService } from './audit.service';

@Module({
  providers: [AuditService],
  controllers: [AuditController],
  imports: [DatabaseModule],
  exports: [AuditService],
})
export class AuditModule {}
