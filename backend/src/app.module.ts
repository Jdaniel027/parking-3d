import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommandsModule } from './commands/commands.module';
import { SerialModule } from './serial/serial.module';
import { ParkingModule } from './parking/parking.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
@Module({
  imports: [
    EventEmitterModule.forRoot(),
    CommandsModule,
    SerialModule,
    ParkingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
