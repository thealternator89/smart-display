import {v4 as uuid} from 'uuid';

import { AppConfigTrafficRoute, AppConfigTrafficRoutePoint, AppConfigTraffic } from "../models/appconfig";
import { RouteTraffic } from "./models/routetraffic";
import { minutesSince, isInTimeWindow } from './util';
import { mapBoxApiClient } from './api-client/mapbox';
import { logger } from '../util/LogUtil';

export class MapBoxDataProvider {

    private readonly data: {[id: string]: RouteTraffic[]} = {};
    private readonly config: AppConfigTraffic[];

    public constructor(config: AppConfigTraffic[]) {
        this.config = config;
    }

    public async getCurrentTraffic(): Promise<RouteTraffic[] | undefined> {

        const trafficRoutes = this.config.filter(isInTimeWindow);

        if (!trafficRoutes || trafficRoutes.length === 0) {
            return undefined;
        }

        const results: RouteTraffic[][] = await Promise.all(trafficRoutes.map((route) => this.getTrafficForRoutes(route.route)));

        return results.map((route) => route.sort((o1, o2) => o1.duration - o2.duration)[0]);
    }

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