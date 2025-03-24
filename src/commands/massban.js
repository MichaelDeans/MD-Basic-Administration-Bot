const { EmbedBuilder } = require('discord.js');
const config = require('../config/config');

module.exports = {
    name: 'massban',
    description: 'Mass ban users from the main guild',
    async execute(message, args) {
        if (message.guild.id !== config.mainGuildId) {
            return message.reply('This command can only be used in the main guild.');
        }

        const userRoles = message.member.roles.cache;
        const hasPermission = Object.values(config.roles).some(role => 
            userRoles.has(role.id) && role.commands.includes('massban')
        );

        if (!hasPermission) {
            return message.reply('You do not have permission to use this command.');
        }

        const users = message.mentions.users;
        if (users.size === 0) {
            return message.reply('Please mention the users you want to ban.');
        }

        const reason = args.slice(users.size).join(' ').trim();
        if (!reason) {
            return message.reply('Please provide a reason for the ban. Usage: .massban @user1 @user2 ... <reason>');
        }

        const logEmbed = new EmbedBuilder()
            .setTitle('Mass Ban Executed')
            .setColor('#FF0000')
            .setTimestamp()
            .addFields(
                { name: 'Moderator', value: message.author.tag },
                { name: 'Users Banned', value: users.map(user => user.tag).join('\n') },
                { name: 'Reason', value: reason }
            );

        const results = [];
        for (const [_, user] of users) {
            try {
                await message.guild.members.ban(user, { reason: `${reason} - By ${message.author.tag}` });
                results.push(`Banned ${user.tag}`);
            } catch (error) {
                results.push(`Failed to ban ${user.tag}: ${error.message}`);
            }
        }

        const logChannel = message.guild.channels.cache.get(config.channels.massbanLogs);
        if (logChannel) {
            logChannel.send({ embeds: [logEmbed] });
        }

        message.reply(results.join('\n'));
    },
};
