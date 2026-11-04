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

## The proxy server

BW Nexus is the browser; it still needs a Wisp server to carry traffic. The
default is the free public instance `wss://wisp.mercurywork.shop/`. It is rate
limited and shared — for a permanent deployment run your own:

```bash
npm i wisp-server-node
```

...attach it to any Node/Wisp host, then put your `wss://` URL in
**Settings → Wisp server** inside BW Nexus (it is stored in `localStorage`).

## Hosting on Amazon S3 (+ CloudFront)

The site is plain static files, so an S3 bucket is enough for storage — but S3's
website endpoint (`http://…s3-website-….amazonaws.com`) is **HTTP-only**, and the
service worker needs a secure context. Put CloudFront (or Cloudflare) in front
of the bucket, or the engine will fail to boot with a connection error.

```bash
aws s3 mb s3://bw-nexus-example
aws s3 website s3://bw-nexus-example --index-document index.html
```

Allow public reads with a bucket policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicRead",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::bw-nexus-example/*"
    }
  ]
}
```

```bash
aws s3api put-bucket-policy --bucket bw-nexus-example --policy file://policy.json
./deploy-aws.sh bw-nexus-example                 # upload every file
./deploy-aws.sh bw-nexus-example E1234ABCDEF     # upload + bust the CDN cache
```

`deploy-aws.sh` uploads each file with the content type browsers expect
(`.wasm` → `application/wasm`, `.js`/`.mjs` → `text/javascript`), leaves
`index.html` and `sw.js` uncached, and caches the engine files for a year. Then
create a CloudFront distribution pointing at the bucket with default root
object `index.html` and "Redirect HTTP to HTTPS".

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
