const { EmbedBuilder } = require('discord.js');
const config = require('../config/config');

module.exports = {
    name: 'help',
    description: 'Display available commands based on user\'s role',
    async execute(message, args) {
        const userRoles = message.member.roles.cache;
        
        // Find the highest role the user has
        let availableCommands = new Set();
        Object.values(config.roles).forEach(role => {
            if (userRoles.has(role.id)) {
                role.commands.forEach(cmd => availableCommands.add(cmd));
            }
        });

        // Create help embed
        const embed = new EmbedBuilder()
            .setTitle('Available Commands')
            .setColor('#0099FF')
            .setTimestamp();

        // Command descriptions
        const commandDescriptions = {
            help: 'Display this help message',
            players: 'Show current FiveM server player count',
            massnick: 'Mass change nicknames for mentioned users',
            masskick: 'Mass kick mentioned users from the server',
            massban: 'Mass ban mentioned users from the server',
            massunban: 'Mass unban users by ID',
            servers: 'Show all servers the bot is in with invite links'
        };

        // Add available commands to embed
        const commandFields = Array.from(availableCommands).map(cmd => ({
            name: `.${cmd}`,
            value: commandDescriptions[cmd] || 'No description available'
        }));

        embed.addFields(commandFields);

        // Add note about main guild restriction if applicable
        if (availableCommands.has('massban') || availableCommands.has('masskick')) {
            embed.setFooter({
                text: 'Note: Mass moderation commands can only be used in the main guild'
            });
        }

        message.reply({ embeds: [embed] });
    },
};
