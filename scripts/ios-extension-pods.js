'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const EXTENSION_TARGETS = ['InsiderNotificationContent', 'InsiderNotificationService'];

// Cordova rewrites platforms/ios/Podfile whenever a plugin is added or removed and drops the
// notification extension targets, which then fail to build without InsiderMobileAdvancedNotification.
module.exports = function (context) {
    const podfile = path.join(context.opts.projectRoot, 'platforms', 'ios', 'Podfile');

    if (!fs.existsSync(podfile)) {
        return;
    }

    const content = fs.readFileSync(podfile, 'utf8');
    const missing = EXTENSION_TARGETS.filter((target) => !content.includes(`target '${target}'`));

    if (missing.length === 0) {
        return;
    }

    const blocks = missing.map((target) => [
        '',
        `target '${target}' do`,
        '  inherit! :search_paths',
        '  pod "InsiderMobileAdvancedNotification"',
        'end',
    ].join('\n'));

    fs.writeFileSync(podfile, content.trimEnd() + '\n' + blocks.join('\n') + '\n');

    execSync('pod install', { cwd: path.dirname(podfile), stdio: 'inherit' });
};
