// Command constants
export const COMMAND_LIST_ALLUSER = 'ls_alluser';
export const COMMAND_ADD_BLUSER = 'add_bluser';
export const COMMAND_REMOVE_BLUSER = 'rm_bluser';
export const COMMAND_LIST_BLUSER = 'ls_bluser';
export const COMMAND_ADD_DYUSER = 'add_dyuser';
export const COMMAND_REMOVE_DYUSER = 'rm_dyuser';
export const COMMAND_LIST_DYUSER = 'ls_dyuser';

// Export a unified commands list for Telegram's setMyCommands
export const COMMANDS = [
    { command: COMMAND_ADD_BLUSER, description: 'Add a Bilibili user to blacklist: /add_bluser <uid>' },
    { command: COMMAND_REMOVE_BLUSER, description: 'Remove a Bilibili user from blacklist: /rm_bluser <uid>' },
    { command: COMMAND_LIST_BLUSER, description: 'List blacklisted Bilibili users' },

    { command: COMMAND_ADD_DYUSER, description: 'Add a Douyin user: /add_dyuser <uid>' },
    { command: COMMAND_REMOVE_DYUSER, description: 'Remove a Douyin user: /rm_dyuser <uid>' },
    { command: COMMAND_LIST_DYUSER, description: 'List Douyin users' },

    { command: COMMAND_LIST_ALLUSER, description: 'List all tracked users (all platforms)' },
];

export default COMMANDS;
