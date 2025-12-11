import { sendMessage } from '../utils/telegram';
import { KVStore } from '../storage/KVStore';
import {
    COMMAND_LIST_ALLUSER,
    COMMAND_ADD_BLUSER,
    COMMAND_REMOVE_BLUSER,
    COMMAND_LIST_BLUSER,
    COMMAND_ADD_DYUSER,
    COMMAND_REMOVE_DYUSER,
    COMMAND_LIST_DYUSER,
} from '../constants/commands';
import { KEY_USERLIST, KEY_LAST_INFO_STATUS } from '../storage/KVStore';


export async function handleTgWebhook(req: Request, env: Env) {
    if (req.method === 'OPTIONS') return new Response('Method OPTIONS OK', { status: 200 });

    let body: any;
    try {
        body = await req.json();
    } catch (e) {
        return new Response('invalid json', { status: 400 });
    }

    const msg = body.message || body.edited_message || body.channel_post;
    if (!msg) return new Response('no message', { status: 200 });

    const text: string = (msg.text || '').trim();
    const chatId = msg.chat && msg.chat.id;

    if (!text.startsWith('/')) {
        // TODO: handle non-command messages if needed
        return new Response('no command', { status: 200 });
    }

    const parts = text.split(/\s+/);
    const cmd = parts[0].slice(1).toLowerCase();

    const BLStore = new KVStore(env.liveinfo, 'BL');
    const DYStore = new KVStore(env.liveinfo, 'DY');

    if (cmd === COMMAND_ADD_BLUSER && parts[1]) {
        const key = KEY_USERLIST;
        const raw = (await BLStore.getJson<string[]>(key)) || [];
        const list = Array.isArray(raw) ? raw : [];
        if (!list.includes(parts[1])) {
            list.push(parts[1]);
            await BLStore.setJson(key, list);
        }
        await sendMessage(env.BOT_TOKEN, chatId, `Added ${parts[1]}`);
        return new Response('added');
    }
    if (cmd === COMMAND_REMOVE_BLUSER && parts[1]) {
        const key = KEY_USERLIST;
        const raw = (await BLStore.getJson<string[]>(key)) || [];
        const list = Array.isArray(raw) ? raw : [];
        const idx = list.indexOf(parts[1]);
        if (idx !== -1) {
            list.splice(idx, 1);
            await BLStore.setJson(key, list);
        }
        await sendMessage(env.BOT_TOKEN, chatId, `Removed ${parts[1]}`);
        return new Response('removed');
    }

    if (cmd === COMMAND_LIST_BLUSER) {
        const key = KEY_USERLIST;
        const raw = (await BLStore.getJson<string[]>(key)) || [];
        const list = Array.isArray(raw) ? raw : [];
        if (!list || list.length === 0) {
            await sendMessage(env.BOT_TOKEN, chatId, '(empty)');
            return new Response('listed');
        }

        for (const item of list) {
            await sendMessage(env.BOT_TOKEN, chatId, String(item));
        }
        return new Response('listed');
    }

    await sendMessage(env.BOT_TOKEN, chatId, `Unknown command: ${cmd}`);
    return new Response('ok');
}
