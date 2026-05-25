# IndexNow

IndexNow is a search engine notification protocol. It lets the site tell participating search engines when important URLs are created, updated, deleted, redirected, or migrated.

For this project, `sitemap.xml` remains the full indexable URL list. IndexNow is only for notifying search engines about recent URL changes. Do not submit the entire site every day.

## Key File

The IndexNow key file is deployed from:

```text
public/b62557d66d1b4c3fabaecea8c3f9409b.txt
```

Its content must be exactly:

```text
b62557d66d1b4c3fabaecea8c3f9409b
```

After deployment, verify it in a browser or with curl:

```bash
curl https://mysquarefaceicon.com/b62557d66d1b4c3fabaecea8c3f9409b.txt
```

The response should be only the key text.

## Submit URLs

The project includes a Node script that uses native `fetch` and posts to `https://api.indexnow.org/indexnow`.

Submit the homepage:

```bash
npm run indexnow -- --domain mysquarefaceicon.com --url https://mysquarefaceicon.com/
```

Submit one URL:

```bash
npm run indexnow -- --domain mysquarefaceicon.com --url https://mysquarefaceicon.com/gallery
```

Submit multiple URLs:

```bash
npm run indexnow -- --domain mysquarefaceicon.com --urls https://mysquarefaceicon.com/,https://mysquarefaceicon.com/gallery
```

Submit all URLs currently listed in the sitemap:

```bash
npm run indexnow -- --domain mysquarefaceicon.com --sitemap https://mysquarefaceicon.com/sitemap.xml
```

The same sitemap submission can be run with:

```bash
npm run indexnow -- --domain mysquarefaceicon.com --all
```

## What To Submit

Submit URLs when they are meaningful for search engines:

- New pages.
- Pages with clear content updates.
- Deleted, redirected, or migrated pages.
- Important SEO pages.

Do not submit:

- `noindex` pages.
- Pages blocked by `robots.txt`.
- Admin or backend pages.
- Duplicate URLs.
- Low-quality bulk pages with no real content.

## Notes

The script only submits URLs for `mysquarefaceicon.com`, filters invalid URLs, removes hash URLs, skips obvious admin URLs, and batches submissions at 10,000 URLs per request.

HTTP `200` means submitted. HTTP `202` means accepted and waiting for key verification. HTTP `400`, `403`, `422`, and `429` include clearer troubleshooting messages in the command output.
