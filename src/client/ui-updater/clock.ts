import { leftPad } from "./util";

const CLOCK_SELECTOR = '#time';
const DATE_SELECTOR = '#date';

export class ClockUpdater {

    private readonly clockElem: HTMLElement;
    private readonly dateElem: HTMLElement;

    public constructor() {
        this.clockElem = document.querySelector(CLOCK_SELECTOR);
        this.dateElem = document.querySelector(DATE_SELECTOR);
    }

    public displayTime(time: Date) {
        this.clockElem.textContent = this.getTimeString(time);
        this.dateElem.textContent = this.getDateString(time);
    }

    private getTimeString(time: Date) {
        const hours = time.getHours();
        const mins = time.getMinutes();

        return `${leftPad(hours, '0', 2)}:${leftPad(mins, '0', 2)}`;
    }

    private getDateString(date: Date) {
        return date.toLocaleDateString('en-UK', {day:'numeric', weekday: 'short', month: 'long'})
    }
}

export const clockUpdater = new ClockUpdater();