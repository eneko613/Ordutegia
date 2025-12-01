export interface StopData {
  id: number;
  name: string;
  times: string[]; // Format "HH:MM"
}

export interface BusEvent {
  stopName: string;
  time: string;
  minutesFromMidnight: number;
}

export interface BusStatus {
  status: 'AT_STOP' | 'APPROACHING' | 'FINISHED';
  targetStopName?: string;
}