export interface WeatherData {
    primary: Weather;
    alternate: Weather[];
}

export interface Weather {
    name: string;
    condition: WeatherCondition;
    description: string;
    iconUrl: string;
    temp: WeatherTemp;
    wind: WeatherWind;
    updated: string;
}

export interface WeatherTemp {
    current: number;
    feelsLike: number;
    min: number;
    max: number;
}

export interface WeatherWind {
    speed: number;
    direction: WindDirection;
}

export type WindDirection = 
    'N'|'NNE'|'NE'|'ENE'|
    'E'|'ESE'|'SE'|'SSE'|
    'S'|'SSW'|'SW'|'WSW'|
    'W'|'WNW'|'NW'|'NNW';

export type WeatherCondition = 'atmosphere'|'clear'|'clouds'|'drizzle'|'rain'|'snow'|'thunderstorm'|'unknown'|'none';