const UPLIST_KEY = 'uplist';

export async function getList(kv: any) {
    if (!kv) return [];
    const raw = await kv.get(UPLIST_KEY);
    if (!raw) return [];
    try {
        return JSON.parse(raw || '[]');
    } catch (e) {
        return [];
    }
}

export async function addToList(kv: any, uid: string) {
    if (!kv) return;
    const list = await getList(kv);
    if (!list.includes(uid)) list.push(uid);
    await kv.put(UPLIST_KEY, JSON.stringify(list));
}

export async function removeFromList(kv: any, uid: string) {
    if (!kv) return;
    const list = await getList(kv);
    const idx = list.indexOf(uid);
    if (idx !== -1) {
        list.splice(idx, 1);
        await kv.put(UPLIST_KEY, JSON.stringify(list));
    }
}
