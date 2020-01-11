export interface Traffic {
    start: string;
    end: string;
    via?: string;
    duration: number; //seconds
    congestion: Congestion;
    updated: string;
}

export type Congestion = 'low'|'moderate'|'heavy'|'severe'|'unknown';