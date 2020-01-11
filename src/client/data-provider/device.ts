import { ClockUpdater } from "../ui-updater/clock";

const MINUTE_AS_MS = 60000;

class DeviceDataProvider {

    public registerTimeDataProvider(clockUpdater: ClockUpdater): void {
        let currentTime;

        let testFunc = () => {
            let newDate = new Date();
            let newTime = newDate.getTime();
            if (Math.floor(currentTime / MINUTE_AS_MS) !== Math.floor(newTime / MINUTE_AS_MS)) {
                clockUpdater.displayTime(newDate);
            }
            currentTime = newTime;
        }

        testFunc();

        setInterval(testFunc, 500);
    }
}

export const deviceDataProvider = new DeviceDataProvider();