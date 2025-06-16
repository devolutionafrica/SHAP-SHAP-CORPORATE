// components/YearSelector.tsx
"use client"; // Indique que ce composant est exécuté côté client

import React, { useMemo } from "react";
import dayjs from "dayjs";

interface YearSelectorProps {
  onSelectYear: (year: number) => void;
  selectedYear?: number;
}

export default function YearSelector({
  onSelectYear,
  selectedYear,
}: YearSelectorProps) {
  const currentYear = dayjs().year();
  const years = useMemo(() => {
    const currentYear = dayjs().year();
    const startYear = 2000;
    const endYear = currentYear - 1;

    const yearList: number[] = [];
    for (let year = startYear; year <= endYear; year++) {
      yearList.push(year);
    }
    return yearList.reverse();
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor="year-select"
        className="text-sm font-medium text-gray-700"
      >
        Sélectionner une année :
      </label>
      <select
        id="year-select"
        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        onChange={(e) => onSelectYear(parseInt(e.target.value))}
        defaultValue={(currentYear - 1).toString()}
        value={selectedYear || ""}
      >
        <option value="">Sélectionner</option>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
}
