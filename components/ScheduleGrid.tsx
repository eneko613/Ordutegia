import React from 'react';
import { timeToMinutes } from '../utils';

interface ScheduleGridProps {
  times: string[];
  currentMinutes: number;
}

const ScheduleGrid: React.FC<ScheduleGridProps> = ({ times, currentMinutes }) => {
  // Filter for future times only, or show all with styling for past
  const isPast = (time: string) => timeToMinutes(time) < currentMinutes;

  return (
    <div className="w-full bg-white rounded-xl shadow-md p-5 border border-slate-100">
      <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
        <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Horario del día
      </h3>
      <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8">
        {times.map((time, idx) => {
          const past = isPast(time);
          return (
            <div
              key={`${time}-${idx}`}
              className={`
                text-center py-2 px-1 rounded-lg text-sm font-medium transition-colors
                ${past 
                  ? 'bg-slate-50 text-slate-400 line-through decoration-slate-300' 
                  : 'bg-primary-50 text-primary-700 hover:bg-primary-100 border border-primary-100'}
              `}
            >
              {time}
            </div>
          );
        })}
      </div>
      {times.length === 0 && (
        <p className="text-slate-400 text-center text-sm py-4">No hay horarios disponibles.</p>
      )}
    </div>
  );
};

export default ScheduleGrid;