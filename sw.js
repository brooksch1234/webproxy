/*
 * BW Nexus — Scramjet service worker.
 *
 * The browser only allows a service worker to be registered from a same-origin
 * script file, so this file has to exist next to index.html. It loads the
 * Scramjet engine bundle and hands every request inside the /scramjet/ prefix
 * to Scramjet; everything else is passed straight to the network.
 *
 * The engine reads its config from the shared "$scramjet" IndexedDB database,
 * which index.html seeds before registering this worker. Config must NOT be
 * pushed in with a postMessage: that sets the worker's config without
 * initialising Scramjet's internal module state, and proxying then fails.
 */

importScripts("/scramjet.all.js");

const { ScramjetServiceWorker } = $scramjetLoadWorker();
const scramjet = new ScramjetServiceWorker();

self.addEventListener("install", () => {
	self.skipWaiting();
});

self.addEventListener("activate", (event) => {
	event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
	event.respondWith(
		(async () => {
			try {
				await scramjet.loadConfig();

				if (scramjet.route(event)) {
					return await scramjet.fetch(event);
				}
			} catch (error) {
				console.error("[BW Nexus] proxy error", error);

				// Only surface proxy failures for proxied pages; anything else
				// (including our own assets) should still fall through to the net.
				if (new URL(event.request.url).pathname.startsWith("/scramjet/")) {
					return new Response(
						"BW Nexus could not load this page.\n\n" +
							(error && error.message ? error.message : String(error)) +
							"\n\nCheck the Wisp server in Settings and try again.",
						{
							status: 502,
							headers: { "content-type": "text/plain; charset=utf-8" },
						}
					);
				}
			}

			return fetch(event.request);
		})()
	);
});
