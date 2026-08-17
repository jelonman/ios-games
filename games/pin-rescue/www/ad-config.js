/* The one place an ad unit ID is written.
 *
 * ⛔ THESE ARE GOOGLE'S PUBLIC TEST UNITS. They serve a real rewarded video that pays nothing,
 * which is exactly what is wanted until a real AdMob account exists — serving live ads against
 * a unit you do not own, or clicking your own live ads, is what gets an AdMob account banned.
 * Confirmed from two sources on 2026-08-17: the plugin's own iOS source
 * (AdMobPlugin.swift, rewarded default) and https://developers.google.com/admob/ios/test-ads.
 *
 * TO GO LIVE: replace `rewarded` with the real rewarded unit for each app, set TEST_MODE to
 * false, and put the AdMob APP id (the ca-app-pub-XXXX~YYYY form, with a tilde) into
 * GADApplicationIdentifier in the workflow's Info.plist step. Ad unit and app id are different
 * things and swapping them fails silently with "no fill" forever.
 */
window.AD_UNITS = { rewarded: 'ca-app-pub-3940256099942544/1712485313' };
window.AD_TEST_MODE = true;
