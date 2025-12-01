import React from 'react';
import { timeToMinutes, formatTimeRemaining } from '../utils';

interface NextBusCardProps {
  nextTime: string | null;
  currentMinutes: number;
  globalStatus: {
    status: 'AT_STOP' | 'APPROACHING' | 'FINISHED';
    targetStopName?: string;
  };
}

const NextBusCard: React.FC<NextBusCardProps> = ({ nextTime, currentMinutes, globalStatus }) => {
  if (!nextTime) {
    return (
      <div className="w-full bg-slate-200 rounded-2xl p-6 mb-6 text-center shadow-inner">
        <p className="text-slate-500 font-medium">No hay más salidas hoy</p>
      </div>
    );
  }

  const arrivalMinutes = timeToMinutes(nextTime);
  const diff = arrivalMinutes - currentMinutes;
  const timeRemainingStr = formatTimeRemaining(diff);

  return (
    <div className="w-full bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-6 mb-6 text-white shadow-lg relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full bg-white opacity-10 blur-xl"></div>
      <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-20 h-20 rounded-full bg-white opacity-10 blur-lg"></div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-2">
          <span className="text-primary-100 font-medium text-sm uppercase tracking-wide">Próximo Autobús</span>
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold">
            {timeRemainingStr}
          </div>
        </div>

        <div className="flex items-baseline mt-1 mb-4">
          <span className="text-5xl font-bold tracking-tight">{nextTime}</span>
        </div>

        {/* Global Bus Location Indicator */}
        <div className="pt-4 border-t border-white/20">
          <div className="flex items-center gap-3">
             <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-200 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </div>
            <div className="flex-1">
              <p className="text-xs text-primary-200 font-medium uppercase mb-0.5">Ubicación del Bus</p>
              <p className="text-sm font-semibold truncate leading-tight">
                {globalStatus.status === 'FINISHED' && "Fuera de servicio"}
                {globalStatus.status === 'AT_STOP' && `En parada: ${globalStatus.targetStopName}`}
                {globalStatus.status === 'APPROACHING' && `Llegando a: ${globalStatus.targetStopName}`}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NextBusCard;