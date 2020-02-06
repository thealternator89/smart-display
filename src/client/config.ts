
const CACHE_TIME = 60 * 60 * 1000; // 1 hr in ms

class Config {

    private config: any;
    private lastUpdate: number;

    public async getMapboxApiKey(): Promise<string> {
        await this.updateConfigIfNeeded();
        return this.config.mapboxApiToken;
    }

    private async updateConfigIfNeeded(): Promise<void> {
        const currentTime = new Date().getTime();

        if (currentTime <= (this.lastUpdate + CACHE_TIME)) {
            return;
        }

        const response = await fetch('/config');
        this.config = await response.json();
        this.lastUpdate = currentTime;
    }
}

export const config = new Config();
