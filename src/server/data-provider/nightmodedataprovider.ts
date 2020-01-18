import { AppConfigNightTime } from "../models/appconfig";
import moment = require("moment");
import { isInTimeWindow, DEFAULT_START, DEFAULT_END, TIME_FORMAT } from "./util";

export class NightModeDataProvider {
    private readonly config: AppConfigNightTime;

    public constructor (config: AppConfigNightTime) {
        this.config = config;
    }

    public getNightModeState(): boolean {
        if (!this.config || !this.config.enabled) {
            return false;
        }

        return this.isInTimeWindow();
    }

    private isInTimeWindow() {
        const timeStart = moment(this.config.timeStart || DEFAULT_START, TIME_FORMAT);
        const timeEnd = moment(this.config.timeEnd || DEFAULT_END, TIME_FORMAT);

        const endOfDay = moment('23:59', TIME_FORMAT);
        const startOfDay = moment('00:00', TIME_FORMAT);

        const currentTime = moment(moment().format(TIME_FORMAT), TIME_FORMAT);

        return ((currentTime.isSameOrAfter(timeStart) && currentTime.isSameOrBefore(endOfDay)) ||
            (currentTime.isSameOrBefore(timeEnd) && currentTime.isSameOrAfter(startOfDay)))
    }
}