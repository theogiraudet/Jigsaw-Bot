import ical, { VEvent } from 'node-ical';
import { DeepPartial, FindOptionsWhere, InsertResult, ObjectID, Repository, SaveOptions } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity.js';
import { UpsertOptions } from 'typeorm/repository/UpsertOptions.js';
import { AppDataSource } from '../../data-source.js';
import { Calendar } from '../calendar.js';
import { CalendarEntity } from './entity/CalendarEntity.js';

class CalendarRepository {

    readonly repository = AppDataSource.getRepository(CalendarEntity)

    async save(name: string, calendarUrl: string): Promise<void> {
        await ical.async.fromURL(calendarUrl);
        await this.repository.save(new CalendarEntity(name, calendarUrl));
        return undefined;
    }

}


CalendarRepository.create()


export async function addCalendar(name: string, calendarUrl: string): Promise<void> {
    const icalCalendar = await ical.async.fromURL(calendarUrl)
    
}

export function getCalendar(name: string): Calendar | undefined {
    const tempCalendar: VEvent[] = []
    for (let k in icalCalendar) {
        if (icalCalendar.hasOwnProperty(k)) {
            const ev = icalCalendar[k];
            if (icalCalendar[k].type === 'VEVENT')
                tempCalendar.push(ev as VEvent)
        }
    }
    tempCalendar.sort((ev1, ev2) => ev1.start.getTime() - ev2.start.getTime())
    return new Calendar(name, tempCalendar)
}

export function getAllCalendars(): string[] {

}

export function getDay() {

}