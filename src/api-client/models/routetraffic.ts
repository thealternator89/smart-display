import { Moment } from 'moment';

export interface RouteTraffic {
    start: string;
    end: string;
    via?: string;
    duration: number; //seconds
    congestion: Congestion;
    updated: Moment;
}

export type Congestion = 'low'|'moderate'|'heavy'|'severe'|'unknown';