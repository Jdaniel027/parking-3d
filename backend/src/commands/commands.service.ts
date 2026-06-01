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
    const ids = dto.semaforo === 0
      ? [1, 2, 3, 4]
      : [dto.semaforo];

    for (const id of ids) {
      const payload = { ...dto, semaforo: id };
      this.logger.log(`Enviando comando semáforo ${id}: ${JSON.stringify(payload)}`);
      this.serialService.send(payload);
    }

    return { status: 'enviado', comando: dto };
  }
}
