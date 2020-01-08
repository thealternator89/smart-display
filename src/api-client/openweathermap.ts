import fetch from 'node-fetch';
import * as moment from 'moment';

import { envUtil, ENV_VARS } from "../util/EnvUtil";
import { CurrentWeather, WindDirection } from "./models/currentweather";

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

        return {
            name: data.name,
            description: data.weather[0].description,
            iconUrl: `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
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