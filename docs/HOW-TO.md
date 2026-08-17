# How To

The same guides are available inside the app under **How To** and can be found with global search.

## Learn standalone

Open **Control**, choose **Labs** for evidence-led practice or **Learn** for outcome-led modules, and review local results in **Portfolio**. No account or main lab is required.

## Complete a lab

Read every evidence row, make the operational decision, then record the evidence that changed your decision, a credible alternative and remaining uncertainty. A correct option without a reason is not the intended learning outcome.

## Use CVE and RSS intelligence

Open **Intel** to refresh CISA KEV and **Feeds** for NCSC, CISA, NIST and independent reporting. Cached results remain available offline. Treat global reporting as intelligence—not proof that a local asset is affected.

## Use the Platform Learning Coach

Open **AI**, state what you need to understand, decide or prove, and use the response to structure a hypothesis and evidence plan. Offline Coach is deterministic and private. Verify consequential claims against authoritative evidence.

## Use the Living Engine

Open **Observe** and distinguish observations from inference. The engine combines connection availability, intelligence freshness and learning progress; it does not scan the local network or produce a universal risk score.

## Convert a detection rule

Open **Rules**, enter a simple Sigma-style selection, choose Splunk, KQL or Elastic, then validate the teaching draft's fields, escaping, expected positives and false positives in a real target before operational use.

## Use the Analyst Terminal

Open **Terminal** and run `help`. Use `events`, `count`, `top`, `timeline`, `hunt` and `show` against packaged synthetic evidence. It is not a phone shell.

## Pair with the main lab

Open **Settings** and enter an HTTPS gateway origin you control. The app contains no credential. Production pairing requires an authentication flow implemented by the main server; never paste a service token into the app.

## Move the app to another Android phone

Authorise USB debugging, confirm the target with `adb devices`, verify the APK digest, then run:

```bash
adb install -r path/to/app-debug.apk
```

Use signed releases or managed distribution for users outside a controlled test group.

## Install on iPhone or iPad

Check out the repository on macOS, run the shared tests/build and `pnpm exec cap sync ios`, then open `ios/App/App.xcodeproj`. Select an Apple team and install with Xcode or distribute through TestFlight.
