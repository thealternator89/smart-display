import { WeatherData, Weather, WeatherCondition } from '../models/weather';
import { buildDiv, buildImg, buildSpan, getTimeString } from './util';

const ROOT_SELECTOR = "#weather";
const MAIN_BG_SELECTOR = "#bg";

export class WeatherUpdater {

    private readonly elem: HTMLElement;

    public constructor() {
        this.elem = document.querySelector(ROOT_SELECTOR);
    }

    public displayWeather(weather?: WeatherData) {
        this.teardown();

        if (!weather || !weather.primary) {
            this.hide();
            return;
        }

        this.elem.appendChild(this.buildMainWeatherElement(weather.primary));

        if (weather.alternate && weather.alternate.length > 0) {
            const additionalWeather = buildDiv({id: "additional_weather_list"});
            this.elem.appendChild(document.createElement('hr'));
            for(const alt of weather.alternate) {
                additionalWeather.appendChild(this.buildAdditionalWeatherElement(alt));
            }
            this.elem.appendChild(additionalWeather);
        }

        const updatedDate = new Date(weather.primary.updated);

        this.elem.appendChild(buildDiv({id: 'weather_updated', content: getTimeString(updatedDate)}));

        // ensure the weather is now shown;
        this.show();

        this.setBackground(weather.primary.condition);
    }

    public dispose() {
        this.teardown();
        this.hide();
        this.setBackground('none');
    }


    private buildMainWeatherElement(weather: Weather): HTMLElement {
        const div = buildDiv({id: 'main_weather'});
        div.appendChild(buildDiv({id: 'location', content: weather.name}));
        div.appendChild(buildImg({id: 'main_icon', src: weather.iconUrl, width: 100, height: 100}));
        div.appendChild(buildDiv({id: 'main_temp', content: `${Math.floor(weather.temp.current)}°C`}));
        div.appendChild(buildDiv({id: 'main_min_temp', className: 'main_minmax_temp', content: `${Math.floor(weather.temp.min)}°C`}));
        div.appendChild(buildDiv({id: 'main_max_temp', className: 'main_minmax_temp', content: `${Math.ceil(weather.temp.max)}°C`}));
        div.appendChild(buildDiv({id: 'main_condition', content: weather.description}));
        return div;
    }

    private buildAdditionalWeatherElement(weather: Weather): HTMLElement {
        const div = buildDiv({className: 'additional_weather'});

        div.appendChild(buildImg({className: 'additional_img', src: weather.iconUrl, width: 40, height: 40}));
        div.appendChild(buildSpan({className: 'additional_loc', content: weather.name}));
        div.appendChild(buildSpan({className: 'additional_temp', content: `${Math.floor(weather.temp.current)}°C`}));
        div.appendChild(buildSpan({className: 'additional_high', content: `${Math.ceil(weather.temp.max)}°C`}));
        div.appendChild(buildSpan({className: 'additional_low', content: `${Math.floor(weather.temp.min)}°C`}));

        return div;
    }

    private setBackground(condition: WeatherCondition) {
        document.querySelector(MAIN_BG_SELECTOR).className = condition;
    }

    private teardown(): void {
        this.elem.innerHTML = '';
    }

    private hide(): void {
        this.elem.classList.add('hidden');
    }

    private show(): void {
        this.elem.classList.remove('hidden');
    }
}

export const weatherUpdater = new WeatherUpdater();