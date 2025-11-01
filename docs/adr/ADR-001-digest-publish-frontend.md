# ADR-001: Digest-Driven Frontend Image Publishing

## Status
Accepted

## Context
NightBFF frontend (Expo web) needs to publish Docker images to GHCR with immutable digest references. The frontend is web-only (nginx-served static export) and must integrate with backend via nginx proxy.

## Decision
Implement a GitHub Actions workflow that:
1. Builds Expo web export (static files)
2. Pushes nginx-based images to `ghcr.io/apesensei/nightbff-frontend-web`
3. Tags images with `int-<short-sha>` pattern
4. Signs images with cosign (keyless)
5. Generates SBOM with syft
6. Exposes `workflow_call` with outputs: `image` (tag) and `digest` (sha256)
7. Uses `GITHUB_TOKEN` for authentication

## Implementation
- Workflow: `.github/workflows/build-publish-frontend.yml`
- Dockerfile: Multi-stage (Node build → nginx serve)
- nginx.conf: Proxies `/api` to `backend:3000` (compose service name)
- Permissions: `contents: read`, `packages: write`, `id-token: write`
- Image signing: cosign v2.2.4 (keyless)
- SBOM: syft (SPDX-JSON format)

## Consequences
### Positive
- Immutable frontend images via digest
- nginx proxy eliminates runtime env injection need
- Supply chain security (signing + SBOM)
- Hermetic builds (no submodule dependencies)

### Negative
- Requires `map.web.tsx` and base `map.tsx` for Expo Router compliance
- Package name changed from `nightbff-frontend` to `nightbff-frontend-web` (old package deleted)

## References
- Plan: `docs/plans/Digest.plan.md`
- Workflow: `.github/workflows/build-publish-frontend.yml`
- Package: `ghcr.io/apesensei/nightbff-frontend-web`

