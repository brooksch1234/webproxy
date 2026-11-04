// Assembles the Freebuff Sites deployment: static public/ + pass-through Worker.
import { cp, mkdir, rm, writeFile, readdir, stat } from "node:fs/promises";
import { join, dirname } from "node:path";

const OUT = "dist";

// Everything the browser needs. Not wisp/ (a Node server), not docs or zips.
const FILES = [
	"index.html",
	"uv.html",
	"sw.js",
	"mux.js",
	"baremux.mjs",
	"epoxy.mjs",
	"baremod.mjs",
	"scramjet.all.js",
	"scramjet.sync.js",
	"scramjet.wasm.wasm",
	"uv/uv.bundle.js",
	"uv/uv.sw.js",
	"uv/uv.handler.js",
	"uv/uv.client.js",
	"uv/uv.config.js",
	"uv/sw.js",
];

await rm(OUT, { recursive: true, force: true });
await mkdir(join(OUT, "public"), { recursive: true });

let total = 0;
for (const file of FILES) {
	const target = join(OUT, "public", file);
	await mkdir(dirname(target), { recursive: true });
	await cp(file, target);
	const info = await stat(target);
	total += info.size;
}

await cp("sites-worker.js", join(OUT, "worker.js"));

const manifest = {
	entrypoint: "worker.js",
	compatibilityDate: "2026-11-01",
	modules: [{ name: "worker.js", type: "esm", path: "./worker.js" }],
	assetsDirectory: "./public",
};
await writeFile(join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");

const files = await readdir(join(OUT, "public"));
console.log(`built ${FILES.length} assets (${(total / 1024 / 1024).toFixed(2)} MiB) into ${OUT}/public`);
console.log("top level:", files.join(", "));
