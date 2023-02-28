#!/usr/bin/env bash

NEW_CV_VERSION_NAME=$1

packagejson_file_path="package.json"
gradle_file_path="src/android/build-extras.gradle"
pluginxml_file_path="plugin.xml"
constants_file_path="www/Constants.js"

CURRENT_CV_SDK_VERSION=$(sed -n 3p $packagejson_file_path | cut -d '"' -f 4)

CURRENT_ANDROID_VERSION=$(sed -n 22p $gradle_file_path | awk '{print $2}' | awk -F : '{print $3}' | cut -d "'" -f 1)
CURRENT_ANDROID_HYBRID_VERSION=$(sed -n 23p $gradle_file_path | awk '{print $2}' | awk -F : '{print $3}' | cut -d "'" -f 1)

CURRENT_iOS_VERSION=$(sed -n 74p $pluginxml_file_path | awk '{print $3}' | cut -d '"' -f 2)
CURRENT_iOS_HYBRID_VERSION=$(sed -n 75p $pluginxml_file_path | awk '{print $3}' | cut -d '"' -f 2)

LATEST_iOS_VERSION=$(aws s3 ls s3://mobilesdk.useinsider.com/iOS/ --recursive | sort | tail -n 1 | awk '{print $4}' | awk -F / '{print $2}')
LATEST_iOS_HYBRID_VERSION=$(aws s3 ls s3://mobilesdk.useinsider.com/iOSHybrid/ --recursive | sort | tail -n 1 | awk '{print $4}' | awk -F / '{print $2}')

LATEST_ANDROID_VERSION=$(aws s3 ls s3://mobilesdk.useinsider.com/android/com/useinsider/insider/ --recursive | sort | tail -n 1 | awk '{print $4}' | awk -F / '{print $5}' | cut -d "-" -f 1)
LATEST_ANDROID_HYBRID_VERSION=$(aws s3 ls s3://mobilesdk.useinsider.com/android/com/useinsider/insiderhybrid/ --recursive | sort | tail -n 1 | awk '{print $4}' | awk -F / '{print $5}')

# Set new version in plugin.xml
sed -i "s/$CURRENT_CV_SDK_VERSION/$NEW_CV_VERSION_NAME/" $pluginxml_file_path

# Set new sdk version in Constant.js
sed -i "s/$CURRENT_CV_SDK_VERSION/$NEW_CV_VERSION_NAME/" $constants_file_path

# Set new version in package.json
sed -i "s/$CURRENT_CV_SDK_VERSION/$NEW_CV_VERSION_NAME/" $packagejson_file_path

# Set new version in plugin.xml for ios
sed -i "s/$CURRENT_iOS_VERSION/$LATEST_iOS_VERSION/;s/$CURRENT_iOS_HYBRID_VERSION/$LATEST_iOS_HYBRID_VERSION/" $pluginxml_file_path

# Set new version in build.gradle
sed -i "s/$CURRENT_ANDROID_VERSION/$LATEST_ANDROID_VERSION/;s/$CURRENT_ANDROID_HYBRID_VERSION/$LATEST_ANDROID_HYBRID_VERSION/" $gradle_file_path
