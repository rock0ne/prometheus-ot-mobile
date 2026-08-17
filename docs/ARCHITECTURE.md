# Architecture

## Design goal

Prometheus-OT Mobile must remain useful when it is the only device available and become more capable—not less safe—when paired with a main lab.

```text
┌──────────────── Android / iOS / Web ────────────────┐
│ Shared UI and learning contracts                     │
│                                                     │
│ Labs · Learning · Local Coach · Living Engine        │
│ CVE/RSS cache · Rule practice · Bounded terminal     │
│ Local portfolio · Search · How To · FAQ              │
└─────────────────────────┬───────────────────────────┘
                          │ optional HTTPS, no secret
                          ▼
┌──────────────── Prometheus-OT gateway ───────────────┐
│ Server authentication and authorisation              │
│ Governed assistant · real telemetry · assessments    │
│ Human approval · signed evidence                     │
└─────────────────────────────────────────────────────┘
```

## Trust boundaries

1. Remote feed content is untrusted and rendered as text. Only validated HTTP(S) links can be opened externally.
2. The local terminal reads only embedded synthetic events and implements a fixed command grammar.
3. Local rule conversion cannot execute or publish detection content.
4. Offline Coach is deterministic and cannot award competency.
5. Pairing is unset by default, remote origins require HTTPS and no credential is stored in source.
6. Main-lab identity, authority, assessment and signed evidence remain server responsibilities.

## Native surface

Capacitor supplies reviewed Android and iOS containers around the shared core. The current native permission surface is network connectivity only. Platform-specific on-device AI may be introduced behind an explicit adapter, but no learning outcome may depend on a vendor model.
