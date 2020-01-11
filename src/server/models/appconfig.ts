export interface AppConfig {
    traffic: AppConfigTraffic[]
    weather: AppConfigWeather[];
}

export interface AppConfigWeather extends AppConfigScheduledItem {
    primary: AppConfigWeatherLocation;
    alternate?: AppConfigWeatherLocation[];
}

export interface AppConfigWeatherLocation {
    name: string; // Unused; mainly just a comment so locations can be identified in the config
    id: number;
}

export interface AppConfigTraffic extends AppConfigScheduledItem {
    routes: AppConfigTrafficRoute[];
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

export interface AppConfigScheduledItem {
    active: AppConfigSchedule;
}

export interface AppConfigSchedule {
    days?: string; //comma separated list of days. defaults to "sun,mon,tue,wed,thur,fri,sat".
    timeStart?: string; //time in format "HH:mm". defaults to "00:00"
    timeEnd?: string; //time in format "HH:mm". defaults to "23:59"
}