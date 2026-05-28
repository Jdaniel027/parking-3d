import { Module } from '@nestjs/common';
import { SerialService } from './serial.service';

@Module({
  providers: [SerialService],
  exports: [SerialService], // lo exportas para usarlo en commands después
})
export class SerialModule {}
