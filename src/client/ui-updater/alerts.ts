import { AlertData } from "../models/alert";
import { buildDiv } from "./util";

const ROOT_SELECTOR = "#alerts";

export class AlertsUpdater {

    private readonly elem: HTMLElement;

    public constructor() {
        this.elem = document.querySelector(ROOT_SELECTOR);
    }

    public displayAlerts(alerts: AlertData[]) {
        this.teardown();

        if (!alerts || alerts.length === 0) {
            this.hide();
            return;
        }

        for(let i = 0; i < Math.min(alerts.length, 4); i++ ) {
            const alertDiv = this.buildAlertElem(alerts[i], i);
            this.elem.appendChild(alertDiv);
        }

        this.show();
    }

    public dispose() {
        this.teardown();
        this.hide();
    }

    private buildAlertElem(data: AlertData, position: number) {
        if (position < 0 || position > 3) {
            throw new Error(`Invalid value for alert position. Expected 0 - 4, but got ${position}`);
        }

        const pos = position + 1;

        const base = buildDiv({className: 'alert_pane', id:`alert_${pos}`});

        const badge = buildDiv({className: `alert_badge alert_badge_${data.color}`});

        const label = buildDiv({className: 'alert_text', content: data.text});

        base.appendChild(badge);
        base.appendChild(label);

        return base;        
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

export const alertsUpdater = new AlertsUpdater();