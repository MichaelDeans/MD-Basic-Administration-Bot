const { EmbedBuilder } = require('discord.js');
const config = require('../config/config');

module.exports = {
    name: 'help',
    description: 'Display available commands based on user\'s role',
    async execute(message, args) {
        const userRoles = message.member.roles.cache;
        
        let availableCommands = new Set();
        Object.values(config.roles).forEach(role => {
            if (userRoles.has(role.id)) {
                role.commands.forEach(cmd => availableCommands.add(cmd));
            }
        });

        const embed = new EmbedBuilder()
            .setTitle('Available Commands')
            .setColor('#0099FF')
            .setTimestamp();

        const commandInfo = {
            help: {
                description: 'Display this help message',
                usage: '.help'
            },
            players: {
                description: 'Show current FiveM server player count',
                usage: '.players'
            },
            massnick: {
                description: 'Mass change nicknames for mentioned users',
                usage: '.massnick @user1 @user2 ... <new nickname>'
            },
            masskick: {
                description: 'Mass kick mentioned users from the server',
                usage: '.masskick @user1 @user2 ... <reason>'
            },
            massban: {
                description: 'Mass ban mentioned users from the server',
                usage: '.massban @user1 @user2 ... <reason>'
            },
            massunban: {
                description: 'Mass unban users by ID',
                usage: '.massunban <userID1> <userID2> ...'
            },
            servers: {
                description: 'Show all servers the bot is in with invite links',
                usage: '.servers'
            }
        };

        const commandFields = Array.from(availableCommands).map(cmd => ({
            name: `.${cmd}`,
            value: `${commandInfo[cmd].description}\nUsage: \`${commandInfo[cmd].usage}\``
        }));

        embed.addFields(commandFields);

        if (availableCommands.has('massban') || availableCommands.has('masskick')) {
            embed.setFooter({
                text: 'Note: Mass moderation commands can only be used in the main guild'
            });
        }

        message.reply({ embeds: [embed] });
    },
};
