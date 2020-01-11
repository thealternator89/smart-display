import { clockUpdater } from './ui-updater/clock';
import { trafficUpdater } from './ui-updater/traffic';
import { weatherUpdater } from './ui-updater/weather';

import { apiDataProvider } from './data-provider/api';
import { deviceDataProvider } from './data-provider/device';

const setNightMode = () => {
    document.getElementById('weather').classList.add('hidden');
    document.getElementById('traffic').classList.add('hidden');

    document.getElementById('bg').className = ''
}

deviceDataProvider.registerTimeDataProvider(clockUpdater);

apiDataProvider.registerTrafficDataProvider(trafficUpdater);
apiDataProvider.registerWeatherDataProvider(weatherUpdater);

apiDataProvider.start();