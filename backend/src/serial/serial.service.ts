import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
interface EspPayload {
  estados: number[];
}
@Injectable()
export class SerialService implements OnModuleInit {
  private readonly logger = new Logger(SerialService.name);
  private port!: SerialPort;

  constructor(private eventEmitter: EventEmitter2) {}

  onModuleInit() {
    this.port = new SerialPort({
      path: '/dev/ttyUSB0', // en Windows sería 'COM3'
      baudRate: 115200,
      autoOpen: true,
    });

    const parser = this.port.pipe(new ReadlineParser({ delimiter: '\n' }));

    parser.on('data', (linea: string) => {
      try {
        const datos = JSON.parse(linea.trim()) as EspPayload;
        this.logger.log(`ESP32: ${linea.trim()}`);
        // Dispara evento interno hacia el Gateway
        this.eventEmitter.emit('serial.data', datos);
      } catch {
        this.logger.warn(`JSON inválido: ${linea}`);
      }
    });

    this.port.on('error', (err) => {
      this.logger.error(`Error serial: ${err.message}`);
    });
  }

  send(payload: object): void {
    const mensaje = JSON.stringify(payload) + '\n';
    this.port.write(mensaje);
  }

  sendParkingState(disponibles: number): void {
    this.send({ type: 'parking', disponibles });
  }
}
