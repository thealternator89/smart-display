import * as moment from 'moment';

import { CurrentWeather } from "../api-client/models/currentweather";
import { openWeatherMapClient } from '../api-client/openweathermap';
import { minutesSince } from './util';

class OpenWeatherMapCache {
    private readonly data: {[id: number]: CurrentWeather} = {};

    public async getFromApiOrCache(locationId: number): Promise<CurrentWeather> {
        // If the requested location isn't in the cache, or it is older than 10 minutes we need to fetch it again.
        if (!this.data[locationId] || minutesSince(this.data[locationId].updated) >= 10) {
            this.data[locationId] = await openWeatherMapClient.getCurrentWeatherForLocation(locationId);
        }

        return this.data[locationId];
    }
}

export const openWeatherMapCache = new OpenWeatherMapCache();