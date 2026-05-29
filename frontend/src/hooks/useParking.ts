import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export interface Cajon {
  id: number;
  ocupado: boolean;
}

export interface ParkingUpdate {
  cajones: Cajon[];
  ocupados: number;
  disponibles: number;
  porcentaje: number;
}

export const useParking = () => {
  const [data, setData] = useState<ParkingUpdate>({
    cajones: Array.from({ length: 5 }, (_, i) => ({ id: i + 1, ocupado: false })),
    ocupados: 0,
    disponibles: 5,
    porcentaje: 0,
  });

  useEffect(() => {
    const socket: Socket = io('http://localhost:3000');

    socket.on('parking_update', (update: ParkingUpdate) => {
      setData(update);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return data;
};
