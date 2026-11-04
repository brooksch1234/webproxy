/*
 * BW Nexus - Ultraviolet service worker.
 * Registered at /uv/sw.js with scope /uv/, so it owns /uv/* and leaves the
 * Scramjet worker (scope /) to handle everything else.
 */
importScripts("/uv/uv.bundle.js");
importScripts("/uv/uv.config.js");
importScripts("/uv/uv.sw.js");

const uv = new UVServiceWorker();

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));

self.addEventListener("fetch", (event) => {
	event.respondWith(
		(async () => {
			try {
				if (uv.route(event)) return await uv.fetch(event);
			} catch (error) {
				console.error("[BW Nexus] ultraviolet error", error);
			}
			return fetch(event.request);
		})()
	);
});
