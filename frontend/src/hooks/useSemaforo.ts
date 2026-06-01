import { useState } from "react";

export type SemaforoMode = "automatico" | "manual" | "emergencia";
export type SemaforoColor = "verde" | "amarillo" | "rojo";

export interface SemaforoPayload {
  verde?: number;
  amarillo?: number;
  rojo?: number;
  color?: SemaforoColor;
}

export const useSemaforo = () => {
  const [mode, setMode] = useState<SemaforoMode>("automatico");
  const [semaforo, setSemaforo] = useState<number>(0); // 0 = todos
  const [payload, setPayload] = useState<SemaforoPayload>({
    verde: 10,
    amarillo: 3,
    rojo: 10,
    color: "verde",
  });

  const getIds = () => {
    if (semaforo === 0) return [1, 2, 3, 4];
    if (semaforo === 1 || semaforo === 2) return [1, 2];
    return [3, 4];
  };

  const aplicar = async () => {
    const backendUrl = `http://${window.location.hostname}:3000`;

    try {
      const promises = getIds().map(async (id) => {
        const body = {
          mode,
          semaforo: id,
          payload:
            mode === "automatico"
              ? {
                  verde: Number(payload.verde),
                  amarillo: Number(payload.amarillo),
                  rojo: Number(payload.rojo),
                }
              : mode === "manual"
                ? { color: payload.color }
                : {},
        };

        console.log(`Enviando comando para semáforo ${id}:`, body);

        const response = await fetch(
          `${backendUrl}/commands/sendSemaforo`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(body),
          },
        );

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
      });

      await Promise.all(promises);
    } catch (error) {
      console.error("Error enviando comando de semáforo:", error);
    }
  };

  return {
    mode,
    setMode,
    semaforo,
    setSemaforo,
    payload,
    setPayload,
    aplicar,
  };
};
