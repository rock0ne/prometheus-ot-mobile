# Privacy

Prometheus-OT Mobile is local-first.

Stored on the device:

- practice answers, reflections and completion timestamps;
- public CISA KEV and RSS/Atom cache entries;
- configured main-lab origin;
- no platform password, service token, model API key or signing key.

Network use:

- direct HTTPS requests to the public feed sources listed in `src/data.ts`;
- requests to a main-lab origin only after the user configures one and invokes a paired capability;
- no analytics, advertising SDK or automatic telemetry in this repository.

Permissions:

- internet/network-state access for feeds and optional pairing;
- no contacts, location, camera, microphone, photos, SMS, accessibility, VPN or device-administrator permission.

Deleting app storage or uninstalling the app removes its local practice and cache data. Portfolio export is explicit and produces a JSON file selected by the user.
