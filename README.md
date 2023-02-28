# Insider Cordova Demo

<p align="center">
  <img src="assets/insider-logo-read-me.jpg">

  <table align="center">
    <tr>
      <td><a href="https://useinsider.com/"> Insider </a></td>
      <td><a href="https://www.npmjs.com/package/cordova-plugin-insider/"> NPM JS cordova-plugin-insider </a></td>
      <td><a href="https://academy.useinsider.com/docs/cordova-integration"> InsiderAcademy </a></td>
    </tr>
  </table>
</p>  

## Description

This Demo contains simple methods that you can use with the Insider SDK.

## Preview

<table align="center">
  <tbody>
    <tr>
      <td><img src="assets/preview.gif" width="250"></td>
    </tr>
  </tbody>
</table>


## Installation

Install all npm packages by running the `npm install` command in the home directory.

Replace partner name and app group value in `www/js/index.js` with your info.

Note: Can easily find the warnings added as comments by searching the `FIXME-INSIDER` key in the project and you can quickly make the necessary arrangements for the project.

### Android

1. Add `google-services.json` and `agconnect-services.json` to `platforms/android/app` folder.
2. Add your keystore file to `platforms/android/app` folder and replace `signingConfigs` attributes in `platforms/android/app/build.gradle` file with your info.
3. Replace manifestPlaceholders -> partner value with your partner name in `platforms/android/app/build.gradle` file. (This step is important to add test device with QR or Email in the panel.)
4. And run project with `cordova run android` command.

### iOS

1. Replace widget id with your bundle identifier in `config.xml`.
2. Open project with XCode and check team, app group and bundle identifier for all targets.
3. Replace `insider` URL type in main target Info -> URL Types with your partner name. (This step is important to add test device with QR or Email in the panel.)
4. Change APP_GROUP variables value in `InsiderNotificationService/NotificationService.m` and `InsiderNotificationContent/NotificationViewController.m` files.
5. Run project with `cordova run ios` command. 
