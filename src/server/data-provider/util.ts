import * as moment from 'moment';
import { AppConfigScheduledItem } from '../models/appconfig';

export const DAY_FORMAT = 'ddd';
export const TIME_FORMAT = 'HH:mm';

export const DEFAULT_START = '00:00';
export const DEFAULT_END = '23:59';

const DEFAULT_DAYS = 'sun,mon,tue,wed,thu,fri,sat'

export const minutesSince = (time: moment.Moment) => 
    Math.abs(moment.duration(time.diff(moment())).asMinutes());

export const isInTimeWindow = (item: AppConfigScheduledItem) => {
    const timeStart = moment(item.active.timeStart || DEFAULT_START, TIME_FORMAT);
    const timeEnd = moment(item.active.timeEnd || DEFAULT_END, TIME_FORMAT);
    const days = (item.active.days || DEFAULT_DAYS).toLowerCase().split(',');

    const now = moment();
    const currentDay = now.format(DAY_FORMAT).toLowerCase();
    const currentTime = moment(now.format(TIME_FORMAT), TIME_FORMAT);

    return days.includes(currentDay) && 
        (currentTime.isAfter(timeStart) || currentTime.isSame(timeStart)) &&
        (currentTime.isBefore(timeEnd) || currentTime.isSame(timeEnd));
}