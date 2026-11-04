# BW Nexus

A tiny web proxy: search the web or open any site through the
[Scramjet](https://github.com/MercuryWorkshop/scramjet) engine.

The whole app is one file — `index.html`. Everything else is the engine the
browser forces us to keep separate (explained below).

## What's in here

| File | Why it exists |
| --- | --- |
| `index.html` | The entire BW Nexus app: markup, styles, search, tabs, settings, engine boot. |
| `sw.js` | Scramjet's service worker. Browsers only accept a same-origin script URL, so this cannot live inside the HTML. |
| `scramjet.all.js` | Scramjet engine bundle (vendored, v1.1.0). |
| `scramjet.sync.js` | Scramjet synchronous-XHR bridge worker (vendored). |
| `scramjet.wasm.wasm` | Scramjet HTML/JS rewriter compiled to WebAssembly (vendored). |
| `mux.js` | BareMux transport `SharedWorker` (vendored, v2.1.9). Also same-origin only. |
| `baremux.mjs` | BareMux browser client, imported by `index.html` (vendored, v2.1.9). |
| `epoxy.mjs` | Epoxy transport that carries requests over the Wisp server (vendored, v2.1.29). |
| `uv.html` | The Ultraviolet engine's page — same settings, different engine. |
| `uv/` | Ultraviolet 3.2.10 vendored from npm (`uv.bundle.js`, `uv.sw.js`, `uv.handler.js`, `uv.client.js`) plus BW Nexus's `uv.config.js` and `sw.js`. |
| `baremod.mjs` | Bare v3 client used as a bare-mux transport — the option that avoids Wisp. |

## Running it

Service workers need HTTPS or `localhost`, so `file://` will not work. Any static
file server is enough — no build step, no dependencies:

```bash
python3 -m http.server 3000
# or: npx serve .
```

Then open <http://localhost:3000>. To publish it, upload these files to any
HTTPS static host — **HTTPS is required**, service workers are disabled on
plain HTTP (localhost is the only exception).

## The proxy server (Wisp)

BW Nexus is only the browser; it still needs a **Wisp server** to carry traffic.
It tries `wss://anura.pro/` (what the official
[Scramjet demo](https://scramjet.mercurywork.shop/) ships) and then
`wss://wisp.mercurywork.shop/`, using the first that completes a WebSocket
handshake, so one blocked host does not brick the app. Both are somebody else's
shared demo servers. For anything permanent, run your own: `wisp/` in this repo
is a ready-to-deploy server built on the current
[`@mercuryworkshop/wisp-js`](https://github.com/MercuryWorkshop/wisp-js) (the
older `wisp-server-node` is deprecated upstream).

```bash
cd wisp
npm install
npm start          # listens on 0.0.0.0:5001
```

Then paste your `wss://` URL into **Settings → Wisp server** in BW Nexus. It is
stored in `localStorage`, so it survives reloads.

A Wisp server must be a long-lived Node process on a public host reachable over
`wss://`. Static hosts (GitHub Pages, S3, Netlify) cannot run it.

### Hosting it with no computer of your own

**Render (free, keeps running):** on [render.com](https://render.com) choose
**New → Blueprint**, pick this repository, and it reads `wisp/render.yaml` and
deploys the service. You get `https://<name>.onrender.com`, so the Wisp URL is
`wss://<name>.onrender.com`. Free instances sleep after ~15 minutes idle, so the
first connection afterwards takes ~50 seconds to wake up.

**GitHub Codespaces (quick test, not real hosting):** open the repo → **Code →
Codespaces → create**. In its terminal:

```bash
cd wisp && npm install && npm start
```

Then open the **Ports** tab, right-click port 5001, **Port Visibility → Public**,
and use `wss://<codespace-name>-5001.app.github.dev`. It genuinely works, but a
codespace stops after ~30 minutes idle and the forwarded hostname changes when it
is rebuilt, so use it for testing rather than daily use.

An open Wisp server is an open proxy: anyone with the URL can route traffic
through it. `wisp/server.mjs` blocks loopback/private/direct-IP targets and caps
concurrent streams; add firewall or rate limits of your own if you publish it.

## Engines

- **Scramjet** — `index.html`, the default engine.
- **Ultraviolet** — `/uv.html`, vendored from
  [`@titaniumnetwork-dev/ultraviolet`](https://github.com/TitaniumNetwork-dev/Ultraviolet) 3.2.10.
  It runs under its own service worker (`/uv/sw.js`, scope `/uv/`) and reads the
  same `bwnexus.*` settings, so a Wisp or Bare server configured once works for
  both. Ultraviolet is deprecated upstream in favour of Scramjet; it is here
  because it was asked for.

## Skipping Wisp entirely (Bare server)

Both engines can talk to a **Bare v3 server** over plain HTTPS instead of Wisp:
put its URL in **Settings → Bare server**. That switches the transport to
`baremod.mjs` (`@mercuryworkshop/bare-as-module3`), so no WebSocket and no Wisp
host is involved at all.

You have to run the Bare server yourself — the public ones I checked are dead or
misconfigured (`https://tomp.app/v3/` answers `x-bare-status: 400`):

```bash
npm i @tomphttp/bare-server-node
npx bare-server-node --port 8080
```

Then use `https://your-host/` as the Bare server URL; the server exposes `/v3/`
itself. Note that `wisp/` is a Wisp server, not a Bare server, so it cannot
substitute for this.

## Shortcuts

| Key | Action |
| --- | --- |
| `/` or `Ctrl/Cmd + L` | Focus the search / address bar |
| `Ctrl/Cmd + ,` | Settings |
| `Alt + ←` / `Alt + →` | Back / forward |
| `Esc` | Close settings, or go back to the home screen |

## Credits

Scramjet, BareMux and Epoxy are by [Mercury Workshop](https://mercurywork.shop)
(LGPL-3.0 / MIT). Vendored files are unmodified upstream builds from npm.
Use this only where you are allowed to.
