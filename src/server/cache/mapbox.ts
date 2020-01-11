import {v4 as uuid} from 'uuid';

import { AppConfigTrafficRoute, AppConfigTrafficRoutePoint } from "../models/appconfig";
import { RouteTraffic } from "../api-client/models/routetraffic";
import { minutesSince } from './util';
import { mapBoxApiClient } from '../api-client/mapbox';
import { logger } from '../util/LogUtil';

class MapBoxCache {

    private readonly data: {[id: string]: RouteTraffic[]} = {};

    public async getTrafficForRoutes(routes: AppConfigTrafficRoute): Promise<RouteTraffic[]> {
        let routeId = (routes as any).id;

        if(!routeId) {
            routeId = uuid();
            (routes as any).id = routeId;
            logger.info(`Assigned new ID ${routeId} to route.`);
        }

        logger.info(`Getting data for route: ${routeId}`);

        if(!this.data[routeId] || minutesSince(this.data[routeId][0].updated) >= 10) {
            const routeArrays = this.buildRouteArrays(routes);

            this.data[routeId] = await Promise.all(routeArrays.map((route) => mapBoxApiClient.getTrafficForRoute(route)));
        }

        return this.data[routeId];
    }

    private buildRouteArrays(routes: AppConfigTrafficRoute): AppConfigTrafficRoutePoint[][] {
        // If we don't have any 'via' points, just return a single route with just the start and end points.
        if (!routes.via) {
            return [
                [routes.start, routes.end]
            ];
        }
        
        const builtRoutes: AppConfigTrafficRoutePoint[][] = [];

        for (const path of routes.via) {
            builtRoutes.push([
                routes.start,
                ...path,
                routes.end
            ]);
        }

        return builtRoutes;
    }
}

export const mapBoxCache = new MapBoxCache();