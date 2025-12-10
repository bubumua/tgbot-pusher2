import { setWebhook, setMyCommands } from '../utils/telegram';

export async function handleInit(req: Request, env: any) {
    const botToken = env.BOT_TOKEN;
    if (!botToken) return new Response(JSON.stringify({ error: 'BOT_TOKEN not set' }), { status: 500 });

    const url = new URL(req.url);
    const origin = url.origin;
    const webhookUrl = `${origin}/tgbot/func`;

    const results: any = {};
    // include the calculated webhook URL in the response for visibility
    results.webhookUrl = webhookUrl;
    try {
        results.setWebhook = await setWebhook(botToken, webhookUrl);
    } catch (e) {
        results.setWebhook = { error: String(e) };
    }

    try {
        const commands = [
            { command: 'add', description: 'Add uid: /add 123' },
            { command: 'rm', description: 'Remove uid: /rm 123' },
            { command: 'ls', description: 'List uids' },
        ];
        results.setCommands = await setMyCommands(botToken, commands);
    } catch (e) {
        results.setCommands = { error: String(e) };
    }

    return new Response(JSON.stringify(results, null, 2), { headers: { 'Content-Type': 'application/json' } });
}
