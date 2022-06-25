import { ButtonInteraction, CommandInteraction, InteractionReplyOptions, InteractionUpdateOptions, MessageActionRow, MessageButton, MessageEmbed } from "discord.js";
import { interpret } from "xstate";
import { calendarUiMachine } from "./calendar-ui-machine.js";
import {v4 as uuidv4} from 'uuid';
import { eventEmitter } from "../emitter.js";

const baseNextButton = "next-"
const basePreviousButton = "previous-"

export class CalendarUi {

    private pages: MessageEmbed[]
    private readonly stateMachine;
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
        
        eventEmitter.on(previousButton.customId!, interaction => this.previous(interaction))
        eventEmitter.on(nextButton.customId!, interaction => this.next(interaction))
    }

    public async buildUi(interaction: ButtonInteraction | CommandInteraction) {
        await interaction.reply(this.getUpdate())
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
        interaction.update(this.getUpdate())
    }

    private getUpdate(): InteractionUpdateOptions & InteractionReplyOptions {
        const {pageIndex, isLastPage, isFirstPage } = this.stateMachine.state.context
        this.buttons.components[0].setDisabled(isFirstPage)
        this.buttons.components[1].setDisabled(isLastPage)
        const page = this.pages[pageIndex]
        return {embeds: [page], components: [this.buttons]}
    } 

}
