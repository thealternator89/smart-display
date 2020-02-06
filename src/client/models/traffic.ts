export interface Traffic {
    start: string;
    end: string;
    via?: string;
    duration: number; //seconds
    congestion: Congestion;
    geometry: TrafficGeometry;
    updated: string;
}

export type Congestion = 'low'|'moderate'|'heavy'|'severe'|'unknown';

export interface TrafficGeometry {
    coordinates: [number, number][];
    type: 'LineString'
}