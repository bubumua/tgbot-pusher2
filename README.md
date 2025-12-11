# tgbot-pusher2

Cloudflare Worker for a Telegram bot that tracks live status for Bilibili and Douyin users and pushes updates to a chat.

**What It Does**
- **Overview:** Stores per-platform user lists in a Cloudflare KV and periodically fetches live status from platform APIs. When a user's live status changes, the worker sends a notification message to a configured Telegram `CHAT_ID`.

**Project Structure**
- **`src/handlers`**: HTTP route handlers (`/tgbot`, `/tgbot/init`, `/tgbot/func`).
- **`src/utils`**: helpers for Telegram and upstream APIs (`bilibili`, `douyin`).
- **`src/storage`**: `KVStore` wrapper used for typed KV access and consistent key prefixes.
- **`src/pusher`**: scheduled push logic used by the `scheduled` worker binding.

**Environment & Bindings**
- **`BOT_TOKEN`**: (secret) Telegram bot token.
- **`CHAT_ID`**: (string/number) Target chat id for scheduled push messages.
- **`liveinfo`**: KV namespace bound to the worker (all KV data is stored here).
- Configure these in `wrangler.toml` / `wrangler.jsonc` under `vars` / `kv_namespaces`.

**Routes / Endpoints**
- **`GET /tgbot`**: Welcome page that shows Telegram `getWebhookInfo`.
- **`GET /tgbot/init`**: Sets the Telegram webhook to `POST /tgbot/func` and installs bot commands.
- **`POST /tgbot/func`**: Telegram webhook handler (receives updates and supports slash commands).

**Telegram Commands**
- The worker registers a small command set (see `src/constants/commands.ts`). Key commands:
	- `add_bluser`  : Add a Bilibili user (usage: `/add_bluser <uid>`)
	- `rm_bluser`   : Remove a Bilibili user (usage: `/rm_bluser <uid>`)
	- `ls_bluser`   : List tracked Bilibili users
	- `add_dyuser`  : Add a Douyin user (usage: `/add_dyuser <sec_user_id>`)
	- `rm_dyuser`   : Remove a Douyin user (usage: `/rm_dyuser <sec_user_id>`)
	- `ls_dyuser`   : List tracked Douyin users
	- `ls_alluser`  : List all tracked users across platforms

**KV Layout and Keys**
- The worker uses a single KV namespace (`liveinfo`) and the `KVStore` class to isolate per-platform data via prefixes.
- Per-platform prefixes used: `BL` for Bilibili, `DY` for Douyin. Keys are constructed as `<PREFIX>_<KEY>` by `KVStore`.
- Common keys (defined in `src/storage/KVStore.ts`):
	- `userlist` : stored as `<PREFIX>_userlist`, an array of tracked ids (uids or sec_user_ids).
	- `last_info_status` : stored as `<PREFIX>_last_info_status`, a map of id -> last known `live_status` (number).

**Scheduled Push Behavior**
- The `scheduled` worker reads both `BL_userlist` and `DY_userlist`, fetches current live info from upstream APIs, compares with `last_info_status`, and when changes are detected sends notifications to `CHAT_ID` via Telegram `sendMessage`.
- Bilibili fetches are done in batch via a POST endpoint (`fetchLiveInfos`) to avoid long query strings.
- Douyin is queried per `sec_user_id` (the upstream forwarding API used does not accept multi-id requests), results are merged and persisted per-id.

**Running Locally**
- Start the worker in dev mode:
	```pwsh
	npx wrangler dev
	```
- To initialize webhook and bot commands, visit (or `curl`) `GET /tgbot/init` while `BOT_TOKEN` is set.

**Notes & Next Steps**
- If you track many Douyin ids, consider adding rate-limiting or batching to avoid upstream throttling.
- `KVStore` centralizes JSON parsing/serialization; you can add TTL helpers if needed.
- The scheduled push already persists last statuses in KV; you can add more metadata (timestamps, cached names) if desired.

**Files to inspect**
- `src/handlers/tgbotFunc.ts` — command parsing and KV list management.
- `src/pusher/scheduledPush.ts` — scheduled runner, `getBLInfos` / `getDYInfos` helpers.
- `src/utils/bilibili.ts` and `src/utils/douyin.ts` — upstream API wrappers.

---

If you want, I can also:
- add a short `wrangler` config snippet for KV binding,
- include example `curl` commands for `/tgbot/init` and sending test updates,
- or update inline docs in handlers to show command formats.
