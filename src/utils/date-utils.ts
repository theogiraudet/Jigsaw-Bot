import * as chrono from 'chrono-node';

export function parseDate(sentence: string): Date {
    return chrono.fr.parseDate(sentence, new Date(Date.now()))
}