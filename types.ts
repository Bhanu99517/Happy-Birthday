export enum TrackingStatus {
  Idle = 'IDLE',
  InProgress = 'IN_PROGRESS',
  Complete = 'COMPLETE',
}

export interface TrackingResult {
  address: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
  ip: string;
  carrier: string;
}