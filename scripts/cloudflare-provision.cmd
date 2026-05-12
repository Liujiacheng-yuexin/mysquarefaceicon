@echo off
cd /d D:\LYXGIT\mysquarefaceicon
set XDG_CONFIG_HOME=D:\LYXGIT\mysquarefaceicon\.wrangler-config

echo Creating Cloudflare KV namespaces...
npx wrangler kv namespace create COMMENTS_KV
npx wrangler kv namespace create COMMENTS_KV --preview

echo Creating Cloudflare R2 buckets...
npx wrangler r2 bucket create mysquarefaceicon-comment-images
npx wrangler r2 bucket create mysquarefaceicon-comment-images-preview

echo.
echo Copy the KV namespace IDs from the output above into wrangler.toml.
pause
