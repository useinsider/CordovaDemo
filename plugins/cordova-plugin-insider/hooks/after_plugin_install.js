"use strict";

var FSUtils = require("./FSUtils");

var ROOT_BUILD_GRADLE_FILE = "platforms/android/build.gradle";
var ROOT_REPOSITORIES_GRADLE_FILE = "platforms/android/repositories.gradle";
var APP_REPOSITORIES_GRADLE_FILE = "platforms/android/app/repositories.gradle";
var COMMENT = "//This line is added by cordova-plugin-insider plugin";
var NEW_LINE = "\n";

module.exports = function (context) {
    if (!FSUtils.exists(ROOT_BUILD_GRADLE_FILE)) {
        console.log("root gradle file does not exist. after_plugin_install script wont be executed.");
    }

    var rootGradleContent = FSUtils.readFile(ROOT_BUILD_GRADLE_FILE, "UTF-8");
    var lines = rootGradleContent.split(NEW_LINE);

    var depAddedLines = addAGConnectDependency(lines);
    var repoAddedLines = addHuaweiRepo(depAddedLines);

    FSUtils.writeFile(ROOT_BUILD_GRADLE_FILE, repoAddedLines.join(NEW_LINE));

    updateRepositoriesGradle(ROOT_REPOSITORIES_GRADLE_FILE);
    updateRepositoriesGradle(APP_REPOSITORIES_GRADLE_FILE);
};

function addAGConnectDependency(lines) {
    var AG_CONNECT_DEPENDENCY = "classpath 'com.huawei.agconnect:agcp:1.6.2.300' " + COMMENT;
    var pattern = /(\s*)classpath(\s+)[\',\"]com.android.tools.build:gradle.*[^\]\n]/m;
    var index;

    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        if (pattern.test(line)) {
            index = i;
            break;
        }
    }

    lines.splice(index + 1, 0, AG_CONNECT_DEPENDENCY);
    return lines;
}

function addHuaweiRepo(lines) {
    var HUAWEI_REPO = "maven { url 'https://developer.huawei.com/repo/' } " + COMMENT;
    var pattern = /(\s*)jcenter\(\)/m;
    var indexList = [];

    for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        if (pattern.test(line)) {
            indexList.push(i);
        }
    }

    for (var i = 0; i < indexList.length; i++) {
        lines.splice(indexList[i] + 1, 0, HUAWEI_REPO);
        if (i < indexList.length - 1) {
            indexList[i + 1] = indexList[i + 1] + 1;
        }
    }

    return lines;
}

function updateRepositoriesGradle(file) {
    if (FSUtils.exists(file)) {
        var repoGradleContent = FSUtils.readFile(file, "UTF-8");
        if (repoGradleContent.indexOf("developer.huawei.com/repo") === -1) {
            var lastIndexOfCurlyBracket = repoGradleContent.lastIndexOf("}");

            repoGradleContent =
                repoGradleContent.substring(0, lastIndexOfCurlyBracket) +
                "    maven { url 'https://developer.huawei.com/repo/' } "+COMMENT+" \n}" +
                repoGradleContent.substring(lastIndexOfCurlyBracket + 1);

            FSUtils.writeFile(file, repoGradleContent);
        }
    }
}
