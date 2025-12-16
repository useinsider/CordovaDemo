#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<EOF
Kullanım: $(basename "$0") -c channel -m <message> -u <user> -k <key> [opsiyonlar]

Zorunlu:
  -c, --channel    Slack channel (Örn: "#mobile-sdk-automation")
  -m, --message    Slack message
  -u, --user       Slack user
  -k, --key        Slack API key

Opsiyonel:
  --endpoint       Slack API endpoint URL
  --dry-run        Komutları yazdır, çalıştırma

Örnekler:
  $(basename "$0") --channel "#mobile-sdk" --message "Some message" --user "XCGTEDH" --key "ABC123" --dry-run
EOF
}

SLACK_CHANNEL=""
SLACK_MESSAGE=""
SLACK_USER=""
SLACK_API_KEY=""
SLACK_API_ENDPOINT=""
DRY_RUN="false"

# Check validity of arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    -c|--channel) SLACK_CHANNEL="$2"; shift 2;;
    -m|--message) SLACK_MESSAGE="$2"; shift 2;;
    -u|--user) SLACK_USER="$2"; shift 2;;
    -k|--key) SLACK_API_KEY="$2"; shift 2;;
    -e|--endpoint) SLACK_API_ENDPOINT="$2"; shift 2;;
    --dry-run) DRY_RUN="true"; shift;;
    -h|--help) usage; exit 0;;
    *) echo "⛔ Error: Bilinmeyen argüman: $1"; usage; exit 1;;
  esac
done

if [[ -z "${SLACK_CHANNEL}" || -z "${SLACK_MESSAGE}" || -z "${SLACK_USER}" || -z "${SLACK_API_KEY}" ]]; then
  echo "⛔ Error: --channel --message --user --key zorunludur."
  usage; exit 1
fi

if [[ -z "${SLACK_API_ENDPOINT}" ]]; then
  SLACK_API_ENDPOINT="https://mobile.useinsider.com/api/lilith/slack_notifier"
fi

# Dry run method
run() {
  echo "+ $*"
  if [[ "${DRY_RUN}" == "false" ]]; then
    eval "$@"
  fi
}

generate_post_data() {
  cat <<EOF
{
  "auth_key": "${SLACK_API_KEY}",
  "channel": "${SLACK_CHANNEL}",
  "message": "${SLACK_MESSAGE}",
  "username": "${SLACK_USER}"
}
EOF
}

run "curl -i -H \"Content-Type: application/json\" -X \"POST\" --data '$(generate_post_data)' \"${SLACK_API_ENDPOINT}\""
