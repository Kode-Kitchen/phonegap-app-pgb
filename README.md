# PhoneGap Build Developer App

Log into PhoneGap Build, view and run your PGB apps within the same webview, or optionally install them individually.

## Setup

Obtain API client credentials (a `CLIENT_ID` and `CLIENT_SECRET`) from [PhoneGap Build](https://build.phonegap.com/people/edit). Add the credentials to the PGB Oauth Plugin for [Android](https://github.com/wildabeast/phonegap-app-pgb/blob/master/platforms/android/src/com/phonegap/build/oauth/PhonegapBuildOauth.java#L25) and [iOS](https://github.com/wildabeast/phonegap-app-pgb/blob/master/platforms/ios/PhoneGap%20Build/Plugins/com.phonegap.build.oauth/CDVPhonegapBuildOauth.m#L13)

    npm install -g phonegap@6.0.3
    git clone https://github.com/wildabeast/phonegap-app-pgb.git

## Compile and Run

    phonegap run ios
    phonegap run android
    
