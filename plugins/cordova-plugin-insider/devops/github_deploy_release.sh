#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<EOF
Kullanım: $(basename "$0") -p <package> [opsiyonlar]

Zorunlu:
  -p, --package    Örn: /path/to/cordova-plugin-insider-3.0.0.tgz

Opsiyonel:
  -t, --title <string>     Release başlığı (yok ise version kullanılır)
  --notes-file <path>      Notları dosyadan al (--generate-notes devre dışı)
  --no-notes               Not ekleme veya oluşturma
  --dry-run                Komutları yazdır, çalıştırma

Örnekler:
  $(basename "$0") -p /path/to/cordova-plugin-insider-3.0.0.tgz --dry-run
  $(basename "$0") -p /path/to/cordova-plugin-insider-3.0.0.tgz --title "Release 3.0.0" --notes-file /path/to/CHANGELOG.md
EOF
}

LIBRARY_ZIP=""
DRY_RUN="false"
RELEASE_NOTES_FILE=""
RELEASE_NO_NOTES="false"
RELEASE_TITLE=""

# Check validity of arguments
while [[ $# -gt 0 ]]; do
  case "$1" in
    -p|--package) LIBRARY_ZIP="$2"; shift 2;;
    -t|--title) RELEASE_TITLE="$2"; shift 2;;
    --notes-file) RELEASE_NOTES_FILE="$2"; shift 2;;
    --no-notes) RELEASE_NO_NOTES="true"; shift;;
    --dry-run) DRY_RUN="true"; shift;;
    -h|--help) usage; exit 0;;
    *) echo "⛔ Error: Bilinmeyen argüman: $1"; usage; exit 1;;
  esac
done

if [[ -z "${LIBRARY_ZIP}" ]]; then
  echo "⛔ Error: --package zorunludur."
  usage; exit 1
fi

# Dry run method
run() {
  echo "+ $*"
  if [[ "${DRY_RUN}" == "false" ]]; then
    eval "$@"
  fi
}

PROJECT_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
PACKAGE_FILE_NAME="package.json"
CURRENT_VERSION_NUMBER="$(sed -nE 's/^[[:space:]]*"version"[[:space:]]*:[[:space:]]*"([^"]+)".*/\1/p' "${PROJECT_ROOT}/${PACKAGE_FILE_NAME}" | head -n1)"

echo "ℹ️ (Github) Güncel versiyon: ${CURRENT_VERSION_NUMBER}"

if gh release view "${CURRENT_VERSION_NUMBER}" >/dev/null 2>&1; then
  if [[ "${DRY_RUN}" == "false" ]]; then
    echo "⛔ (Github) Error: Bu version halihazırda mevcut: ${CURRENT_VERSION_NUMBER}"
    exit 1
  else
    echo "⚠️ (Github) Warning: Bu version halihazırda mevcut: ${CURRENT_VERSION_NUMBER} (dry-run modunda atlanıyor.)"
  fi
fi

RELEASE_EXTRA_FLAGS=""

if [[ -z "${RELEASE_TITLE}" ]]; then
  RELEASE_EXTRA_FLAGS+="--title \"${CURRENT_VERSION_NUMBER}\""
else
  RELEASE_EXTRA_FLAGS+="--title \"${RELEASE_TITLE}\""
fi

if [[ "${RELEASE_NO_NOTES}" == "true" ]]; then
  RELEASE_EXTRA_FLAGS+=" --notes \"\""
elif [[ -n "${RELEASE_NOTES_FILE}" ]]; then
  if [[ ! -f "${RELEASE_NOTES_FILE}" ]]; then
    echo "⛔ (Github) Error: Not dosyası bulunamadı: ${RELEASE_NOTES_FILE}"
    exit 1
  fi
  RELEASE_EXTRA_FLAGS+=" --notes-file \"${RELEASE_NOTES_FILE}\""
else
  RELEASE_EXTRA_FLAGS+=" --generate-notes"
fi

run "gh release create \"${CURRENT_VERSION_NUMBER}\" ${RELEASE_EXTRA_FLAGS}"

echo "📦 (Github) Sürüm pakedi yükleniyor: ${LIBRARY_ZIP}"
if [[ -f "${LIBRARY_ZIP}" ]]; then
  run "gh release upload \"${CURRENT_VERSION_NUMBER}\" \"${LIBRARY_ZIP}\" --clobber"
else
  echo "⚠️ (Github) Warning: Asset bulunamadı, atlanıyor: ${LIBRARY_ZIP}"
fi
echo "✅ (Github) Deployment tamamlandı: ${CURRENT_VERSION_NUMBER}"