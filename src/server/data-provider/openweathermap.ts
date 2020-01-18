import * as moment from 'moment';

import { CurrentWeather } from "./models/currentweather";
import { openWeatherMapClient } from './api-client/openweathermap';
import { minutesSince, isInTimeWindow } from './util';
import { AppConfigWeather } from '../models/appconfig';

export class OpenWeatherMapDataProvider {
    private readonly data: {[id: number]: CurrentWeather} = {};

    private readonly config;

    public constructor(config: AppConfigWeather[]) {
        this.config = config;
    }

    public async getCurrentWeather(): Promise<{primary: CurrentWeather, alternate: CurrentWeather[]} | undefined> {
        const weatherItem = this.config.find(isInTimeWindow);

        if (!weatherItem) {
            return undefined;
        }

        const primary = await this.getFromApiOrCache(weatherItem.primary.id);
        let alt;

        if (weatherItem.alternate) {
            alt = await Promise.all(weatherItem.alternate.map((item) => this.getFromApiOrCache(item.id)));
        }

        return {
            primary: primary,
            alternate: alt,
        };
    }


    public async getFromApiOrCache(locationId: number): Promise<CurrentWeather> {
        // If the requested location isn't in the cache, or it is older than 10 minutes we need to fetch it again.
        if (!this.data[locationId] || minutesSince(this.data[locationId].updated) >= 10) {
            this.data[locationId] = await openWeatherMapClient.getCurrentWeatherForLocation(locationId);
        }

        return this.data[locationId];
    }
}