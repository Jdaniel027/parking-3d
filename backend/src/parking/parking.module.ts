import { Module } from '@nestjs/common';
import { ParkingGateway } from './parking.gateway';

@Module({
  providers: [ParkingGateway],
})
export class ParkingModule {}
