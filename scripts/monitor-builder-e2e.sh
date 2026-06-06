#!/usr/bin/env bash
# Monitor Ascend builder E2E — rode enquanto testa no browser.
# Uso: ./scripts/monitor-builder-e2e.sh [oauth_session_id] [submission_id]

set -euo pipefail

OAUTH_ID="${1:-}"
SUB_ID="${2:-}"
BUILDER="https://crm-ascend-builder.vercel.app"
CRM="https://crm-ascend-2c1l.vercel.app"
PROV="https://ascend-nuvemshop-provisioner-api.vercel.app"

check() {
  local name="$1" url="$2" extra="${3:-}"
  local code body
  code=$(curl -sS --max-time 12 -o /tmp/mon-body.txt -w "%{http_code}" $extra "$url" 2>/dev/null || echo "000")
  body=$(head -c 120 /tmp/mon-body.txt 2>/dev/null | tr '\n' ' ')
  printf "[%s] %-22s %s  %s\n" "$(date +%H:%M:%S)" "$name" "$code" "$body"
}

echo "=== Monitor E2E (Ctrl+C para parar) ==="
echo "Builder: $BUILDER"
[[ -n "$OAUTH_ID" ]] && echo "OAuth session: $OAUTH_ID"
[[ -n "$SUB_ID" ]] && echo "Submission: $SUB_ID"
echo ""

while true; do
  check "builder" "$BUILDER/"
  check "crm-health" "$CRM/api/health"
  check "provisioner" "$PROV/health"
  check "jobs-route" "$PROV/jobs" "-X POST -H 'Content-Type: application/json' -H 'x-api-key: probe' -d '{}'"
  if [[ -n "$OAUTH_ID" ]]; then
    check "oauth-session" "$BUILDER/api/oauth/session/$OAUTH_ID"
  fi
  if [[ -n "$SUB_ID" ]]; then
    check "provision-status" "$BUILDER/api/provision-status?submission_id=$SUB_ID"
    check "storefront-config" "$CRM/api/builder/storefront-config?submission_id=$SUB_ID"
  fi
  echo "---"
  sleep 8
done
