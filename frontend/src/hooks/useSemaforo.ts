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

  const aplicar = async () => {
    try {
      const body = {
        mode,
        semaforo,
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

      console.log("Enviando comando de semáforo:", body);

      const response = await fetch(
        "http://192.168.137.44:3000/commands/sendSemaforo",
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
