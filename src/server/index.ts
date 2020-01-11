import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as cors from '@koa/cors';
import * as send from 'koa-send';

import * as moment from  'moment';

import { envUtil, ENV_VARS } from './util/EnvUtil';
import { openWeatherMapCache } from './cache/openweathermap';
import { config } from './util/ConfigUtil';
import { logger } from './util/LogUtil';
import { mapBoxCache } from './cache/mapbox';
import { AppConfigScheduledItem } from './models/appconfig';
import { RouteTraffic } from './api-client/models/routetraffic';

const DAY_FORMAT = 'ddd';
const TIME_FORMAT = 'HH:mm';

const PORT = envUtil.getIntValue(ENV_VARS.ServerPort, 8080);

const app = new Koa();

const router = new Router();

const getWeather = async () => {
    const weatherItem = config.weather.find(isInTimeWindow);

    if (!weatherItem) {
        return;
    }

    const primary = await openWeatherMapCache.getFromApiOrCache(weatherItem.primary.id);
    let alt;

    if (weatherItem.alternate) {
        alt = await Promise.all(weatherItem.alternate.map((item) => openWeatherMapCache.getFromApiOrCache(item.id)));
    }

    return {
        primary: primary,
        alternate: alt,
    };
}

const getTraffic = async () => {
    const trafficRoutes = config.traffic.find(isInTimeWindow);

    if (!trafficRoutes) {
        return;
    }

    const results: RouteTraffic[][] = await Promise.all(trafficRoutes.routes.map((route) => mapBoxCache.getTrafficForRoutes(route)));

    return results.map((route) => route.sort((o1, o2) => o1.duration - o2.duration)[0]);
}

router.get('/', async (ctx) => {
    await send(ctx, '/views/client.html');
})

router.get('/config', (ctx) => {
    ctx.body = config;
});

router.get('/poll', async (ctx) => {
    const traffic = await getTraffic();
    const weather = await getWeather();

    ctx.body = {
        nightMode: false,
        traffic: traffic,
        weather: weather
    };
})

router.get('/weather/byid/:id', async (ctx) => {
    ctx.body = await openWeatherMapCache.getFromApiOrCache(ctx.params.id);
});

router.get('/weather/current', async(ctx) => {
    const weather = getWeather();

    if (!weather) {
        ctx.status = 204; // No Content
        return;
    }

    ctx.body = weather;
});

router.get('/traffic/current', async (ctx) => {
    const traffic = await getTraffic();

    if (!traffic) {
        ctx.status = 204; // No Content
        return;
    }

    ctx.body = traffic;
});

// Log all requests.
app.use(async (ctx, next) => {
    logger.info(`${ctx.ip} - ${ctx.method} ${ctx.path}`);
    await next();
});

app.use(cors());

app.use(router.routes());
app.use(router.allowedMethods());

app.use(async (ctx) => {
    await send(ctx, ctx.path, { root: __dirname + '/../static'});
});

app.listen(PORT);

logger.info(`server is listening on ${PORT}`);

const isInTimeWindow = (item: AppConfigScheduledItem) => {
    const timeStart = moment(item.active.timeStart || '00:00', TIME_FORMAT);
    const timeEnd = moment(item.active.timeEnd || '23:59', TIME_FORMAT);
    const days = (item.active.days || 'sun,mon,tue,wed,thu,fri,sat').toLowerCase().split(',');

    const now = moment();
    const currentDay = now.format(DAY_FORMAT).toLowerCase();
    const currentTime = moment(now.format(TIME_FORMAT), TIME_FORMAT);

    return days.includes(currentDay) && 
        (currentTime.isAfter(timeStart) || currentTime.isSame(timeStart)) &&
        (currentTime.isBefore(timeEnd) || currentTime.isSame(timeEnd));
}