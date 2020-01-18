export interface AppConfig {
    alerts: AppConfigAlert[];
    night: AppConfigNightTime;
    traffic: AppConfigTraffic[]
    weather: AppConfigWeather[];
}

export interface AppConfigWeather extends AppConfigScheduledItem {
    primary: AppConfigWeatherLocation;
    alternate?: AppConfigWeatherLocation[];
}

export interface AppConfigTraffic extends AppConfigScheduledItem {
    route: AppConfigTrafficRoute;
}

export interface AppConfigAlert extends AppConfigScheduledItem {
    type: 'standard' | 'alternating_week';
    week?: AppConfigAlertAlternatingWeek; // Exists IFF type is 'alternating_week'
    content?: AppConfigAlertContent; // Exists IFF type is 'standard'
}

export interface AppConfigWeatherLocation {
    name: string; // Unused; mainly just a comment so locations can be identified in the config
    id: number;
}

export interface AppConfigTrafficRoute {
    start: AppConfigTrafficRoutePoint;
    end: AppConfigTrafficRoutePoint;
    // force the route to go via certain point(s)
    // If more than one set of points is provided, each set is evaluated and the fastest is displayed
    via?: AppConfigTrafficRoutePoint[][];
}

export interface AppConfigTrafficRoutePoint {
    name: string;
    coords: string; // "lat,lon" coordinates
}

export interface AppConfigTrafficRouteViaPoint extends AppConfigTrafficRoutePoint {
    hide?: boolean; // hide this point's name when displaying route on screen. defaults to false (shown).
    // e.g. "Home to Work via place"
}

export interface AppConfigAlertAlternatingWeek {
    odd: AppConfigAlertContent;
    even: AppConfigAlertContent;
}

export interface AppConfigAlertContent {
    color: string;
    text: string;
}

export interface AppConfigNightTime extends AppConfigDuration {
    enabled: boolean; // defaults to false
}

export interface AppConfigScheduledItem {
    active: AppConfigSchedule;
}

export interface AppConfigSchedule extends AppConfigDuration{
    days?: string; //comma separated list of days. defaults to "sun,mon,tue,wed,thur,fri,sat".
}

export interface AppConfigDuration {
    timeStart?: string; //time in format "HH:mm". defaults to "00:00"
    timeEnd?: string; //time in format "HH:mm". defaults to "23:59"
}