@echo off
cd /d D:\LYXGIT\mysquarefaceicon
set XDG_CONFIG_HOME=D:\LYXGIT\mysquarefaceicon\.wrangler-config
npx wrangler login
npx wrangler whoami
pause
