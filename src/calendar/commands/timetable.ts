import { CommandInteraction, EmbedFieldData, MessageEmbed } from "discord.js";
import { Discord, Slash, SlashGroup, SlashOption } from "discordx";
import { VEvent } from "node-ical";
import { CalendarUi } from "../ui/calendar-ui.js";
import { getCalendar } from "../calendar.js";
import { MAX_FIELD_CHAR } from "../../global-variables.js";
import { parseDate } from "../../utils/date-utils.js";
import { organiseEmbedFieldToPages } from "../../utils/embed-utils.js";
import { groupBy } from "../../utils/list-utils.js";
import { reduceIfToLong } from "../../utils/message-utils.js";
import { properties } from "../../properties.js";

@Discord()
@SlashGroup({name: "timetable", description: "Foo" })
@SlashGroup({name: "event", root: "timetable" })
export class TimeTable {
    
    @Slash()
    @SlashGroup('timetable')
    async day(@SlashOption("day") text: string, interaction: CommandInteraction) {
        const start = parseDate(text)
        start.setUTCHours(0, 0, 0, 0)
        const end = new Date(start.getTime());
        end.setUTCHours(23, 59, 59, 999)
        const events = getCalendar("ISTIC")?.getEvents(start, end)
            .sort((ev1, ev2) => ev1.start.getTime() - ev2.start.getTime())
        
        if(events !== undefined) {
            const result = groupBy(events.map(this.formatEvent), e => e.day)
                        .map(ed => this.buildEmbed(ed[0], ed[1]))
            // interaction.reply({embeds: result })
            const ui = new CalendarUi(result[0])
            await ui.buildUi(interaction)
        } else
            interaction.reply("Aucune correspondance trouvée")
    }

    @Slash()
    @SlashGroup("event", "timetable")
    async next(interaction: CommandInteraction) {
        const now = new Date(Date.now())
        now.setSeconds(0)
        now.setMilliseconds(0)
        const event = getCalendar("ISTIC")?.getNextEvent(now)

        if(event !== undefined) {
            const formattedEvent = this.formatEvent(event)
            const embed = this.buildEmbed(formattedEvent.data, [{hours: formattedEvent.hours, data: formattedEvent.data}])

            await interaction.reply({embeds: embed})
        } else
            await interaction.reply("Aucun évènement trouvé")
    }

    private buildEmbed(day: string, events: {hours: string, data: string}[]): MessageEmbed[] {
        const fields = events.map(event =>  this.toEmbedField(event.hours, event.data))
        return organiseEmbedFieldToPages(fields, new MessageEmbed().setTitle(day).setColor("#f28028"))
    }

    private toEmbedField(hours: string, data: string): EmbedFieldData {
        return { name: hours, value: reduceIfToLong(data, MAX_FIELD_CHAR) }
    }

    private formatEvent(event: VEvent): {day: string, hours: string, data: string} {
        var options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: '2-digit' }
        var hourOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' }
        return {
            day: event.start.toLocaleDateString(properties.locale, options),
            hours: event.start.toLocaleTimeString(properties.locale, hourOptions) + ' - ' + event.end.toLocaleTimeString(properties.locale, hourOptions),
            data: `__**Évènement :**__ ${event.summary}
            __**Lieu :**__ ${event.location}
            __**Description :**__ ${event.description.trim().replaceAll('\n', ' ')}`.replace(/\n\s+/g, '\n')
        }
    }

}