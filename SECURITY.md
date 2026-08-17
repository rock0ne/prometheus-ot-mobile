# Security Policy

## Supported version

Security fixes target the latest release on the default branch.

## Reporting

Do not open a public issue for a suspected secret, authentication bypass, unsafe URL handling, native permission expansion or main-lab trust-boundary flaw. Use GitHub's private vulnerability reporting for this repository once enabled by the owner.

Include the affected version/commit, platform, reproduction steps, impact and any proposed mitigation. Do not include real credentials or sensitive organisational data.

## Security invariants

- no API keys, service passwords, signing material or private platform endpoints in source;
- HTTPS for non-loopback pairing;
- remote feed content is inert and outbound URLs are scheme-validated;
- no arbitrary command execution in the local terminal;
- no operational claim that a CVE feed proves local vulnerability;
- no AI-generated competency award;
- release signing and Apple provisioning remain outside the repository.

## Dependency and secret checks

Pull requests run TypeScript tests/builds, Android compilation, iOS simulator compilation and secret scanning. Dependency updates should be pinned and reviewed before merge.
