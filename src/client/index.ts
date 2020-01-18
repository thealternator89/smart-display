import { clockUpdater } from './ui-updater/clock';
import { trafficUpdater } from './ui-updater/traffic';
import { weatherUpdater } from './ui-updater/weather';

import { apiDataProvider } from './data-provider/api';
import { deviceDataProvider } from './data-provider/device';
import { alertsUpdater } from './ui-updater/alerts';

deviceDataProvider.registerTimeDataProvider(clockUpdater);

apiDataProvider.registerTrafficDataProvider(trafficUpdater);
apiDataProvider.registerWeatherDataProvider(weatherUpdater);
apiDataProvider.registerAlertsDataProvider(alertsUpdater);

apiDataProvider.start();