const { EmbedBuilder } = require('discord.js');
const config = require('../config/config');
const axios = require('axios');

module.exports = {
    name: 'players',
    description: 'Display player count from FiveM server',
    async execute(message, args) {
        // Check user permissions
        const userRoles = message.member.roles.cache;
        const hasPermission = Object.values(config.roles).some(role => 
            userRoles.has(role.id) && role.commands.includes('players')
        );

        if (!hasPermission) {
            return message.reply('You do not have permission to use this command.');
        }

        try {
            const { serverIp, serverPort } = config.fivem;
            const response = await axios.get(`http://${serverIp}:${serverPort}/players.json`);
            const players = response.data;

            const embed = new EmbedBuilder()
                .setTitle('FiveM Server Players')
                .setColor('#00FF00')
                .setTimestamp()
                .addFields(
                    { name: 'Player Count', value: players.length.toString() },
                    { name: 'Server Address', value: `${serverIp}:${serverPort}` }
                );

            if (players.length > 0) {
                const playerList = players
                    .map(player => `${player.name} (ID: ${player.id})`)
                    .join('\\n');
                embed.addFields({ name: 'Online Players', value: playerList });
            }

            // Log the command usage
            const logChannel = message.guild.channels.cache.get(config.channels.playerCountLogs);
            if (logChannel) {
                logChannel.send({
                    embeds: [new EmbedBuilder()
                        .setTitle('Player Count Command Used')
                        .setColor('#0099FF')
                        .setTimestamp()
                        .addFields(
                            { name: 'User', value: message.author.tag },
                            { name: 'Player Count', value: players.length.toString() }
                        )]
                });
            }

            message.reply({ embeds: [embed] });
        } catch (error) {
            message.reply('Failed to fetch player count. Please check if the FiveM server is online.');
        }
    },
};
