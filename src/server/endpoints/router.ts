import * as Router from "koa-router";
import * as send from 'koa-send';

import { config } from '../util/ConfigUtil';

import { OpenWeatherMapDataProvider } from "../data-provider/openweathermap";
import { MapBoxDataProvider } from '../data-provider/mapbox';
import { AlertDataProvider } from "../data-provider/alertdataprovider";
import { NightModeDataProvider } from "../data-provider/nightmodedataprovider";
import { RouteTraffic } from "../data-provider/models/routetraffic";
import { CurrentWeather } from "../data-provider/models/currentweather";
import { Alert } from "../data-provider/models/alert";
import { envUtil, ENV_VARS } from "../util/EnvUtil";

const router = new Router();

const openWeatherMapDataProvider = new OpenWeatherMapDataProvider(config.weather);
const mapBoxDataProvider = new MapBoxDataProvider(config.traffic);
const alertDataProvider = new AlertDataProvider(config.alerts);
const nightModeDataProvider = new NightModeDataProvider(config.night);

router.get('/', async (ctx) => {
    await send(ctx, '/views/client.html');
});

router.get('/config', (ctx) => {
    ctx.body = {
        mapboxApiToken: envUtil.getStringValue(ENV_VARS.MapBoxApiKey),
    };
})

router.get('/internal/config', (ctx) => {
    ctx.body = config;
});

router.get('/poll', async (ctx) => {
    const night = nightModeDataProvider.getNightModeState();
    let traffic : RouteTraffic[];
    let weather : {primary: CurrentWeather, alternate: CurrentWeather[]};
    let alerts : Alert[];

    // Night mode hides everything, so we don't want to make api calls if we don't need to.
    if(!night) {
        traffic = await mapBoxDataProvider.getCurrentTraffic();
        weather = await openWeatherMapDataProvider.getCurrentWeather();
        alerts = alertDataProvider.getCurrentAlerts();
    }
    
    ctx.body = {
        nightMode: night,
        traffic: traffic,
        weather: weather,
        alerts: alerts,
    };
})

router.get('/weather/byid/:id', async (ctx) => {
    ctx.body = await openWeatherMapDataProvider.getFromApiOrCache(ctx.params.id);
});

router.get('/weather/current', async(ctx) => {
    const weather = openWeatherMapDataProvider.getCurrentWeather();

    if (!weather) {
        ctx.status = 204; // No Content
        return;
    }

    ctx.body = weather;
});

router.get('/traffic/current', async (ctx) => {
    const traffic = await mapBoxDataProvider.getCurrentTraffic();

    if (!traffic) {
        ctx.status = 204; // No Content
        return;
    }

    ctx.body = traffic;
});

export const rootRouter = router;