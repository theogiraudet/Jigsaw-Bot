class Calendar {
    calendar;
    name;
    today;
    constructor(name, calendar) {
        this.calendar = calendar;
        this.name = name;
        this.updateDate();
    }
    updateDate() {
        const ts = Date.now();
        const date = new Date(ts);
        date.setUTCHours(0, 0, 0, 0);
        const index = this.calendar.findIndex(event => event.start < date);
        this.today = [index > 0 ? index - 1 : this.calendar.length - 1, date];
    }
    getEvents(startDate, endDate) {
        const step = startDate < this.today[1] ? -1 : 1;
        const events = [];
        for (let i = this.today[0]; i > 0 && i < this.calendar.length; i += step) {
            const event = this.calendar[i];
            if (event.start >= startDate && event.start < endDate)
                events.push(event);
        }
        return events;
    }
    getNextEvent(date) {
        if (date < this.today[1])
            return undefined;
        let i = 0;
        while (i < this.calendar.length && this.calendar[i].start < date)
            i++;
        return this.calendar[i];
    }
    get getName() {
        return this.name;
    }
}
const calendars = new Map();
export function createCalendar(name, icalCalendar) {
    const tempCalendar = [];
    for (let k in icalCalendar) {
        if (icalCalendar.hasOwnProperty(k)) {
            const ev = icalCalendar[k];
            if (icalCalendar[k].type === 'VEVENT')
                tempCalendar.push(ev);
        }
    }
    tempCalendar.sort((ev1, ev2) => ev1.start.getTime() - ev2.start.getTime());
    const calendar = new Calendar(name, tempCalendar);
    calendars.set(name, calendar);
    return calendar;
}
export function getCalendar(name) {
    return calendars.get(name);
}
//# sourceMappingURL=calendar.js.map