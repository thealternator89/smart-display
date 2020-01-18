import * as Koa from 'koa';
import * as cors from '@koa/cors';
import * as send from 'koa-send';

import * as moment from  'moment';

import { envUtil, ENV_VARS } from './util/EnvUtil';
import { logger } from './util/LogUtil';
import { rootRouter } from './endpoints/router';

const PORT = envUtil.getIntValue(ENV_VARS.ServerPort, 8080);

const app = new Koa();

const router = rootRouter;

// Log all requests.
app.use(async (ctx, next) => {
    logger.info(`${moment().utc().format()}: ${ctx.ip} - ${ctx.method} ${ctx.path}`);
    await next();
});

app.use(cors());

app.use(router.routes());
app.use(router.allowedMethods());

app.use(async (ctx) => {
    await send(ctx, ctx.path, { root: './static'});
});

app.listen(PORT);
logger.info(`server is listening on ${PORT}`);