// commands.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { CommandsService } from './commands.service';
import { SemaforoDto } from './dto/semaforos.dto';
import { LucesDto } from './dto/luces.dto';

@Controller('commands')
export class CommandsController {
  constructor(private readonly commandsService: CommandsService) {}

  @Post('sendLuces')
  enviarComandoLuces(@Body() dto: LucesDto) {
    return this.commandsService.enviarComandoLuces(dto);
  }
  @Post('sendSemaforo')
  enviarComando(@Body() dto: SemaforoDto) {
    return this.commandsService.enviarComandoSemaforo(dto);
  }
}
