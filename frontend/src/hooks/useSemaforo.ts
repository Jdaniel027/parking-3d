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

  const getIds = (overrideSemaforo?: number) => {
    const s = overrideSemaforo ?? semaforo;
    if (s === 0) return [1, 2, 3, 4];
    if (s === 1 || s === 2) return [1, 2];
    return [3, 4];
  };

  const aplicar = async (override?: {
    mode?: SemaforoMode;
    semaforo?: number;
    payload?: SemaforoPayload;
  }) => {
    const effectiveMode = override?.mode ?? mode;
    const effectiveSemaforo = override?.semaforo ?? semaforo;
    const effectivePayload = override?.payload ?? payload;
    const backendUrl = `http://${window.location.hostname}:3000`;

    try {
      const promises = getIds(effectiveSemaforo).map(async (id) => {
        const body = {
          mode: effectiveMode,
          semaforo: id,
          payload:
            effectiveMode === "automatico"
              ? {
                  verde: Number(effectivePayload.verde),
                  amarillo: Number(effectivePayload.amarillo),
                  rojo: Number(effectivePayload.rojo),
                }
              : effectiveMode === "manual"
                ? { color: effectivePayload.color }
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
