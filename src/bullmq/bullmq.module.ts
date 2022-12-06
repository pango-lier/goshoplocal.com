import { Module } from '@nestjs/common';
import { DemoProcessor } from './demo.processor';

@Module({
  providers: [DemoProcessor],
})
export class BullmqModule {}
