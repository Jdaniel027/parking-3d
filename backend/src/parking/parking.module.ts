import { Module } from '@nestjs/common';
import { ParkingGateway } from './parking.gateway';
import { SerialModule } from '../serial/serial.module';

@Module({
  imports: [SerialModule],
  providers: [ParkingGateway],
})
export class ParkingModule {}
