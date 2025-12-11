const DYLIVEINFO_ENDPOINT = 'https://api-forwarding-vc.vercel.app/api/dy/liveinfo';

/**
 * Fetch Douyin live info for given sec_user_id values.
 * The Douyin endpoint does not support multi-id queries, so we request each id separately
 * and merge results into an object shaped like { apisuccess: boolean, data: { secId: info } }.
 */
// export async function fetchDyInfos(secIds: string[] | number[]) {
//     if (!secIds || secIds.length === 0) return null;

//     const results: { apisuccess: boolean; data: Record<string, any>; errors?: any[] } = {
//         apisuccess: false,
//         data: {},
//         errors: [],
//     };

//     const tasks = secIds.map(async (s) => {
//         const sec = String(s);
//         const url = `${DYLIVEINFO_ENDPOINT}?sec_user_id=${encodeURIComponent(sec)}`;
//         try {
//             const resp = await fetch(url, { method: 'GET' });
//             if (!resp.ok) {
//                 results.errors!.push({ sec, status: resp.status });
//                 return;
//             }
//             const json = await resp.json();
//             if (json && json.apisuccess && json.data) {
//                 // Attach under the sec id key so consumers can lookup by the original id
//                 results.data[sec] = json.data;
//                 results.apisuccess = true;
//             } else {
//                 results.errors!.push({ sec, body: json });
//             }
//         } catch (e) {
//             results.errors!.push({ sec, error: String(e) });
//         }
//     });

//     await Promise.all(tasks);

//     // if no successful entries, keep apisuccess false
//     return results;
// }

/**
 * Fetch liveinfos for given uids via GET (uids[] params)
 */
export async function fetchDYLiveInfo(sec_user_id: string) {
    if (!sec_user_id || sec_user_id.length === 0) return null;
    // Use POST with JSON body to avoid excessively long URLs
    const url = DYLIVEINFO_ENDPOINT;
    const body = { "sec_user_id": sec_user_id };
    const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    if (!resp.ok) throw new Error(`liveinfos fetch failed: ${resp.status}`);
    const json = await resp.json();
    return json;
}