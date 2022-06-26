import { ButtonInteraction, CacheType, CommandInteraction, GuildCacheMessage, InteractionReplyOptions, InteractionUpdateOptions, Message, MessageActionRow, MessageButton, MessageEmbed, TextBasedChannel } from "discord.js";
import { interpret } from "xstate";
import { calendarUiMachine } from "./calendar-ui-machine.js";
import {v4 as uuidv4} from 'uuid';
import { eventBus } from "../event-bus.js";
import { properties } from "../properties.js";

const baseNextButton = "next-"
const basePreviousButton = "previous-"

export class CalendarUi {

    private pages: MessageEmbed[]
    private readonly stateMachine
    private readonly buttons: MessageActionRow

    private readonly uiId: string

    public constructor(pages: MessageEmbed[]) {
        this.pages = pages
        this.uiId = uuidv4()

        const previousButton = new MessageButton()
            .setCustomId(basePreviousButton + this.uiId)
            .setLabel('Précédent')
            .setStyle('PRIMARY')

        const nextButton = new MessageButton()
            .setCustomId(baseNextButton + this.uiId)
            .setLabel('Suivant')
            .setStyle('PRIMARY')
        
        this.buttons = new MessageActionRow()
            .addComponents(previousButton, nextButton);

        const stateMachine = calendarUiMachine(pages.length)
        
        this.stateMachine = interpret(stateMachine)
        this.stateMachine.start()
    }

    public async buildUi(interaction: ButtonInteraction | CommandInteraction) {
        const previousButton = this.buttons.components[0]
        const nextButton = this.buttons.components[1]
        const timeout = eventBus.on(previousButton.customId!, (interaction: ButtonInteraction) => this.previous(interaction), () => this.expire(message.id, interaction.channel!))
        this.pages.forEach(page => page.setFooter({text: "Expiration à " + timeout.toLocaleTimeString(properties.locale)}))
        eventBus.on(nextButton.customId!, (interaction: ButtonInteraction) => this.next(interaction))
        const message = await interaction.reply({ ...this.getUpdate(), fetchReply: true })
    }

    private async next(interaction: ButtonInteraction) {
        this.stateMachine.send({type: "NEXT_PAGE"})
        await this.updateUi(interaction)
    }

    private async previous(interaction: ButtonInteraction) {
        this.stateMachine.send({type: "PREVIOUS_PAGE"})
        await this.updateUi(interaction)
    }

    private async updateUi(interaction: ButtonInteraction) {
        await interaction.update(this.getUpdate())
    }

    private async expire(id: string, channel: TextBasedChannel) {
        const message = (await channel.messages.fetch(id))
        await message.edit({embeds: message.embeds.map(embed => embed.setFooter({text: "Menu expiré"}))})
    }

    private getUpdate(): InteractionUpdateOptions & InteractionReplyOptions {
        const {pageIndex, isLastPage, isFirstPage } = this.stateMachine.state.context
        this.buttons.components[0].setDisabled(isFirstPage)
        this.buttons.components[1].setDisabled(isLastPage)
        const page = this.pages[pageIndex]
        return {embeds: [page], components: [this.buttons]}
    } 

}
