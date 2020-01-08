import { Moment } from "moment";

export interface CurrentWeather {
    name: string;
    description: string;
    iconUrl: string;
    temp: WeatherTemp;
    wind: WeatherWind;
    updated: Moment;
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