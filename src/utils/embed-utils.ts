import { EmbedFieldData, MessageEmbed } from "discord.js";
import { properties } from "../properties.js"

export function organiseEmbedFieldToPages(fields: EmbedFieldData[], template: MessageEmbed, maxFields: number = properties.maxFieldsByEmbedPage.value): MessageEmbed[] {
    const chunks: MessageEmbed[] = []
    if(fields.length > 0) {
        for (let i = 0; i < fields.length; i += maxFields) {
            const embed = new MessageEmbed()
                .setAuthor(template.author)
                .setFooter(template.footer)
                .setTimestamp(template.timestamp)
            
            if(template.url !== null)
                embed.setURL(template.url)
            if(template.title !== null)
                embed.setTitle(template.title)
            if(template.thumbnail !== null)
                embed.setThumbnail(template.thumbnail?.url)
            if(template.image !== null)
                embed.setImage(template.image.url)
            if(template.description !== null)
                embed.setDescription(template.description)
            if(template.hexColor !== null)
                embed.setColor(template.hexColor)

            embed.setFields(fields.slice(i, i + maxFields))
            console.log(`Chunk size: ` + fields.slice(i, i + maxFields).length)
            chunks.push(embed)
        }
    }
    return chunks
}