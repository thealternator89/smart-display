export const ENV_VARS = {
    MapBoxApiKey: 'MAPBOX_API_KEY',
    OpenWeatherMapApiKey: 'OPEN_WEATHER_MAP_API_KEY',
    ServerPort: 'PORT'
}

class EnvUtil {
    public getStringValue(varName: string, defaultValue?: string) {
        return process.env[varName] || defaultValue;
    }

    public getIntValue(varName: string, defaultValue?: number) {
        return parseInt(process.env[varName]) || defaultValue;
    }
}

export const envUtil = new EnvUtil();
