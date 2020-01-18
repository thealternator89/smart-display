import { buildDiv, buildImg, buildSpan } from './util';
import { Traffic } from '../models/traffic';

const ROOT_SELECTOR = "#traffic";

export class TrafficUpdater {
    private readonly elem: HTMLElement;

    public constructor() {
        this.elem = document.querySelector(ROOT_SELECTOR);
    }

    public displayTraffic(traffic?: Traffic[]) {
        this.teardown();

        if (!traffic || traffic.length === 0) {
            this.hide();
            return;
        }

        for (let i = 0; i < Math.min(traffic.length, 5); i++) {
            this.elem.appendChild(this.buildTrafficElement(traffic[i], i));
        }

        this.show();
    }

    public dispose() {
        this.teardown();
        this.hide();
    }

    private buildTrafficElement(traffic: Traffic, position: number): HTMLElement {
        if (position < 0 || position > 4) {
            throw new Error(`Invalid value for traffic position. Expected 0 - 4, but got ${position}`);
        }

        const pos = position + 1;

        const div = buildDiv({className: `traffic_pane traffic_${traffic.congestion}`, id: `traffic_${pos}`});

        div.appendChild(buildDiv({className: 'travel_time_dest', content: traffic.end}));
        div.appendChild(buildDiv({className: 'travel_time_min', content: `${Math.ceil(traffic.duration / 60)}`}));
        div.appendChild(buildDiv({className: 'travel_time_unit', content: 'mins'}));

        if (traffic.via) {
            div.appendChild(buildDiv({className: 'travel_time_via', content: traffic.via}));
        } else {
            div.classList.add('no_via');
        }

        return div;
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

export const trafficUpdater = new TrafficUpdater();