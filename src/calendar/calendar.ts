import ical, { VEvent } from "node-ical";

class Calendar {

    private readonly calendar: VEvent[]
    private readonly name: string
    private today!: [number, Date];

    constructor(name: string, calendar: VEvent[]) {
        this.calendar = calendar
        this.name = name
        this.updateDate()
    }

    public updateDate() {
        const ts = Date.now()
        const date = new Date(ts)
        date.setUTCHours(0, 0, 0, 0)
        const index = this.calendar.findIndex(event => event.start < date)
        this.today = [index > 0 ? index - 1 : this.calendar.length - 1, date]
    }

    public getEvents(startDate: Date, endDate: Date): VEvent[] {
        const step = startDate < this.today[1] ? -1 : 1
        const events: VEvent[] = []
        for(let i = this.today[0]; i > 0 && i < this.calendar.length; i += step) {
            const event = this.calendar[i]
            if(event.start >= startDate && event.start < endDate)
                events.push(event)
        }
        return events
    }

    public getNextEvent(date: Date): VEvent | undefined {
        if(date < this.today[1])
            return undefined

        let i = 0
        while(i < this.calendar.length && this.calendar[i].start < date) i++

        return this.calendar[i]
    }

    
    public get getName() : string {
        return this.name
    }
}

const calendars: Map<string, Calendar> = new Map()

export function createCalendar(name: string, icalCalendar: ical.CalendarResponse): Calendar {
    const tempCalendar: VEvent[] = []
    for (let k in icalCalendar) {
        if (icalCalendar.hasOwnProperty(k)) {
            const ev = icalCalendar[k];
            if (icalCalendar[k].type === 'VEVENT')
                tempCalendar.push(ev as VEvent)
        }
    }
    tempCalendar.sort((ev1, ev2) => ev1.start.getTime() - ev2.start.getTime())
    const calendar = new Calendar(name, tempCalendar)
    calendars.set(name, calendar)
    return calendar
}

export function getCalendar(name: string): Calendar | undefined {
    return calendars.get(name)
}