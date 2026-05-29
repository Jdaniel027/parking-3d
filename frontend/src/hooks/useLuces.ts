import { useState } from 'react';

export type LucesZona = 'oeste' | 'este' | 'ambas';
export type LucesMode = 'manual' | 'eco' | 'apagar';

export interface LucesPayload {
  intensidad?: number; // 0 a 100
}

export const useLuces = () => {
  const [zona, setZona] = useState<LucesZona>('oeste');
  const [mode, setMode] = useState<LucesMode>('eco');
  const [payload, setPayload] = useState<LucesPayload>({ intensidad: 50 });

  const confirmar = async (override?: { zona?: LucesZona, mode?: LucesMode, payload?: LucesPayload }) => {
    try {
      const targetZona = override?.zona || zona;
      const targetMode = override?.mode || mode;
      const targetPayload = override?.payload || payload;

      const body = {
        zona: targetZona,
        mode: targetMode,
        payload: targetMode === 'manual' 
          ? { intensidad: Number(targetPayload.intensidad) } 
          : targetMode === 'apagar'
          ? { on: false }
          : {}
      };

      console.log('Enviando comando de luces:', body);

      const response = await fetch('http://localhost:3000/commands/sendLuces', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error enviando comando de luces:', error);
    }
  };

  return {
    zona,
    setZona,
    mode,
    setMode,
    payload,
    setPayload,
    confirmar
  };
};
