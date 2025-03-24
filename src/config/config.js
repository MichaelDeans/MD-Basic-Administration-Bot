module.exports = {
    // Main guild configuration (where admin commands can be used)
    mainGuildId: process.env.MAIN_GUILD_ID,
    
    // Fan discord configuration (protected from mass commands)
    fanGuildId: process.env.FAN_GUILD_ID,

    // Logging channels
    channels: {
        massbanLogs: process.env.MASSBAN_LOG_CHANNEL,
        masskickLogs: process.env.MASSKICK_LOG_CHANNEL,
        massunbanLogs: process.env.MASSUNBAN_LOG_CHANNEL,
        massnickLogs: process.env.MASSNICK_LOG_CHANNEL,
        playerCountLogs: process.env.PLAYER_COUNT_LOG_CHANNEL,
        serverListLogs: process.env.SERVER_LIST_LOG_CHANNEL
    },

    // Role hierarchy (from lowest to highest)
    roles: {
        member: {
            id: process.env.ROLE_MEMBER,
            commands: ['help', 'players']
        },
        staffInTraining: {
            id: process.env.ROLE_STAFF_IN_TRAINING,
            commands: ['help', 'players']
        },
        staff: {
            id: process.env.ROLE_STAFF,
            commands: ['help', 'players', 'massnick']
        },
        seniorStaff: {
            id: process.env.ROLE_SENIOR_STAFF,
            commands: ['help', 'players', 'massnick', 'masskick']
        },
        juniorAdmin: {
            id: process.env.ROLE_JUNIOR_ADMIN,
            commands: ['help', 'players', 'massnick', 'masskick']
        },
        admin: {
            id: process.env.ROLE_ADMIN,
            commands: ['help', 'players', 'massnick', 'masskick', 'massban', 'massunban']
        },
        internalAffairs: {
            id: process.env.ROLE_INTERNAL_AFFAIRS,
            commands: ['help', 'players', 'massnick', 'masskick', 'massban', 'massunban', 'servers']
        },
        seniorAdmin: {
            id: process.env.ROLE_SENIOR_ADMIN,
            commands: ['help', 'players', 'massnick', 'masskick', 'massban', 'massunban', 'servers']
        },
        headAdmin: {
            id: process.env.ROLE_HEAD_ADMIN,
            commands: ['help', 'players', 'massnick', 'masskick', 'massban', 'massunban', 'servers']
        }
    },

    // FiveM server configuration
    fivem: {
        serverIp: process.env.FIVEM_SERVER_IP,
        serverPort: process.env.FIVEM_SERVER_PORT
    }
};
