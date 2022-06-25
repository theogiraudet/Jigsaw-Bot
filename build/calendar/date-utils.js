import * as chrono from 'chrono-node';
export function parseDate(sentence) {
    return chrono.fr.parseDate(sentence, new Date(Date.now()));
}
