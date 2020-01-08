import * as Koa from 'koa';
import * as Router from 'koa-router';
import { envUtil, ENV_VARS } from './util/EnvUtil';
import { openWeatherMapCache } from './cache/openweathermap';
import { config } from './util/ConfigUtil';
import moment = require('moment');
import { logger } from './util/LogUtil';
import { mapBoxCache } from './cache/mapbox';
import { AppConfigScheduledItem } from './models/appconfig';

const DAY_FORMAT = 'ddd';
const TIME_FORMAT = 'HH:mm';

const PORT = envUtil.getIntValue(ENV_VARS.ServerPort, 8080);

const app = new Koa();

const router = new Router();

router.get('/config', (ctx) => {
    ctx.body = config;
})

router.get('/weather/byid/:id', async (ctx) => {
    ctx.body = await openWeatherMapCache.getFromApiOrCache(ctx.params.id);
});

router.get('/weather/current', async(ctx) => {
    const weatherItem = config.weather.find(isInTimeWindow);

    if (!weatherItem) {
        ctx.status = 204; //No Content;
        return;
    }

    const primary = await openWeatherMapCache.getFromApiOrCache(weatherItem.primary.id);
    let alt;

    if (weatherItem.alternate) {
        alt = await Promise.all(weatherItem.alternate.map((item) => openWeatherMapCache.getFromApiOrCache(item.id)));
    }

    ctx.body = {
        primary: primary,
        alternate: alt,
    };
});

router.get('/traffic/current', async (ctx) => {
    const trafficRoutes = config.traffic.find(isInTimeWindow);

    if (!trafficRoutes) {
        ctx.status = 204; // No Content
        return;
    }

    const results = await Promise.all(trafficRoutes.routes.map((route) => mapBoxCache.getTrafficForRoutes(route)));

    const bestRoutes = results.map((route) => route.sort((o1, o2) => o1.duration - o2.duration)[0]);
    
    ctx.body = bestRoutes;
});

app.use(async (ctx, next) => {
    logger.info(`${ctx.ip} - ${ctx.method} ${ctx.path}`);
    await next();
});

app.use(router.routes());
app.use(router.allowedMethods());

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