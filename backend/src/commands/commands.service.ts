// commands.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { SerialService } from '../serial/serial.service';
import { SemaforoDto } from './dto/semaforos.dto';
import { LucesDto } from './dto/luces.dto';
@Injectable()
export class CommandsService {
  private readonly logger = new Logger(CommandsService.name);
  constructor(private readonly serialService: SerialService) {}
  enviarComandoLuces(dto: LucesDto) {
    this.logger.log(`Enviando comando luces: ${JSON.stringify(dto)}`);
    this.serialService.send(dto);
    return { status: 'enviado', comando: dto };
  }
  enviarComandoSemaforo(dto: SemaforoDto) {
    // dto ya viene validado por el DTO
    // lo mandamos directo al ESP32 por Serial
    this.logger.log(`Enviando comando semáforo: ${JSON.stringify(dto)}`);
    this.serialService.send(dto);
    return { status: 'enviado', comando: dto };
  }
}
