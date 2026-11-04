/*
 * BW Nexus — Wisp server.
 *
 * A Wisp server carries the proxy traffic for BW Nexus. It is a long-lived
 * Node process holding raw TCP sockets, so it needs a host that can run Node
 * (Render, Fly, Railway, a VPS) — static hosts such as GitHub Pages or S3
 * cannot run it.
 *
 *   npm install
 *   npm start
 *
 * Deployed hosts pass PORT; locally it listens on 5001.
 */

import http from "node:http";
import { server as wisp } from "@mercuryworkshop/wisp-js/server";

const port = Number(process.env.PORT || 5001);
const host = process.env.HOST || "0.0.0.0";

// An open Wisp server is an open proxy, so keep it away from anything internal
// and cap how much a single client can open.
wisp.options.allow_loopback_ips = false;
wisp.options.allow_private_ips = false;
wisp.options.allow_direct_ip = false;
wisp.options.stream_limit_per_host = 64;
wisp.options.stream_limit_total = 256;

const server = http.createServer((req, res) => {
	if (req.url === "/" || req.url === "/healthz") {
		res.writeHead(200, {
			"content-type": "text/plain; charset=utf-8",
			"cache-control": "no-store",
		});
		res.end(
			"BW Nexus Wisp server is running.\n" +
				"Use this host as a wss:// URL in BW Nexus → Settings → Wisp server.\n"
		);
		return;
	}

	res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
	res.end("Not found\n");
});

server.on("upgrade", (request, socket, head) => {
	wisp.routeRequest(request, socket, head);
});

server.on("error", (error) => {
	console.error("[wisp] server error:", error);
	process.exit(1);
});

server.listen(port, host, () => {
	console.log(`[wisp] listening on ${host}:${port}`);
});
