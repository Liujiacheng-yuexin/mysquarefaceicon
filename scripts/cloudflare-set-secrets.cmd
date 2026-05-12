@echo off
cd /d D:\LYXGIT\mysquarefaceicon
set XDG_CONFIG_HOME=D:\LYXGIT\mysquarefaceicon\.wrangler-config

echo Set the admin password. You will type it into Wrangler; it will not be stored in the repo.
npx wrangler secret put ADMIN_PASSWORD

echo Set a random session secret. Use a long random string.
npx wrangler secret put SESSION_SECRET

pause
