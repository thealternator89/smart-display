import fetch from 'node-fetch';
import * as moment from 'moment';

import { envUtil, ENV_VARS } from "../../util/EnvUtil";
import { CurrentWeather, WindDirection, WeatherCondition } from "../models/currentweather";
import { logger } from '../../util/LogUtil';

const BASE_URL = 'http://api.openweathermap.org/data/2.5/weather';
const UNITS : 'imperial'|'metric' = 'metric';

class OpenWeatherMapClient {

    private readonly apiToken;

    public constructor() {
        this.apiToken = envUtil.getStringValue(ENV_VARS.OpenWeatherMapApiKey);
        if (!this.apiToken) {
            throw new Error(`${ENV_VARS.OpenWeatherMapApiKey} env variable must be set`);
        }
    }

    public async getCurrentWeatherForLocation(locationId: number): Promise<CurrentWeather> {
        const url = `${BASE_URL}?id=${locationId}&units=${UNITS}&APPID=${this.apiToken}`;
        const data = await this.fetchJson(url);
        const weather = data.weather[0];

        return {
            name: data.name,
            description: weather.description,
            condition: this.getConditionNameFromCode(weather.id),
            iconUrl: `http://openweathermap.org/img/wn/${weather.icon}@2x.png`,
            temp: {
                current: data.main.temp,
                feelsLike: data.main.feels_like,
                min: data.main.temp_min,
                max: data.main.temp_max,
            },
            wind: {
                direction: this.degToDirection(data.wind.deg),
                speed: data.wind.speed,
            },
            updated: moment(),
        }
    }

    private getConditionNameFromCode(conditionCode: number): WeatherCondition {
        const fullCondition = `${conditionCode}`;
        const baseCondition = fullCondition ? fullCondition[0] : '';

        switch (baseCondition) {
            case '2': return 'thunderstorm';    // 2xx - Thunderstorm
            case '3': return 'drizzle';         // 3xx - Drizzle
            case '5': return 'rain';            // 5xx - Rain
            case '6': return 'snow';            // 6xx - Snow
            case '7': return 'atmosphere';      // 7xx - Atmosphere
            case '8': {
                if (fullCondition === '800'){   // 800 - Clear
                    return 'clear';
                } else {                        // 80x - Clouds
                    return 'clouds';
                }
            }
            default: {
                logger.warn(`Invalid weather fullConditionCode code found: ${conditionCode}. Using 'unknown'`);
                return 'unknown';
            }
        }
    }

    private async fetchJson(url: string): Promise<any> {
        const response = await fetch(url);
        return response.json();
    }

    private degToDirection(deg: number): WindDirection {
        if (deg < 0 || deg > 360) {
            throw new Error('wind direction must be between 0 and 360.');
        }

        if (deg < 11.25) {
            return 'N';
        } else if (deg < 33.75) {
            return 'NNE';
        } else if (deg < 56.25) {
            return 'NE';
        } else if (deg < 78.75) {
            return 'ENE';
        } else if (deg < 101.25) {
            return 'E';
        } else if (deg < 123.75) {
            return 'ESE';
        } else if (deg < 146.25) {
            return 'SE';
        } else if (deg < 168.75) {
            return 'SSE';
        } else if (deg < 191.25) {
            return 'S';
        } else if (deg < 213.75) {
            return 'SSW';
        } else if (deg < 236.25) {
            return 'SW'
        } else if (deg < 258.75) {
            return 'WSW'
        } else if (deg < 281.25) {
            return 'W'
        } else if (deg < 303.75) {
            return 'WNW'
        } else if (deg < 326.25) {
            return 'NW'
        } else if (deg < 348.75) {
            return 'NNW'
        } else {
            return 'N';
        }
    }
}

export const openWeatherMapClient = new OpenWeatherMapClient();