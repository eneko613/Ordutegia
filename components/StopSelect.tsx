import React, { useMemo } from 'react';
import { StopData } from '../types';

interface StopSelectProps {
  stops: StopData[];
  selectedStopId: number | null;
  onSelect: (id: number) => void;
}

const StopSelect: React.FC<StopSelectProps> = ({ stops, selectedStopId, onSelect }) => {
  
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSelect(Number(e.target.value));
  };

  return (
    <div className="w-full mb-6">
      <label htmlFor="stop-select" className="block text-sm font-medium text-slate-700 mb-2">
        Seleccionar Parada
      </label>
      <div className="relative">
        <select
          id="stop-select"
          value={selectedStopId === null ? '' : selectedStopId}
          onChange={handleChange}
          className="block w-full appearance-none rounded-lg border border-slate-300 bg-white px-4 py-3 pr-8 text-base shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm text-slate-800"
        >
          <option value="" disabled>-- Elige una parada --</option>
          {stops.map((stop) => (
            <option key={stop.id} value={stop.id}>
              {stop.name}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default StopSelect;