import { AppConfigAlert } from "../models/appconfig";
import { isInTimeWindow } from "./util";
import { Alert } from "./models/alert";
import moment = require("moment");

export class AlertDataProvider {

    private readonly config: AppConfigAlert[];

    public constructor(config: AppConfigAlert[]) {
        this.config = config;
    }

    public getCurrentAlerts() : Alert[] | undefined {
        const activeAlerts = this.config.filter(isInTimeWindow);

        if (!activeAlerts || activeAlerts.length === 0) {
            return undefined;
        }
        
        return activeAlerts.map((alert) => {
            if (alert.type === 'standard') {
                return alert.content;
            } else {
                const oddOrEven = this.isWeekEven() ? 'even' : 'odd';
                return alert.week[oddOrEven];
            }
        });
    }

    private isWeekEven() {
        return !(moment().week() % 2);
    }

}