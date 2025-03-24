const { EmbedBuilder } = require('discord.js');
const config = require('../config/config');

module.exports = {
    name: 'servers',
    description: 'Show guilds the bot is in and generate invites',
    async execute(message, args) {
        // Check user permissions
        const userRoles = message.member.roles.cache;
        const hasPermission = Object.values(config.roles).some(role => 
            userRoles.has(role.id) && role.commands.includes('servers')
        );

        if (!hasPermission) {
            return message.reply('You do not have permission to use this command.');
        }

        const client = message.client;
        const guilds = client.guilds.cache;
        const results = [];

        // Create embed
        const embed = new EmbedBuilder()
            .setTitle('Bot Server List')
            .setColor('#0099FF')
            .setTimestamp();

        // Gather guild information and create invites
        for (const [_, guild] of guilds) {
            try {
                let inviteUrl = 'Unable to generate invite';
                try {
                    const invite = await guild.channels.cache
                        .filter(channel => channel.type === 0) // GUILD_TEXT
                        .first()
                        ?.createInvite({
                            maxAge: 0,
                            maxUses: 0
                        });
                    if (invite) {
                        inviteUrl = invite.url;
                    }
                } catch (error) {
                    console.error(`Failed to create invite for ${guild.name}: ${error.message}`);
                }

                results.push({
                    name: guild.name,
                    memberCount: guild.memberCount,
                    invite: inviteUrl
                });
            } catch (error) {
                console.error(`Error processing guild ${guild.name}: ${error.message}`);
            }
        }

        // Add fields to embed
        results.forEach(guild => {
            embed.addFields({
                name: guild.name,
                value: `Members: ${guild.memberCount}\\nInvite: ${guild.invite}`
            });
        });

        // Log the command usage
        const logChannel = message.guild.channels.cache.get(config.channels.serverListLogs);
        if (logChannel) {
            logChannel.send({
                embeds: [new EmbedBuilder()
                    .setTitle('Servers Command Used')
                    .setColor('#0099FF')
                    .setTimestamp()
                    .addFields(
                        { name: 'User', value: message.author.tag },
                        { name: 'Total Servers', value: guilds.size.toString() }
                    )]
            });
        }

        message.reply({ embeds: [embed] });
    },
};
