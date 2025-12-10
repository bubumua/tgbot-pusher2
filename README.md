# tgbot-pusher2

Scaffold for a Cloudflare Worker that integrates with a Telegram bot via webhook.

Structure added:

- `src/handlers` - route handlers: `root`, `init`, `tgbot`
- `src/utils` - Telegram API helpers
- `src/storage` - KV helpers for `uplist`
- `src/templates` - simple HTML templates

Bindings required (configure in `wrangler.toml` / `wrangler.jsonc`):
- `BOT_TOKEN` (secret): your Telegram bot token
- `UPLIST` (KV namespace): KV namespace for storing `uplist`

Endpoints:
- `/tgbot` - welcome page showing `getWebhookInfo` result
- `/tgbot/init` - sets webhook to `/tgbot/func` and installs commands
- `/tgbot/func` - Telegram webhook endpoint (POST)

Next steps:
- Bind `BOT_TOKEN` and `UPLIST` in `wrangler.jsonc`.
- Deploy and call `/tgbot/init` once to set webhook and commands.
- Implement scheduled push logic in the `scheduled` handler (already present in `src/index.ts`).
