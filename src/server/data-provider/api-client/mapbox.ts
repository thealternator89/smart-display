import fetch from 'node-fetch';
import * as moment from 'moment';

import { envUtil, ENV_VARS } from "../../util/EnvUtil";
import { AppConfigTrafficRoutePoint } from "../../models/appconfig";
import { RouteTraffic, Congestion } from "../models/routetraffic";
import { logger } from '../../util/LogUtil';

const BASE_URL = 'https://api.mapbox.com/directions/v5/mapbox/driving-traffic';

class MapBoxApiClient {
    private readonly apiToken;

    public constructor() {
        this.apiToken = envUtil.getStringValue(ENV_VARS.MapBoxApiKey);
        if (!this.apiToken) {
            throw new Error(`${ENV_VARS.MapBoxApiKey} env variable must be set`);
        }
    }

    public async getTrafficForRoute(routeRequest: AppConfigTrafficRoutePoint[]): Promise<RouteTraffic> {
        const body = this.buildBody(routeRequest.map((point) => this.latLonToLonLat(point.coords)).join(';'));

        const response= await fetch(
            `${BASE_URL}?access_token=${this.apiToken}`,
            { method: 'POST', body: body }
        );
        const json = await response.json();
        
        const route = json.routes[0];

        return {
            start: routeRequest[0].name,
            end: routeRequest[routeRequest.length - 1].name,
            via: route.legs[0].summary,
            duration: route.duration,
            congestion: this.getCongestionFromRoute(route),
            geometry: route.geometry,
            updated: moment()
        }
    }

    /**
     * Converts a "<lat>,<lon>" string to a "<lon>,<lat>" one and trims any whitespace in each component.
     * Mapbox needs coordinates to be in a lon,lat format but it's non-standard so it's easier to use "<lat>,<lon>"
     * in the config and we convert it here. This also helps us if we want to move away from mapbox.
     * @param latlon Coordinates as "<lat>,<lon>"
     */
    private latLonToLonLat(latlon: string): string {
        const components = latlon.split(',');
        if (components.length !== 2) {
            throw new Error(`Expected latlon string to be "<lat>,<lon>" but found ${components.length} components.`);
        }
        return `${components[1].trim()},${components[0].trim()}`;
    }

    private getCongestionFromRoute(route: {legs: {annotation:{congestion:string[]}}[]}): Congestion {
        let congestion: string[] = [];
        for (const leg of route.legs) {
            congestion = [
                ...congestion,
                ...leg.annotation.congestion
            ];
        }
        return this.reduceCongestionArray(congestion)
    }

    private buildBody(waypoints: string): URLSearchParams {
        const body = new URLSearchParams();
        body.append('coordinates', waypoints);
        body.append('annotations', 'congestion,duration');
        body.append('overview', 'full');
        body.append('geometries', 'geojson');
        body.append('steps', 'true');
        return body;
    }

    private reduceCongestionArray(congestion: string[]): Congestion {
        let count = 0;
        let score = 0;

        for (const level of congestion) {
            switch(level.toLowerCase()) {
                case 'unknown':
                    continue; // don't count unknowns.
                case 'low': 
                    break; // don't increment score.
                case 'moderate': 
                    score += 1;
                    break;
                case 'heavy':
                    score += 2;
                    break;
                case 'severe':
                    score += 3;
                    break;
                default:
                    logger.warn(`Found unexpected congestion level: ${level}. Ignoring.`);
                    continue;
            }
            count++;
        }

        if (count < congestion.length / 2) {
            logger.warn(`Less than half the congestion array was used (${count} of ${congestion.length}). This may be inaccurate.`)
        }

        const average = Math.round(score/count);

        switch(average) {
            case 0: return 'low';
            case 1: return 'moderate';
            case 2: return 'heavy';
            case 3: return 'severe';
            default:
                logger.warn(`Error calculating congestion. Got score ${average} but was expecting an int between 0 - 3`);
                return 'unknown';
        }
    }
}

export const mapBoxApiClient = new MapBoxApiClient();