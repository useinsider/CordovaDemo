'use strict';

const fs = require('fs');
const path = require('path');

const EXTENSION_TARGETS = ['InsiderNotificationContent', 'InsiderNotificationService'];

// `cordova platform add ios` creates the Xcode project without the notification extensions; the build still passes.
module.exports = function (context) {
    const platforms = context.opts.platforms || [];
    if (platforms.length > 0 && !platforms.includes('ios')) {
        return;
    }

    const iosDir = path.join(context.opts.projectRoot, 'platforms', 'ios');
    if (!fs.existsSync(iosDir)) {
        return;
    }

    const project = fs.readdirSync(iosDir).find((entry) => entry.endsWith('.xcodeproj'));
    const pbxproj = project ? fs.readFileSync(path.join(iosDir, project, 'project.pbxproj'), 'utf8') : '';
    const absent = EXTENSION_TARGETS.filter((target) => !pbxproj.includes(`name = ${target};`));

    if (absent.length > 0) {
        console.warn(`[ios-extension-check] ${absent.join(', ')} not in the Xcode project: rich push will not work. ` +
            'Run `ruby scripts/ios-extension-targets.rb`.');
    }
};
