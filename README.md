# iOS builds for the three games

Linux cannot produce an .ipa. This repo exists so a hosted macOS runner can, using the App
Store Connect key for both automatic signing and the upload. Run the workflow from Actions,
or `gh workflow run ios.yml -f game=all`.

Games: untangle, gate-rush, pin-rescue — each is one index.html wrapped by Capacitor 8.
