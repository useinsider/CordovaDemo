'use strict';

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const EXTENSION_TARGETS = ['InsiderNotificationContent', 'InsiderNotificationService'];

// Cordova rewrites platforms/ios/Podfile whenever a plugin is added or removed and drops the
// notification extension targets, which then fail to build without InsiderMobileAdvancedNotification.
module.exports = function (context) {
    const platforms = context.opts.platforms || [];
    if (platforms.length > 0 && !platforms.includes('ios')) {
        return;
    }

    const podfile = path.join(context.opts.projectRoot, 'platforms', 'ios', 'Podfile');

    if (!fs.existsSync(podfile)) {
        return;
    }

    const iosDir = path.dirname(podfile);
    const project = fs.readdirSync(iosDir).find((entry) => entry.endsWith('.xcodeproj'));
    const pbxproj = project ? fs.readFileSync(path.join(iosDir, project, 'project.pbxproj'), 'utf8') : '';
    const content = fs.readFileSync(podfile, 'utf8');
    // A freshly added platform has no extension targets yet, and pod install fails on a target it cannot find.
    const absent = EXTENSION_TARGETS.filter((target) => !pbxproj.includes(`name = ${target};`));
    if (absent.length > 0) {
        console.warn(`[ios-extension-pods] ${absent.join(', ')} not in the Xcode project: rich push will not work. ` +
            'Run `ruby scripts/ios-extension-targets.rb`, then `cordova prepare ios`.');
    }
    const missing = EXTENSION_TARGETS.filter((target) =>
        !content.includes(`target '${target}'`) && !absent.includes(target));

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
