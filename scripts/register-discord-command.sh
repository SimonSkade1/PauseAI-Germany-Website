#!/usr/bin/env bash
set -euo pipefail

COMMAND_NAME="${COMMAND_NAME:-Karma vergeben}"
ENV_FILE="${ENV_FILE:-.env.local}"

if [[ -f "${ENV_FILE}" ]]; then
  # Load env vars from file without requiring users to source manually.
  set -a
  # shellcheck disable=SC1090
  source "${ENV_FILE}"
  set +a
fi

APP_ID="${APP_ID:-${DISCORD_CLIENT_ID:-}}"

required_vars=(
  DISCORD_TOKEN
  APP_ID
  GUILD_ID
)

for var in "${required_vars[@]}"; do
  if [[ -z "${!var:-}" ]]; then
    echo "Missing required env var: $var" >&2
    echo "Usage:" >&2
    echo "  DISCORD_TOKEN=... APP_ID=... GUILD_ID=... $0" >&2
    echo "  or keep them in ${ENV_FILE} and run: $0" >&2
    echo "Optional:" >&2
    echo "  COMMAND_NAME='Karma vergeben'" >&2
    echo "  ENV_FILE=.env.local" >&2
    exit 1
  fi
done

echo "Registering message command '${COMMAND_NAME}' in guild ${GUILD_ID}..."

register_response="$(
  curl -sS -X POST "https://discord.com/api/v10/applications/${APP_ID}/guilds/${GUILD_ID}/commands" \
    -H "Authorization: Bot ${DISCORD_TOKEN}" \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"${COMMAND_NAME}\",\"type\":3}"
)"

echo "Register response:"
echo "${register_response}"
echo

echo "Current guild commands:"
curl -sS -X GET "https://discord.com/api/v10/applications/${APP_ID}/guilds/${GUILD_ID}/commands" \
  -H "Authorization: Bot ${DISCORD_TOKEN}"
echo
