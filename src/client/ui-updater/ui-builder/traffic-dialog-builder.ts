import * as mapboxgl from 'mapbox-gl'

import { buildDiv } from "../util";
import { Traffic } from "../../models/traffic";
import { config } from '../../config';

const MAP_CONTAINER_ID = 'route_dialog_content';

const defaultMapOptions = {
    container: MAP_CONTAINER_ID,
    style: 'mapbox://styles/mapbox/streets-v11',
    zoom: 10.5,
    interactive: false
}

export class TrafficDialogBuilder {
    private readonly bodyElem: HTMLBodyElement;
    private readonly curtainElem: HTMLElement;

    public constructor() {
        this.bodyElem = document.getElementsByTagName('body')[0];
        this.curtainElem = document.querySelector('#curtain');
    }

    public async initialize(): Promise<void> {
        // Cast to any as the types say its readonly.
        (mapboxgl as any).accessToken = await config.getMapboxApiKey();
    }

    public async buildRouteDialog(traffic: Traffic): Promise<void> {
        const div = buildDiv({id: 'route_dialog'});
        const closeButton = buildDiv({id: 'route_dialog_close_button'});
        const closeTimer = buildDiv({id: 'route_dialog_closing_timer'});

        let dialogCountdownSeconds = 30;
        closeTimer.innerText = `${dialogCountdownSeconds}`;

        div.appendChild(closeButton);
        div.appendChild(buildDiv({id: MAP_CONTAINER_ID}));

        this.bodyElem.appendChild(div);
        this.bodyElem.appendChild(closeTimer);

        this.curtainElem.classList.remove('hidden');

        let timeoutEventHandler: NodeJS.Timeout;

        const closeFunc = () => {
            this.bodyElem.removeChild(div);
            this.bodyElem.removeChild(closeTimer);
            this.curtainElem.classList.add('hidden');
            if (timeoutEventHandler) {
                clearTimeout(timeoutEventHandler);
            }
        }

        closeButton.onclick = closeFunc;

        await this.initialize()

        timeoutEventHandler = setInterval(() => {
            dialogCountdownSeconds--;

            if(dialogCountdownSeconds < 0) {
                closeFunc();
            }

            closeTimer.innerText = `${dialogCountdownSeconds}`;
        }, 1000);

        this.buildMap(traffic);
    }

    public buildMap(traffic: Traffic): void {
        const map = new mapboxgl.Map({
            center: this.getAverageCoords(traffic.geometry.coordinates),
            ...defaultMapOptions
        });

        map.on('load', () => {
            map.addLayer({
                id: 'route',
                type: 'line',
                source: {
                    type: 'geojson',
                    data: {
                        type: 'Feature',
                        properties: {},
                        geometry: traffic.geometry
                    }
                },
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round',
                },
                paint: {
                    'line-color': '#0CF',
                    'line-width': 6
                }
            })
        })
    }

    private getAverageCoords(coords: [number, number][]): [number, number] {
        // I know this will confuse me, so here are consts.
        const ARRAY_POS_LAT = 1;
        const ARRAY_POS_LON = 0;


        let minLat;
        let minLon;
        let maxLat;
        let maxLon;

        for (const coord of coords) {
            const currentLat = coord[ARRAY_POS_LAT];
            const currentLon = coord[ARRAY_POS_LON];

            if (minLat === undefined || currentLat < minLat) {
                minLat = currentLat;
            }

            if (minLon === undefined || currentLon < minLon) {
                minLon = currentLon;
            }

            if (maxLat === undefined || currentLat > maxLat) {
                maxLat = currentLat;
            }

            if (maxLon === undefined || currentLon > maxLon) {
                maxLon = currentLon;
            }
        }

        return [
            (minLon + maxLon) / 2,
            (minLat + maxLat) / 2
        ]
    }
}