import { BusEvent, StopData } from "./types";

/**
 * Converts "HH:MM" string to minutes from midnight
 */
export const timeToMinutes = (timeStr: string): number => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Gets current minutes from midnight
 */
export const getCurrentMinutes = (): number => {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
};

/**
 * Parses the raw data string into structured StopData
 */
export const parseBusData = (rawData: string): StopData[] => {
  const lines = rawData.split(';').filter(line => line.trim().length > 0);
  
  return lines.map((line, index) => {
    const parts = line.split(',').map(p => p.trim());
    const name = parts[0];
    const times = parts.slice(1).filter(t => t); // Remove empty strings
    
    // Sort times just in case, though source seems sorted
    times.sort((a, b) => timeToMinutes(a) - timeToMinutes(b));

    return {
      id: index,
      name,
      times
    };
  });
};

/**
 * Flattens all stops into a chronological list of events for the whole system
 * This helps track where the bus is globally.
 */
export const getSystemEvents = (stops: StopData[]): BusEvent[] => {
  const events: BusEvent[] = [];
  stops.forEach(stop => {
    stop.times.forEach(time => {
      events.push({
        stopName: stop.name,
        time,
        minutesFromMidnight: timeToMinutes(time)
      });
    });
  });
  // Sort chronologically
  return events.sort((a, b) => a.minutesFromMidnight - b.minutesFromMidnight);
};

/**
 * Formats minutes remaining into a readable string
 */
export const formatTimeRemaining = (minutes: number): string => {
  if (minutes === 0) return "Ahora";
  if (minutes < 60) return `${minutes} min`;
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hrs}h ${mins}min`;
};