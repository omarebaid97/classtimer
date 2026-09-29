# classtimer

Mario Kart themed period/phase timer for a classroom display. Static site
(HTML/JS/CSS) served by nginx; live at https://classtimer.omarebaid.com.

## Layout

- `site/` - the app (`index.html`, `app.js`, `sounds.js`, `style.css`)
- `site/config.js` - all schedule/phase/color settings; edit and refresh the page
- `nginx.conf` - nginx server block (no-cache headers)
- `docker-compose.yml` - runs `nginx:alpine`, bind-mounting `site/` read-only

## Run

```
docker compose up -d
```

No `.env` is needed. Edit `site/config.js` and hard-refresh the browser.
