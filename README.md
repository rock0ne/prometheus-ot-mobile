# Prometheus-OT Mobile

Prometheus-OT Mobile is an offline-first purple-team learning lab for Android, iPhone, iPad and the web. It brings the essential learning model of Prometheus-OT to a phone without pretending that a phone can locally host service-heavy SIEM, SOAR, packet-capture or OT-range infrastructure.

The app is standalone by default. Pairing with a main Prometheus-OT deployment is optional.

## What is included

- evidence-led SOC, CTI, OT-containment and AI/OT trust-boundary labs;
- two coherent learning paths: traditional cyber/CTI/risk/OT and AI security/OT–AI convergence;
- direct CISA Known Exploited Vulnerabilities and RSS/Atom sources with private offline caching;
- a local Living Engine that labels observations and safe next actions without inventing a risk score;
- a deterministic offline Platform Learning Coach;
- OWASP LLM learning, AI threat modelling, secure AI architecture and AI governance;
- a bounded Sigma teaching converter;
- a safe analyst terminal over packaged synthetic Zeek, Suricata, EDR and OT-style evidence;
- private local practice portfolio and explicit JSON export;
- global search, in-app How To guides and FAQ;
- optional, HTTPS-only main-lab origin configuration.

## Honest scope

Security Onion, Splunk operations, Wazuh, Velociraptor, SOAR, packet-capture infrastructure, malware detonation and HMI control are not represented as fake standalone phone tools. Those remain main-lab capabilities.

Local practice records are not independently assessed or signed. Prometheus-OT's held-out assessment, human approval and signed evidence workflow remains the authority for externally reviewable competency evidence.

## Technology

The shared application is TypeScript and standards-based web UI packaged with [Capacitor](https://capacitorjs.com/). Android and iOS use the same learning, safety and privacy contracts while retaining native project boundaries for future platform-specific adapters.

Requirements:

- Node.js 22 or newer;
- pnpm 11.19.0;
- Android: JDK 21 and Android SDK 36;
- iOS: current macOS and Xcode, plus an Apple development team for device signing.

## Run the shared app

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm build
pnpm dev
```

## Android

```bash
pnpm build
pnpm exec cap sync android
cd android
./gradlew testDebugUnitTest assembleDebug
```

The debug APK is written to `android/app/build/outputs/apk/debug/app-debug.apk`.

Install on an authorised test phone:

```bash
adb devices
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

Debug APKs are for controlled testing. Release signing keys must remain outside this repository.

## iPhone and iPad

The iOS project is committed so its privacy and native configuration are reviewable. On macOS:

```bash
pnpm install --frozen-lockfile
pnpm build
pnpm exec cap sync ios
open ios/App/App.xcodeproj
```

Select an Apple development team in Xcode and run on a simulator or authorised device. TestFlight or App Store distribution requires an Apple Developer account and signing/provisioning configured outside the repository. Windows can build and test the shared core but cannot compile or sign a trustworthy iOS binary.

## Main-lab pairing

Pairing is off until the learner configures an origin in Settings. Remote origins must use HTTPS. Plain HTTP is accepted only for `localhost`/`127.0.0.1` USB development. The repository contains no default private address, platform password, model key, session token or signing key.

Pairing is an extension point, not a dependency. A production paired assistant or terminal must use a server-supported mobile authentication flow and remain behind the main platform's authorisation and evidence controls.

## Documentation

- [How To](docs/HOW-TO.md)
- [FAQ](docs/FAQ.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Security model](SECURITY.md)
- [Privacy](PRIVACY.md)
- [Contributing](CONTRIBUTING.md)

## Licence

MIT. See [LICENSE](LICENSE).
