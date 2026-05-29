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

@WebSocketGateway({
  cors: { origin: '*' },
})
export class ParkingGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ParkingGateway.name);

  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    this.logger.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente desconectado: ${client.id}`);
  }

  // ← TEMPORAL: simula datos del ESP32 para probar
  @SubscribeMessage('test')
  handleTest() {
    this.handleSerialData({ estados: [0, 1, 1, 1, 1] });
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

    this.server.emit('parking_update', {
      cajones,
      ocupados,
      disponibles: total - ocupados,
      porcentaje: Math.round((ocupados / total) * 100),
    });
  }
}
