import { Module } from '@nestjs/common';
import { DemoProcessor } from './demo.processor';
import { WriteLogProcessor } from './writeLog.processor';

@Module({
  providers: [DemoProcessor, WriteLogProcessor],
})
export class BullmqModule {}
