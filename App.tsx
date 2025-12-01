import React, { useState, useEffect, useMemo } from 'react';
import { RAW_BUS_DATA } from './constants';
import { parseBusData, getCurrentMinutes, getSystemEvents, timeToMinutes } from './utils';
import { StopData, BusEvent, BusStatus } from './types';
import StopSelect from './components/StopSelect';
import NextBusCard from './components/NextBusCard';
import ScheduleGrid from './components/ScheduleGrid';

function App() {
  const [stops, setStops] = useState<StopData[]>([]);
  const [selectedStopId, setSelectedStopId] = useState<number | null>(null);
  const [currentMinutes, setCurrentMinutes] = useState<number>(getCurrentMinutes());

  // Parse data on mount
  useEffect(() => {
    const parsedData = parseBusData(RAW_BUS_DATA);
    setStops(parsedData);
  }, []);

  // Update time every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMinutes(getCurrentMinutes());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Derived state: Selected Stop Data
  const selectedStop = useMemo(() => {
    if (selectedStopId === null) return null;
    return stops.find(s => s.id === selectedStopId) || null;
  }, [selectedStopId, stops]);

  // Derived state: Next Bus Time for Selected Stop
  const nextTime = useMemo(() => {
    if (!selectedStop) return null;
    return selectedStop.times.find(time => timeToMinutes(time) >= currentMinutes) || null;
  }, [selectedStop, currentMinutes]);

  // Derived state: Global System Status (Where is the bus NOW?)
  const globalBusStatus = useMemo((): { status: 'AT_STOP' | 'APPROACHING' | 'FINISHED', targetStopName?: string } => {
    if (stops.length === 0) return { status: 'FINISHED' };

    const allEvents = getSystemEvents(stops);
    
    // Find the very next event in the whole system relative to now
    const nextEvent = allEvents.find(event => event.minutesFromMidnight >= currentMinutes);

    if (!nextEvent) {
      return { status: 'FINISHED' };
    }

    if (nextEvent.minutesFromMidnight === currentMinutes) {
      return {
        status: 'AT_STOP',
        targetStopName: nextEvent.stopName
      };
    }

    return {
      status: 'APPROACHING',
      targetStopName: nextEvent.stopName
    };
  }, [stops, currentMinutes]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center">
      {/* Header */}
      <header className="w-full bg-primary-600 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                <h1 className="text-xl font-bold tracking-tight">Tolosa Hiribusa</h1>
            </div>
            <div className="text-xs font-medium bg-primary-700 px-2 py-1 rounded">
                BETA
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-md px-4 py-6 flex-1 flex flex-col">
        
        <StopSelect 
          stops={stops} 
          selectedStopId={selectedStopId} 
          onSelect={setSelectedStopId} 
        />

        {selectedStop ? (
          <div className="animate-fade-in-up">
            <NextBusCard 
              nextTime={nextTime}
              currentMinutes={currentMinutes}
              globalStatus={globalBusStatus}
            />
            
            <ScheduleGrid 
              times={selectedStop.times}
              currentMinutes={currentMinutes}
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 mt-10">
            <svg className="w-16 h-16 mb-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-center font-medium">Selecciona una parada para<br/>ver la información en tiempo real.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-6 text-center text-slate-400 text-sm">
        <p>&copy; {new Date().getFullYear()} Tolosa Hiribusa</p>
      </footer>
    </div>
  );
}

export default App;