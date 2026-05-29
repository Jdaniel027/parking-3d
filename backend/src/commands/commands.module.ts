import { Module } from '@nestjs/common';
import { CommandsService } from './commands.service';
import { CommandsController } from './commands.controller';
import { SerialModule } from '../serial/serial.module';
@Module({
  providers: [CommandsService],
  controllers: [CommandsController],
  imports: [SerialModule],
})
export class CommandsModule {}
