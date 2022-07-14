var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { CommandInteraction, MessageEmbed } from "discord.js";
import { Discord, Slash, SlashGroup, SlashOption } from "discordx";
import { CalendarUi } from "../calendar/calendar-ui.js";
import { getCalendar } from "../calendar/calendar.js";
import { MAX_FIELD_CHAR } from "../global-variables.js";
import { parseDate } from "../utils/date-utils.js";
import { organiseEmbedFieldToPages } from "../utils/embed-utils.js";
import { groupBy } from "../utils/list-utils.js";
import { reduceIfToLong } from "../utils/message-utils.js";
let TimeTable = class TimeTable {
    async day(text, interaction) {
        const start = parseDate(text);
        start.setUTCHours(0, 0, 0, 0);
        const end = new Date(start.getTime());
        end.setUTCHours(23, 59, 59, 999);
        const events = getCalendar("ISTIC")?.getEvents(start, end)
            .sort((ev1, ev2) => ev1.start.getTime() - ev2.start.getTime());
        if (events !== undefined) {
            const result = groupBy(events.map(this.formatEvent), e => e.day)
                .map(ed => this.buildEmbed(ed[0], ed[1]));
            // interaction.reply({embeds: result })
            const ui = new CalendarUi(result[0]);
            await ui.buildUi(interaction);
        }
        else
            interaction.reply("Aucune correspondance trouvée");
    }
    async next(interaction) {
        const now = new Date(Date.now());
        now.setSeconds(0);
        now.setMilliseconds(0);
        const event = getCalendar("ISTIC")?.getNextEvent(now);
        if (event !== undefined) {
            const formattedEvent = this.formatEvent(event);
            const embed = this.buildEmbed(formattedEvent.data, [{ hours: formattedEvent.hours, data: formattedEvent.data }]);
            await interaction.reply({ embeds: embed });
        }
        else
            await interaction.reply("Aucun évènement trouvé");
    }
    buildEmbed(day, events) {
        const fields = events.map(event => this.toEmbedField(event.hours, event.data));
        return organiseEmbedFieldToPages(fields, new MessageEmbed().setTitle(day).setColor("#f28028"));
    }
    toEmbedField(hours, data) {
        return { name: hours, value: reduceIfToLong(data, MAX_FIELD_CHAR) };
    }
    formatEvent(event) {
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: '2-digit' };
        var hourOptions = { hour: '2-digit', minute: '2-digit' };
        return {
            day: event.start.toLocaleDateString('fr-FR', options),
            hours: event.start.toLocaleTimeString('fr-FR', hourOptions) + ' - ' + event.end.toLocaleTimeString('fr-FR', hourOptions),
            data: `__**Évènement :**__ ${event.summary}
            __**Lieu :**__ ${event.location}
            __**Description :**__ ${event.description.trim().replaceAll('\n', ' ')}`.replace(/\n\s+/g, '\n')
        };
    }
};
__decorate([
    Slash(),
    SlashGroup('timetable'),
    __param(0, SlashOption("text")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, CommandInteraction]),
    __metadata("design:returntype", Promise)
], TimeTable.prototype, "day", null);
__decorate([
    Slash(),
    SlashGroup("event", "timetable"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CommandInteraction]),
    __metadata("design:returntype", Promise)
], TimeTable.prototype, "next", null);
TimeTable = __decorate([
    Discord(),
    SlashGroup({ name: "timetable", description: "Foo" }),
    SlashGroup({ name: "event", root: "timetable" })
], TimeTable);
export { TimeTable };
//# sourceMappingURL=timetable.js.map