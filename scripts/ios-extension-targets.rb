# `cordova platform add ios` creates the Xcode project without the notification extension targets.
# Run `ruby scripts/ios-extension-targets.rb` after it, then `cordova prepare ios` to install their pods.
require 'xcodeproj'

ios_dir = File.expand_path('../platforms/ios', __dir__)
project_path = Dir.glob(File.join(ios_dir, '*.xcodeproj')).first or abort("no Xcode project in #{ios_dir}")
project = Xcodeproj::Project.open(project_path)
app = project.targets.find { |t| t.product_type == 'com.apple.product-type.application' } or abort('no app target')
app_settings = app.build_configurations.first.build_settings
deployment = app_settings['IPHONEOS_DEPLOYMENT_TARGET']

specs = {
  'InsiderNotificationService' => { sources: %w[NotificationService.m], headers: %w[NotificationService.h],
                                    storyboards: [], frameworks: [] },
  'InsiderNotificationContent' => { sources: %w[NotificationViewController.m], headers: %w[NotificationViewController.h],
                                    storyboards: %w[MainInterface.storyboard], frameworks: %w[UserNotifications UserNotificationsUI] },
}

embed = app.copy_files_build_phases.find { |p| p.name == 'Embed Foundation Extensions' } ||
        app.new_copy_files_build_phase('Embed Foundation Extensions').tap { |p| p.symbol_dst_subfolder_spec = :plug_ins }

def apply_settings(target, name, app_settings, deployment)
  target.build_configurations.each do |c|
    s = c.build_settings
    s['PRODUCT_NAME'] = '$(TARGET_NAME)'
    s['PRODUCT_BUNDLE_IDENTIFIER'] = "#{app_settings['PRODUCT_BUNDLE_IDENTIFIER']}.#{name}"
    s['INFOPLIST_FILE'] = "#{name}/Info.plist"
    s['GENERATE_INFOPLIST_FILE'] = 'YES'
    s['CODE_SIGN_ENTITLEMENTS'] = "#{name}/#{name}.entitlements"
    s['INFOPLIST_KEY_CFBundleDisplayName'] = name
    s['MARKETING_VERSION'] = app_settings['MARKETING_VERSION'] if app_settings['MARKETING_VERSION']
    s['CURRENT_PROJECT_VERSION'] = app_settings['CURRENT_PROJECT_VERSION'] if app_settings['CURRENT_PROJECT_VERSION']
    s['IPHONEOS_DEPLOYMENT_TARGET'] = deployment
    s['TARGETED_DEVICE_FAMILY'] = '1,2'
    s['SKIP_INSTALL'] = 'YES'
    s['CODE_SIGN_STYLE'] = 'Automatic'
    s['DEVELOPMENT_TEAM'] = app_settings['DEVELOPMENT_TEAM'] if app_settings['DEVELOPMENT_TEAM']
    s['LD_RUNPATH_SEARCH_PATHS'] = ['$(inherited)', '@executable_path/Frameworks', '@executable_path/../../Frameworks']
  end
end

specs.each do |name, spec|
  existing = project.targets.find { |t| t.name == name }
  if existing
    apply_settings(existing, name, app_settings, deployment)
    group = project.main_group.find_subpath(name, false)
    if group && group.files.none? { |f| f.path == "#{name}.entitlements" }
      group.new_reference("#{name}.entitlements")
    end
    puts "#{name}: already in #{File.basename(project_path)}, build settings refreshed"
    next
  end
  abort("#{name}: sources missing in #{ios_dir}/#{name}") unless Dir.exist?(File.join(ios_dir, name))

  target = project.new_target(:app_extension, name, :ios, deployment, nil, :objc)
  group = project.main_group.find_subpath(name, true)
  group.set_source_tree('<group>')
  group.set_path(name)
  spec[:headers].each { |h| group.new_reference(h) }
  group.new_reference('Info.plist')
  group.new_reference("#{name}.entitlements")
  target.add_file_references(spec[:sources].map { |s| group.new_reference(s) })
  spec[:storyboards].each do |sb|
    variant = group.new_variant_group(sb)
    variant.new_reference("Base.lproj/#{sb}").name = 'Base'
    target.resources_build_phase.add_file_reference(variant)
  end
  spec[:frameworks].each do |fw|
    target.frameworks_build_phase.add_file_reference(
      project.frameworks_group.new_file("System/Library/Frameworks/#{fw}.framework", :sdk_root))
  end

  apply_settings(target, name, app_settings, deployment)
  app.add_dependency(target)
  embed.add_file_reference(target.product_reference, true).settings = { 'ATTRIBUTES' => ['RemoveHeadersOnCopy'] }
  puts "#{name}: added"
end

project.save
