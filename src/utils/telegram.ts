const TG_API = (token: string) => `https://api.telegram.org/bot${token}`;

export async function getWebhookInfo(token: string) {
    const res = await fetch(`${TG_API(token)}/getWebhookInfo`);
    return res.json();
}

export async function setWebhook(token: string, url: string) {
    const res = await fetch(`${TG_API(token)}/setWebhook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
    });
    return res.json();
}

export async function setMyCommands(token: string, commands: Array<{ command: string; description: string }>) {
    const res = await fetch(`${TG_API(token)}/setMyCommands`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commands }),
    });
    return res.json();
}

export async function sendMessage(token: string, chat_id: number | string, text: string) {
    const res = await fetch(`${TG_API(token)}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id, text }),
    });
    return res.json();
}
