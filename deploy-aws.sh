#!/usr/bin/env bash
#
# Upload BW Nexus to an S3 bucket.
#
#   ./deploy-aws.sh <bucket> [cloudfront-distribution-id]
#
# Requires the AWS CLI, configured with credentials that can write to the
# bucket. Remember to serve the bucket over HTTPS (CloudFront), otherwise the
# service worker will not register.

set -euo pipefail

BUCKET="${1:-}"
DISTRIBUTION="${2:-}"

if [ -z "$BUCKET" ]; then
	echo "usage: $0 <bucket-name> [cloudfront-distribution-id]" >&2
	exit 1
fi

cd "$(dirname "$0")"

# file -> content type
files=(
	"index.html:text/html; charset=utf-8"
	"sw.js:text/javascript; charset=utf-8"
	"scramjet.all.js:text/javascript; charset=utf-8"
	"scramjet.sync.js:text/javascript; charset=utf-8"
	"mux.js:text/javascript; charset=utf-8"
	"baremux.mjs:text/javascript; charset=utf-8"
	"epoxy.mjs:text/javascript; charset=utf-8"
	"scramjet.wasm.wasm:application/wasm"
)

for entry in "${files[@]}"; do
	file="${entry%%:*}"
	type="${entry#*:}"

	if [ ! -f "$file" ]; then
		echo "missing $file" >&2
		exit 1
	fi

	# index.html and sw.js must never be served stale; the rest are versioned.
	cache="public, max-age=31536000, immutable"
	if [ "$file" = "index.html" ] || [ "$file" = "sw.js" ]; then
		cache="no-cache"
	fi

	echo "uploading $file"
	aws s3 cp "$file" "s3://$BUCKET/$file" \
		--content-type "$type" \
		--cache-control "$cache"
done

if [ -n "$DISTRIBUTION" ]; then
	echo "invalidating CloudFront distribution $DISTRIBUTION"
	aws cloudfront create-invalidation \
		--distribution-id "$DISTRIBUTION" \
		--paths "/*" \
		--query 'Invalidation.Id' \
		--output text
fi

echo "done: s3://$BUCKET"
