#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<EOF
Kullanım: $(basename "$0") -v <version> [opsiyonlar]

Zorunlu:
  -v, --version <semver>   Örn: 3.0.1 (release branch adı olabilir)

Opsiyonel:
  -c, --commit             (değişiklikler commit edilsin mi?)

Örnekler:
  $(basename "$0") -v 3.0.1
  $(basename "$0") --version 3.0.1 --commit
EOF
}

NEW_VERSION_NUMBER=""
COMMIT_CHANGES="false"
CHANGED_FILES=()

while [[ $# -gt 0 ]]; do
  case "$1" in
    -v|--version) NEW_VERSION_NUMBER="$2"; shift 2;;
    -c|--commit) COMMIT_CHANGES="true"; shift;;
    -h|--help) usage; exit 0;;
    *) echo "⛔ Error: Bilinmeyen argüman: $1"; usage; exit 1;;
  esac
done

if [[ -z "${NEW_VERSION_NUMBER}" ]]; then
  echo "⛔ Error: --version zorunludur."
  usage; exit 1
fi

PROJECT_ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"

PACKAGE_FILE_NAME="package.json"
PACKAGE_LOCK_FILE_NAME="package-lock.json"
PLUGIN_FILE_NAME="plugin.xml"
GRADLE_FILE_NAME="src/android/build-extras.gradle"
CONSTANTS_FILE_NAME="js/Constants.js"

echo "ℹ️ Versiyon güncelleme başlatıldı: ${PROJECT_ROOT}"
CURRENT_VERSION_NUMBER="$(sed -nE 's/^[[:space:]]*"version"[[:space:]]*:[[:space:]]*"([^"]+)".*/\1/p' "${PROJECT_ROOT}/${PACKAGE_FILE_NAME}" | head -n1)"

echo "ℹ️ Güncel versiyon: ${CURRENT_VERSION_NUMBER}"

PACKAGE_SED_EXPRESSION="s/(\"version\"[[:space:]]*:[[:space:]]*\")[^\"]+(\")/\1${NEW_VERSION_NUMBER}\2/"
if [[ "$OSTYPE" == darwin* ]]; then
  sed -i '' -E "${PACKAGE_SED_EXPRESSION}" "${PROJECT_ROOT}/${PACKAGE_FILE_NAME}"
else
  sed -i -E "${PACKAGE_SED_EXPRESSION}" "${PROJECT_ROOT}/${PACKAGE_FILE_NAME}"
fi

PLUGIN_SED_EXPRESSION="s/(<plugin[^>]*id=\"cordova-plugin-insider\"[^>]*version=\")[^\"]+/\1${NEW_VERSION_NUMBER}/"
if [[ "$OSTYPE" == darwin* ]]; then
  sed -i '' -E "${PLUGIN_SED_EXPRESSION}" "${PROJECT_ROOT}/${PLUGIN_FILE_NAME}"
else
  sed -i -E "${PLUGIN_SED_EXPRESSION}" "${PROJECT_ROOT}/${PLUGIN_FILE_NAME}"
fi

CONSTANTS_SED_EXPRESSION="/SDK_VERSION:/ s/(SDK_VERSION:[[:space:]]*['\"]CDV-)[^'\"]+/\1${NEW_VERSION_NUMBER}/"
if [[ "$OSTYPE" == darwin* ]]; then
  sed -i '' -E "${CONSTANTS_SED_EXPRESSION}" "${PROJECT_ROOT}/${CONSTANTS_FILE_NAME}"
else
  sed -i -E "${CONSTANTS_SED_EXPRESSION}" "${PROJECT_ROOT}/${CONSTANTS_FILE_NAME}"
fi

PACKAGE_LOCK="$(jq --arg v "${NEW_VERSION_NUMBER}" \
  '.version=$v | if (.packages and .packages[""]) then .packages[""].version=$v else . end' \
  "${PROJECT_ROOT}/${PACKAGE_LOCK_FILE_NAME}")"

echo "${PACKAGE_LOCK}" > "${PROJECT_ROOT}/${PACKAGE_LOCK_FILE_NAME}"

read_iOS_SDK_version_from_podspec() {
  version=$(pod trunk info "${1}" 2>/dev/null \
    | sed -nE 's/^[[:space:]]*-[[:space:]]*([^[:space:]]+)[[:space:]]*\(([^)]+)\).*/\2|\1/p' \
    | awk -F'|' '$2 !~ /-/' \
    | sort -t'|' -k1,1r \
    | head -n1 \
    | cut -d'|' -f2
  )
  echo "${version}"
}

apply_iOS_SDK_version_in_podspec() {
  local podspec_path="${PROJECT_ROOT}/${PLUGIN_FILE_NAME}"
  local module=$1
  local new_version=$2
  local expression="s@(<pod[^>]*name=\"${module}\"[^>]*[[:space:]]spec=\")[^\"]+@\1${new_version}@"
  if [[ "$OSTYPE" == darwin* ]]; then
    sed -i '' -E "${expression}" "${podspec_path}"
  else
    sed -i -E "${expression}" "${podspec_path}"
  fi
}

read_android_SDK_version_from_maven() {
  local url="https://mobilesdk.useinsider.com/android/com/useinsider/${1}/maven-metadata.xml"
  local version=$(
    curl -fsSL "${url}" \
    | tr -d '\n' \
    | sed -nE 's/.*<release>[[:space:]]*([^<[:space:]]+)[[:space:]]*<\/release>.*/\1/p' \
    | head -1
  )
  echo "${version}"
}

apply_android_SDK_version_in_maven() {
  local gradle_path="${PROJECT_ROOT}/${GRADLE_FILE_NAME}"
  local module=$1
  local new_version=$2
  local expression="s/^([[:space:]]*(implementation|api|compileOnly|runtimeOnly)[[:space:]]+['\"]com\.useinsider:${module}:)[^'\" ]+(['\"])/\1${new_version}\3/"
  if [[ "$OSTYPE" == darwin* ]]; then
    sed -i '' -E "${expression}" "${gradle_path}"
  else
    sed -i -E "${expression}" "${gradle_path}"
  fi
}

IOS_FRAMEWORKS=("InsiderMobile" "InsiderGeofence" "InsiderHybrid")
for IOS_FRAMEWORK in "${IOS_FRAMEWORKS[@]}"; do
  IOS_CURRENT_VERSION_NUMBER=$(read_iOS_SDK_version_from_podspec "${IOS_FRAMEWORK}")
  apply_iOS_SDK_version_in_podspec "${IOS_FRAMEWORK}" "${IOS_CURRENT_VERSION_NUMBER}"
  echo "✅ iOS (${IOS_FRAMEWORK}) versiyonu güncellendi: ${IOS_CURRENT_VERSION_NUMBER}"
done

ANDROID_LIBRARIES=("insider" "insiderhybrid")
for ANDROID_LIBRARY in "${ANDROID_LIBRARIES[@]}"; do
  ANDROID_CURRENT_VERSION_NUMBER=$(read_android_SDK_version_from_maven "${ANDROID_LIBRARY}")
  apply_android_SDK_version_in_maven "${ANDROID_LIBRARY}" "${ANDROID_CURRENT_VERSION_NUMBER}"
  echo "✅ Android (${ANDROID_LIBRARY}) versiyonu güncellendi: ${ANDROID_CURRENT_VERSION_NUMBER}"
done

echo "✅ Yeni versiyona güncellendi: ${NEW_VERSION_NUMBER}"

CHANGED_FILES+=("${PROJECT_ROOT}/${PACKAGE_FILE_NAME}")
CHANGED_FILES+=("${PROJECT_ROOT}/${PACKAGE_LOCK_FILE_NAME}")
CHANGED_FILES+=("${PROJECT_ROOT}/${GRADLE_FILE_NAME}")
CHANGED_FILES+=("${PROJECT_ROOT}/${PLUGIN_FILE_NAME}")
CHANGED_FILES+=("${PROJECT_ROOT}/${CONSTANTS_FILE_NAME}")

if [[ "${COMMIT_CHANGES}" == "true" ]]; then
  if git rev-parse --git-dir > /dev/null 2>&1; then
    echo "ℹ️ Git commit hazırlanıyor..."
    if [ ${#CHANGED_FILES[@]} -gt 0 ]; then
      git add "${CHANGED_FILES[@]}"
      if git diff --cached --quiet; then
        echo "ℹ️ Commitlenecek değişiklik bulunamadı, işlem atlanıyor."
      else
        git commit -m "release: update version to ${NEW_VERSION_NUMBER}"
        echo "✅ Git commit oluşturuldu."
      fi
    else
      echo "ℹ️ Commitlenecek dosya bulunamadı, işlem atlanıyor."
    fi
  else
    echo "⛔ Error: Git repo değil, commit atlanıyor."
  fi
fi