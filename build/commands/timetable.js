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
import { CommandInteraction } from "discord.js";
import { Discord, Slash, SlashOption } from "discordx";
import { getCalendar } from "../calendar/calendar";
import { parseDate } from "../calendar/date-utils";
let TimeTable = class TimeTable {
    timeTable(text, interaction) {
        const start = parseDate(text);
        start.setUTCHours(0, 0, 0, 0);
        const end = new Date(start.getTime());
        end.setUTCHours(23, 59, 59, 999);
        const events = getCalendar("ISTIC")?.getEvents(start, end);
        const str = events?.map(this.eventToString).join("\n");
        if (str !== undefined) {
            interaction.reply(str);
        }
    }
    eventToString(event) {
        return `
        Cours : ${event.summary}
        Début : ${event.start.toLocaleDateString()}
        Fin : ${event.end.toLocaleDateString()}
        Lieu : ${event.location}
        Description : ${event.description}
        `;
    }
};
__decorate([
    Slash("timetable"),
    __param(0, SlashOption("text")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, CommandInteraction]),
    __metadata("design:returntype", void 0)
], TimeTable.prototype, "timeTable", null);
TimeTable = __decorate([
    Discord()
], TimeTable);
export { TimeTable };
