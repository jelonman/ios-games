/* The one place this game's AdMob ids are written. Created 2026-08-17 under
 * petesarney@gmail.com, publisher pub-2675127458512931, payment country Sweden.
 *
 * ⛔ TWO DIFFERENT IDS THAT LOOK ALIKE:
 *   AD_APP_ID   ca-app-pub-...~...  (TILDE) goes in Info.plist as GADApplicationIdentifier.
 *               Without it the Google Mobile Ads SDK crashes the app on launch, on purpose.
 *   AD_UNITS    ca-app-pub-.../...  (SLASH) is the rewarded placement the game requests.
 * Swapping them does not error — it fails as permanent "no fill", which looks like bad luck.
 *
 * ⛔ AD_TEST_MODE MUST BE false IN ANYTHING THAT SHIPS. With it true the SDK serves test ads,
 * which pay nothing. It is only for local work. And never tap a live ad in your own app —
 * self-clicks are what gets an AdMob account closed.
 *
 * No revenue arrives until the AdMob payment profile is completed — until then requests come
 * back empty, the boost button simply never appears, and the games play exactly as they do now.
 */
window.AD_APP_ID  = 'ca-app-pub-2675127458512931~2033441390';
window.AD_UNITS   = { rewarded: 'ca-app-pub-2675127458512931/6373654426' };
window.AD_TEST_MODE = false;
