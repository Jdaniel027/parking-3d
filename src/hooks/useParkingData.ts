import { useState, useEffect, useCallback } from "react";
import type { ParkingSpot, ParkingData } from "../types/parking";

const TOTAL_SPOTS = 5;

function createInitialSpots(): ParkingSpot[] {
  return Array.from({ length: TOTAL_SPOTS }, (_, i) => ({
    id: i + 1,
    occupied: false,
  }));
}

export function useParkingData(): ParkingData & {
  toggleSpot: (id: number) => void;
} {
  const [spots, setSpots] = useState<ParkingSpot[]>(createInitialSpots);

  const toggleSpot = useCallback((id: number) => {
    setSpots((prev) =>
      prev.map((spot) =>
        spot.id === id ? { ...spot, occupied: !spot.occupied } : spot,
      ),
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * TOTAL_SPOTS);
      setSpots((prev) =>
        prev.map((spot, i) =>
          i === randomIndex ? { ...spot, occupied: !spot.occupied } : spot,
        ),
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const available = spots.filter((s) => !s.occupied).length;

  return { spots, available, total: TOTAL_SPOTS, toggleSpot };
}
