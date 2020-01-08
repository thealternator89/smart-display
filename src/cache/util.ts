import * as moment from 'moment';

export const minutesSince = (time: moment.Moment) => 
Math.abs(moment.duration(time.diff(moment())).asMinutes());