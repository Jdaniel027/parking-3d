import { useState, useEffect, useCallback, useRef } from "react";
import type { ParkingSpot, ParkingData } from "../types/parking";

const TOTAL_SPOTS = 5;

function emptyDaily(): number[] {
  return Array.from({ length: 7 }, () => 0);
}

function createInitialSpots(): ParkingSpot[] {
  return Array.from({ length: TOTAL_SPOTS }, (_, i) => ({
    id: i + 1,
    occupied: false,
    parkedAt: null,
  }));
}

export function useParkingData(): ParkingData & {
  toggleSpot: (id: number) => void;
} {
  const [spots, setSpots] = useState<ParkingSpot[]>(createInitialSpots);
  const [totalEntries, setTotalEntries] = useState(0);
  const [dailyEntries, setDailyEntries] = useState<number[]>(emptyDaily);
  const prevRef = useRef<ParkingSpot[]>(spots);

  useEffect(() => {
    const prev = prevRef.current;
    prevRef.current = spots;
    for (let i = 0; i < spots.length; i++) {
      if (!prev[i].occupied && spots[i].occupied) {
        const day = new Date().getDay();
        setTotalEntries((e) => e + 1);
        setDailyEntries((h) => {
          const next = [...h];
          next[day] = (next[day] || 0) + 1;
          return next;
        });
      }
    }
  }, [spots]);

  const toggleSpot = useCallback((id: number) => {
    setSpots((prev) =>
      prev.map((spot) =>
        spot.id === id
          ? spot.occupied
            ? { ...spot, occupied: false, parkedAt: null }
            : { ...spot, occupied: true, parkedAt: Date.now() }
          : spot,
      ),
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * TOTAL_SPOTS);
      setSpots((prev) =>
        prev.map((spot, i) =>
          i === randomIndex
            ? spot.occupied
              ? { ...spot, occupied: false, parkedAt: null }
              : { ...spot, occupied: true, parkedAt: Date.now() }
            : spot,
        ),
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const available = spots.filter((s) => !s.occupied).length;

  return { spots, available, total: TOTAL_SPOTS, totalEntries, dailyEntries, toggleSpot };
}
