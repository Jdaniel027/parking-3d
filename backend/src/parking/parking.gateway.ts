import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';
import { Logger } from '@nestjs/common';
import { SerialService } from '../serial/serial.service';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class ParkingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ParkingGateway.name);
  private ultimoEstado: { cajones: { id: number; ocupado: boolean }[]; ocupados: number; disponibles: number; porcentaje: number } | null = null;

  constructor(private readonly serialService: SerialService) {}

  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    this.logger.log(`Cliente conectado: ${client.id}`);
    if (this.ultimoEstado) {
      client.emit('parking_update', this.ultimoEstado);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente desconectado: ${client.id}`);
  }

  @SubscribeMessage('simulate_parking')
  handleSimulation(client: Socket, payload: { estados: number[] }) {
    this.logger.log(`Simulación recibida: ${JSON.stringify(payload)}`);
    this.handleSerialData(payload);
  }

  @OnEvent('serial.data')
  handleSerialData(datos: { estados: number[] }) {
    const cajones = datos.estados.map((estado, i) => ({
      id: i + 1,
      ocupado: estado === 1,
    }));

    const ocupados = cajones.filter((c) => c.ocupado).length;
    const total = cajones.length;

    const disponibles = total - ocupados;

    this.ultimoEstado = {
      cajones,
      ocupados,
      disponibles,
      porcentaje: Math.round((ocupados / total) * 100),
    };

    this.serialService.sendParkingState(disponibles);
    this.server.emit('parking_update', this.ultimoEstado);
  }
}
