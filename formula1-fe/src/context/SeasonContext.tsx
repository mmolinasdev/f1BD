import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SeasonsService } from '../services/api/seasonsService';

interface SeasonContextValue {
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  availableYears: number[];
}

const SeasonContext = createContext<SeasonContextValue>({
  selectedYear: 2024,
  setSelectedYear: () => {},
  availableYears: [2024, 2023],
});

export const SeasonProvider = ({ children }: { children: ReactNode }) => {
  const [availableYears, setAvailableYears] = useState<number[]>([2024, 2023]);
  const [selectedYear, setSelectedYear] = useState<number>(2024);

  useEffect(() => {
    SeasonsService.getAll()
      .then((temporadas) => {
        if (temporadas.length === 0) return;
        const years = temporadas
          .map((t) => t.anio)
          .sort((a, b) => b - a); // descendente: 2024, 2023...
        setAvailableYears(years);
        setSelectedYear(years[0]); // selecciona la más reciente
      })
      .catch(() => {
        // si falla la API, mantiene los defaults
      });
  }, []);

  return (
    <SeasonContext.Provider value={{ selectedYear, setSelectedYear, availableYears }}>
      {children}
    </SeasonContext.Provider>
  );
};

export const useSeason = () => useContext(SeasonContext);
