import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

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

const STORAGE_KEY = "parking_last_state";

const loadSaved = (): ParkingUpdate => {
  try {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return {
    cajones: Array.from({ length: 5 }, (_, i) => ({
      id: i + 1,
      ocupado: false,
    })),
    ocupados: 0,
    disponibles: 5,
    porcentaje: 0,
  };
};

export const useParking = () => {
  const [data, setData] = useState<ParkingUpdate>(loadSaved);

  useEffect(() => {
    const socket: Socket = io(`http://${window.location.hostname}:3000`);

    socket.on("parking_update", (update: ParkingUpdate) => {
      setData(update);
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(update));
      } catch {}
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return data;
};
