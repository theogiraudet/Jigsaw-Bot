import { randomBytes, randomInt } from "crypto";
import { CommandInteraction, GuildTextBasedChannel, TextChannel } from "discord.js";
import { Discord, Slash, SlashGroup, SlashOption } from "discordx";
import { AppDataSource } from "../../data-source.js";
import { Invite } from "../entity/Invite.js";

@Discord()
@SlashGroup({ name: "invite", description: "Foo" })
export class InviteCommand {

    @Slash()
    @SlashGroup("invite")
    async create(@SlashOption("name") name: string, interaction: CommandInteraction): Promise<void> {
        if(interaction.inGuild()) {
            const invite = await this.createInvite(interaction.channel, name)
            AppDataSource.manager.save(invite)
                .then(() => interaction.reply("Created!"))
                .catch(() => interaction.reply("An error is occured..."))
            
        } else
            interaction.reply("Internal error...")
    }

    @Slash()
    @SlashGroup("invite")
    async get(interaction: CommandInteraction): Promise<void> {
        const invites = await AppDataSource.manager.find(Invite)
        const text = invites.map(invite => `**${invite.name}** => ${invite.code}`).join('\n')
        if(invites.length > 0)
            interaction.reply(text)
        else
            interaction.reply('No invites was created')
    }

    private async createInvite(channel: GuildTextBasedChannel | null, name: string): Promise<Invite> {
        if(channel?.isText()) {
            return channel.guild.invites.create(channel as TextChannel, {reason: randomInt(1024) + ''})
            .then(invite => new Invite(invite.code, name, invite.inviterId!, invite.expiresAt!, invite.createdAt!))
        }
        return Promise.reject()
    }

}