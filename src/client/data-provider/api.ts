import { WeatherUpdater } from "../ui-updater/weather";
import { TrafficUpdater } from "../ui-updater/traffic";
import { AlertsUpdater } from "../ui-updater/alerts";

const UPDATE_INTERVAL = 60*1000; // 1 Minute

class ApiDataProvider {

    private alertsUpdater?: AlertsUpdater;
    private weatherUpdater?: WeatherUpdater;
    private trafficUpdater?: TrafficUpdater;

    public registerWeatherDataProvider(weatherUpdater: WeatherUpdater) {
        this.weatherUpdater = weatherUpdater;
    }

    public registerTrafficDataProvider(trafficUpdater: TrafficUpdater) {
        this.trafficUpdater = trafficUpdater;
    }

    public registerAlertsDataProvider(alertsUpdater: AlertsUpdater) {
        this.alertsUpdater = alertsUpdater;
    }

    public start() {
        const apiAccessFunc = async () => {
            const response = await fetch('/poll');
            const json = await response.json();

            if (json.nightMode) {
                this.alertsUpdater && this.alertsUpdater.dispose();
                this.trafficUpdater && this.trafficUpdater.dispose();
                this.weatherUpdater && this.weatherUpdater.dispose();
                document.getElementsByTagName('body')[0].classList.add('night');
                return;
            }

            document.getElementsByTagName('body')[0].classList.remove('night');

            this.alertsUpdater && this.alertsUpdater.displayAlerts(json.alerts);
            this.trafficUpdater && this.trafficUpdater.displayTraffic(json.traffic);
            this.weatherUpdater && this.weatherUpdater.displayWeather(json.weather);
        }

        apiAccessFunc();

        setInterval(apiAccessFunc, UPDATE_INTERVAL);
    }
}

export const apiDataProvider = new ApiDataProvider();