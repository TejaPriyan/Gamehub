# AdSense site preparation

Publisher: `ca-pub-8817990111687358`.

## What this change does

Adds accessible About, Contact, Privacy, Terms and project-specific guide pages. Ownership verification uses the `google-adsense-account` meta tag. No ad-serving JavaScript, ad slots, auto-refresh or Auto ads are enabled. The privacy policy describes this current verification-only state. `adsense.config.json` records the intended scope; it is documentation, not a runtime switch.

## Before requesting review

1. Deploy the reviewed changes and open the home page and every new footer link on a phone and a desktop. Review the policy text against the actual hosting configuration and confirm the public contact details.
2. Confirm the intended domain in AdSense Sites. The verified live origin is `https://tejapriyanhub.vercel.app`. Check `/ads.txt` on that origin returns the plain-text publisher line and that the homepage HTML contains the verification meta tag.
3. Complete the account tasks Google requests, then add the site and request review. Approval is Google’s decision; adding pages or verification does not guarantee it.
4. If review finds an issue, fix that issue before requesting another review. Check robots, public accessibility, navigation and useful original content.

## Before activating advertisements

Set up the appropriate consent messages in AdSense Privacy & messaging, including a Google-certified CMP for personalized ads in the EEA, UK and Switzerland. Reconcile the privacy notice with the exact ad technology enabled. Choose explicit, conservative placements on substantial public content; do not load a global Auto ads script across every route. Keep ads off private transfer/result screens, low-content utility screens, policy/contact pages and game canvases. Keep play, upload, export, download and transfer controls well separated from ads. No ad script is included in this PR.

## Google references

- https://support.google.com/adsense/answer/12176698
- https://support.google.com/adsense/answer/12131223
- https://support.google.com/adsense/answer/1346295
- https://support.google.com/adsense/answer/13554116
