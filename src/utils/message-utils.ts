import { CommandInteraction } from "discord.js"
import { MAX_MSG_CHAR } from "../global-variables.js"

export function toValidSizeMessage(paragraphs: string[]): string[] {
    const messages: string[] = []
    let str = ''
    let i = 0
    while (str.length < MAX_MSG_CHAR && i < paragraphs.length) {
        const strTemp = str + paragraphs[i] + '\n\n'
        if (strTemp.length < MAX_MSG_CHAR)
            str = strTemp
        else {
            messages.push(str)
            str = ''
        }
        i++
    }
    messages.push(str)
    return messages
}

export async function sendToValidSizeMessage(paragraphs: string[] | undefined, interaction: CommandInteraction): Promise<void> {
    if(paragraphs !== undefined) {
        const messages = toValidSizeMessage(paragraphs)
        if(messages.length > 0) {
            await interaction.reply(messages[0])
            if(messages.length > 1) {
                for(const event of messages.slice(1))
                    await interaction.followUp(event)
                return Promise.resolve()
            }
        }
    }
    return Promise.reject()
}

export function reduceIfToLong(message: string, maxLength: number): string {
    if(message.length > maxLength) {
        const terminator = ' [...]'
        const reducedMessage = message.split(' ')
        let keep = ''
        let tempKeep = ''
        while(tempKeep.length < maxLength - terminator.length && reducedMessage.length > 0) {
            tempKeep += reducedMessage.pop()
            if(tempKeep.length < maxLength - terminator.length)
                keep = tempKeep
        }
        if(tempKeep.length < maxLength - terminator.length)
                keep = tempKeep
        
        return keep + terminator
    }
    return message
}