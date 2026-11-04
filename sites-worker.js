/*
 * BW Nexus on Freebuff Sites: a pass-through Worker over the static bundle.
 * BW Nexus is entirely client-side (service workers + WASM rewriter), so the
 * only server job is serving those files with sane caching.
 */
export default {
	async fetch(request, env) {
		const response = await env.ASSETS.fetch(request);
		const url = new URL(request.url);

		// Entry documents and both service workers must never be served stale,
		// otherwise a browser keeps an old worker and the engine silently breaks.
		// "/uv" is where the assets layer redirects uv.html, so it needs the
		// same rule as the .html path it came from.
		const uncached =
			url.pathname === "/" ||
			url.pathname === "/uv" ||
			url.pathname.endsWith(".html") ||
			url.pathname === "/sw.js" ||
			url.pathname === "/uv/sw.js";

		if (uncached) {
			const headers = new Headers(response.headers);
			headers.set("cache-control", "no-cache, must-revalidate");
			return new Response(response.body, {
				status: response.status,
				statusText: response.statusText,
				headers,
			});
		}

		return response;
	},
};
