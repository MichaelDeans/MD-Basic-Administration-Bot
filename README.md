# MD-Administration-Bot

A powerful Discord administration bot designed for FiveM communities, providing advanced moderation and management features.

## Features

- Mass moderation commands (ban, kick, unban, nickname changes)
- FiveM server player count tracking
- Server management tools
- Role-based permission system
- Comprehensive logging system

## Commands

- `.massban` - Mass ban mentioned users (Admin+ only)
- `.masskick` - Mass kick mentioned users (Senior Staff+ only)
- `.massunban` - Mass unban users by ID (Admin+ only)
- `.massnick` - Mass change nicknames (Staff+ only)
- `.players` - Display FiveM server player count (All roles)
- `.servers` - Show bot's server list with invites (Internal Affairs+ only)
- `.help` - Display available commands based on user's role

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and configure:
   ```bash
   cp .env.example .env
   ```
4. Configure the bot in `.env`:
   - Add your Discord bot token
   - Set main guild and fan guild IDs
   - Configure role IDs
   - Set up logging channels
   - Add FiveM server details

## Configuration Guide

### Guild Configuration
- `MAIN_GUILD_ID`: The primary server where moderation commands can be used
- `FAN_GUILD_ID`: The fan server that is protected from mass moderation commands

### Role Hierarchy (Lowest to Highest)
1. Member
   - Can use: help, players
2. Staff In Training
   - Can use: help, players
3. Staff
   - Can use: help, players, massnick
4. Senior Staff
   - Can use: help, players, massnick, masskick
5. Junior Administration
   - Can use: help, players, massnick, masskick
6. Administration
   - Can use: help, players, massnick, masskick, massban, massunban
7. Internal Affairs
   - Can use: All commands
8. Senior Administration
   - Can use: All commands
9. Head Administration
   - Can use: All commands

### Logging Channels
Configure separate logging channels for each command type:
- `MASSBAN_LOG_CHANNEL`
- `MASSKICK_LOG_CHANNEL`
- `MASSUNBAN_LOG_CHANNEL`
- `MASSNICK_LOG_CHANNEL`
- `PLAYER_COUNT_LOG_CHANNEL`
- `SERVER_LIST_LOG_CHANNEL`

## Security Features

- Mass moderation commands are restricted to the main guild
- Fan guild is protected from mass moderation commands
- Role-based permission system
- Comprehensive logging of all actions
- Command usage tracking

## License

MIT License
