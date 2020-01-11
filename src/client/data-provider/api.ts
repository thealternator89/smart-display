import { WeatherUpdater } from "../ui-updater/weather";
import { TrafficUpdater } from "../ui-updater/traffic";

const UPDATE_INTERVAL = 60*1000; // 1 Minute

class ApiDataProvider {

    private weatherUpdater?: WeatherUpdater;
    private trafficUpdater?: TrafficUpdater;

    public registerWeatherDataProvider(weatherUpdater: WeatherUpdater) {
        this.weatherUpdater = weatherUpdater;
    }

    public registerTrafficDataProvider(trafficUpdater: TrafficUpdater) {
        this.trafficUpdater = trafficUpdater;
    }

    public start() {
        const apiAccessFunc = async () => {
            const response = await fetch('/poll');
            const json = await response.json();

            if (this.weatherUpdater) {
                this.weatherUpdater.displayWeather(json.weather);
            }

            if (this.trafficUpdater) {
                this.trafficUpdater.displayTraffic(json.traffic);
            }
        }

        apiAccessFunc();

        setInterval(apiAccessFunc, UPDATE_INTERVAL);
    }
}

export const apiDataProvider = new ApiDataProvider();