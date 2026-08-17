# Contributing

Contributions should preserve the learning and trust boundaries in `docs/ARCHITECTURE.md`.

1. Fork the repository and create a focused branch.
2. Use Node.js 22+ and the pinned pnpm version.
3. Run `pnpm install --frozen-lockfile`, `pnpm test` and `pnpm build`.
4. If native files change, run `pnpm exec cap sync` and the relevant native build.
5. Document the learning outcome, hands-on activity and proof for new learning content.
6. Do not commit real indicators tied to a private environment, credentials, keys, private endpoints or copyrighted feed bodies.

New network permissions, background execution, device inspection, generative-AI providers, platform actions or main-lab write operations require an explicit threat-model update and security review.
