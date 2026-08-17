# Shipping 1.1 (the version with rewarded boosts)

Everything below is built, wired and verified. It cannot be submitted yet, and the reason is
sequencing, not missing work: **1.0 is in App Review right now, and a second version cannot be
submitted until it resolves.**

## What is already done

- Rewarded boosts in all three games, verified in a browser with a stubbed ad plugin:
  with no plugin there are 0 buttons and the game is unchanged; with one, exactly 1 ad is shown
  and the boost measurably applies.
- AdMob account created 2026-08-17 under **petesarney@gmail.com**, publisher
  **pub-2675127458512931**, payment country **Sweden** (permanent, and correct).
- Three iOS apps and three rewarded ad units, each app's ids in its own `www/ad-config.js`.
- The build reads `GADApplicationIdentifier` out of that same file, so the id the SDK starts with
  cannot drift from the id the game requests ads with. All three archive, sign and export.

## Blocking: the AdMob payment profile

AdMob says: *"To finish setting up your AdMob account you must complete your payment profile.
Until you add these details, we cannot complete the review of your apps."*

That is bank and tax identity, so it is the owner's to enter and nobody else's. Until it is done
every ad request comes back empty — which is harmless (the boost button just never appears and
the games play exactly as they do today) but earns **£0**.

## Do these when 1.0 is approved, in this order

1. **Change App Privacy from "Data Not Collected".** ⛔ This is not optional and not cosmetic —
   with an ads SDK in the binary the current declaration becomes false. Declare, at minimum,
   *Identifiers → Device ID* and *Usage Data*, linked to **Third-Party Advertising**. Do NOT
   declare tracking: ads are requested non-personalised (`npa`) and there is no App Tracking
   Transparency prompt, so "Used for Tracking" stays **No**.
   Remember the trap from 2026-08-17: answering the questionnaire is not publishing it, and the
   proof that it took is the **Publish button disappearing**.
2. Tick the version's "contains ads" declaration in App Store Connect.
3. Build and upload: `gh workflow run ios.yml -f game=all -f upload=true -f version=1.1 -R jelonman/ios-games`
4. Attach the new build to a 1.1 version, set `usesNonExemptEncryption=false` on it, submit.

## Do not

- Do not flip `AD_TEST_MODE` back to `true` in anything that ships — test ads pay nothing.
- Do not tap a live ad inside your own app. Self-clicks are what gets an AdMob account closed.
- Do not add banners or interstitials. The rule these games are built on is that a reward only
  ever ADDS an option, and every button that is free today stays free.
