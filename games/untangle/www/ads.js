/* Rewarded boosts — the only advertising in these games.
 *
 * ⛔ THE RULES THIS FILE ENFORCES, because the owner asked for "nothing annoying" and because
 * Pin Rescue's own win screen promises the player "no timer, no lives, no 'watch a video to
 * continue'". Breaking that in the build while the copy still says it would be a lie:
 *
 *   1. NOTHING THAT IS FREE TODAY EVER BECOMES PAID. Every existing button — Try again, Skip,
 *      Next level, Shuffle — keeps working exactly as it does now, with no ad in front of it.
 *      A reward only ever ADDS an option that did not exist before.
 *   2. NO BANNERS AND NO INTERSTITIALS. Rewarded video only, and only after a deliberate tap.
 *      Nothing ever plays on its own, on level start, or between levels.
 *   3. THE BUTTON DOES NOT EXIST UNLESS AN AD IS ALREADY LOADED. No spinner, no "loading ad",
 *      no tap that goes nowhere. If there is no fill, the player never learns there was a button.
 *   4. NON-PERSONALISED ADS ONLY (npa). No App Tracking Transparency prompt — that prompt is
 *      itself the kind of interruption being avoided here, and personalised ads are not worth it.
 *   5. ONE REWARD PER COOLDOWN, and the offer is capped per session so it cannot become a
 *      drumbeat for someone who is stuck.
 *
 * On the web build this file is inert: the AdMob plugin only exists inside the native app, so
 * `ready()` is false forever and no button is ever added. The Vercel versions stay ad-free.
 */
(function (global) {
  'use strict';

  var COOLDOWN_MS = 45 * 1000;   // never two rewards back to back
  var MAX_PER_SESSION = 8;       // a stuck player is not a revenue stream

  var cfg = null;
  var loaded = false;            // an ad is preloaded and can be shown immediately
  var loading = false;
  var lastShown = 0;
  var shownThisSession = 0;

  function plugin() {
    var C = global.Capacitor;
    return (C && C.Plugins && C.Plugins.AdMob) ? C.Plugins.AdMob : null;
  }

  function log(msg, err) {
    // Deliberately quiet in production: an ad failure must never look like a game failure.
    if (global.__BOOST_DEBUG) console.log('[boost] ' + msg, err || '');
  }

  function preload() {
    var p = plugin();
    if (!p || !cfg || loading || loaded) return;
    loading = true;
    p.prepareRewardVideoAd({ adId: cfg.adId, isTesting: !!cfg.isTesting, npa: true })
      .then(function () { loaded = true; loading = false; log('ad ready'); refreshAll(); })
      .catch(function (e) { loaded = false; loading = false; log('no fill', e); });
  }

  function ready() {
    return !!(plugin() && cfg && loaded &&
              shownThisSession < MAX_PER_SESSION &&
              Date.now() - lastShown > COOLDOWN_MS);
  }

  /* Show the ad and resolve TRUE only when the reward was actually earned. A player who
   * closes the video early gets no boost and no penalty — they simply return to the game. */
  function show() {
    var p = plugin();
    if (!p || !ready()) return Promise.resolve(false);
    loaded = false;
    lastShown = Date.now();
    shownThisSession++;
    return p.showRewardVideoAd()
      .then(function (reward) {
        setTimeout(preload, 1500);
        return !!(reward && (reward.amount > 0 || reward.type));
      })
      .catch(function (e) {
        log('show failed', e);
        setTimeout(preload, 1500);
        return false;
      });
  }

  /* Every mounted offer re-checks itself whenever availability changes, so a button can
   * appear the moment an ad finishes preloading rather than only on the next screen. */
  var offers = [];
  function refreshAll() { offers.forEach(function (o) { o.refresh(); }); }

  /* mount({host, label, onReward}) — adds ONE opt-in button to `host`, and only while an ad
   * is genuinely ready. Returns a handle with refresh()/destroy(). */
  function mount(opts) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = opts.label;
    btn.setAttribute('data-boost', '1');
    btn.style.cssText = (opts.style || '') +
      ';display:none;max-width:20rem;width:100%;flex:0 0 auto;' +
      'background:#1a2130;border:1px solid #2b3648;color:#e6edf3';

    btn.onclick = function () {
      btn.disabled = true;
      var restore = btn.textContent;
      show().then(function (earned) {
        btn.disabled = false;
        btn.textContent = restore;
        o.refresh();
        if (earned) opts.onReward();
      });
    };

    var o = {
      el: btn,
      refresh: function () { btn.style.display = ready() ? '' : 'none'; },
      destroy: function () {
        offers = offers.filter(function (x) { return x !== o; });
        if (btn.parentNode) btn.parentNode.removeChild(btn);
      }
    };
    offers.push(o);
    opts.host.appendChild(btn);
    o.refresh();
    return o;
  }

  function init(options) {
    cfg = options || null;
    var p = plugin();
    if (!p || !cfg || !cfg.adId) { log('no native AdMob — boosts stay off'); return; }
    p.initialize({ initializeForTesting: !!cfg.isTesting })
      .then(function () { log('admob initialised'); preload(); })
      .catch(function (e) { log('init failed', e); });
  }

  global.Boost = { init: init, mount: mount, ready: ready, show: show };
})(window);
