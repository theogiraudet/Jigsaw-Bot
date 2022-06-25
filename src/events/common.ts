import type { ArgsOf, Client } from "discordx";
import { Discord, On } from "discordx";
import ical from 'node-ical';
import { createCalendar } from "../calendar/calendar.js";
import { eventEmitter } from "../emitter.js";

@Discord()
export class Example {
  @On("messageDelete")
  onMessage([message]: ArgsOf<"messageDelete">, client: Client): void {
    console.log("Message Deleted", client.user?.username, message.content);
  }

  @On("ready")
  onReady(): void {
    console.log('Parse calendar')
    ical.async.fromURL('https://planning.univ-rennes1.fr/jsp/custom/modules/plannings/PnR1EOY8.shu')
      .then(data => createCalendar("ISTIC", data))

      }
  }
