# Lazarus MCP

[![CI](https://github.com/luzzwaix/lazarus-mcp/actions/workflows/ci.yml/badge.svg)](https://github.com/luzzwaix/lazarus-mcp/actions/workflows/ci.yml)
[![MIT License](https://img.shields.io/badge/license-MIT-39ff88.svg)](LICENSE)
[![Live Demo](https://img.shields.io/badge/live-Lazarus_Lab-39ff88.svg)](https://web-jet-tau-46.vercel.app)

Lazarus MCP autopsies broken Node/Python repositories, applies conservative
resurrection playbooks, reruns install/build/test, and writes judge-ready
evidence.

**Dead repo in. Working repo out. Evidence included.**

[Live Lazarus Lab](https://web-jet-tau-46.vercel.app) |
[60-second judge guide](docs/JUDGE_GUIDE.md) |
[Evidence report](RESURRECTION_REPORT.md)

## Why It Exists

Hackathon judges and maintainers need more than an AI claim. They need evidence:
what failed, why it failed, what changed, and whether build/test is green
afterward. Lazarus keeps the scope narrow and auditable: Node and Python,
local paths or public GitHub HTTPS URLs, conservative patches, and no remote
pushes.

## Quickstart

```bash
npm install
npm run build
npm test
```

Try a local fixture path:

```bash
npm run dev -- scan fixtures/dead-node-missing-build
npm run dev -- autopsy fixtures/dead-node-missing-build
npm run dev -- resurrect fixtures/dead-node-missing-build --safe
npm run dev -- evidence-pack fixtures/dead-node-missing-build
```

Try a GitHub HTTPS URL:

```bash
npm run dev -- scan https://github.com/<owner>/<repo>
npm run dev -- autopsy https://github.com/<owner>/<repo>
npm run dev -- resurrect https://github.com/<owner>/<repo> --safe
npm run dev -- evidence-pack https://github.com/<owner>/<repo>
```

GitHub URLs are cloned into `.lazarus-workspaces/<repo-name>-<timestamp>`. Lazarus creates local branches only, never pushes upstream, and never modifies remotes.

## CLI Usage

```bash
lazarus scan <path-or-github-url>
lazarus autopsy <path-or-github-url>
lazarus resurrect <path-or-github-url> [--safe] [--branch <name>]
lazarus evidence-pack <path-or-github-url>
```

`scan` detects stack, package manager, config files, scripts, test runner hints, confidence, and health hints. `autopsy` runs safe install/build/test commands with timeouts and structured log classification. `resurrect` applies high-confidence playbooks, reruns the pipeline, and never pushes upstream. `evidence-pack` writes `RESURRECTION_REPORT.md`, `AI_JUDGES.md`, and `evidence/summary.json`.

## MCP Tools

The stdio adapter in `src/server.ts` exposes:

- `scan_repo`
- `autopsy`
- `resurrect`
- `evidence_pack`

The adapter is intentionally thin so the CLI core stays package-agnostic and green if MCP package APIs shift.

Example client configuration after `npm run build`:

```json
{
  "mcpServers": {
    "lazarus": {
      "command": "node",
      "args": ["/absolute/path/to/lazarus-mcp/dist/server.js"]
    }
  }
}
```

## Proof It Works

- `tests/detect.test.ts` covers stack and pytest detection.
- `tests/autopsy.test.ts` covers log classification and missing-script autopsy.
- `tests/resurrect.node.test.ts` resurrects `fixtures/dead-node-esm-cjs` and `fixtures/dead-node-missing-build`.
- `tests/resurrect.python.test.ts` resurrects `fixtures/dead-python-missing-pytest`.
- `tests/report.test.ts` verifies judge evidence generation.
- `tests/workspace.test.ts` verifies GitHub URL parsing, isolated clone targets,
  and clone-once behavior.
- `tests/mcp.test.ts` verifies initialization, tool discovery, tool calls,
  invalid-tool rejection, and a real stdio MCP session.
- CI runs clean installs, the CLI/MCP build, all tests, and the production
  Lazarus Lab build.

Current verified suite: **7 test files / 18 tests**.

## Demo Flow

1. Show a broken fixture repository.
2. Run `lazarus autopsy <path>` and point to the failing phase and error class.
3. Run `lazarus resurrect <path> --safe`.
4. Show after metrics are green.
5. Run `lazarus evidence-pack <path>` and open the generated report files.

## Current MVP Scope

- Supported stacks: Node and Python.
- Supported input: local path or GitHub HTTPS URL.
- Supported Node fixes: missing build script, conservative ESM/CJS package type repair, strongly implied TypeScript dependency.
- Supported Python fixes: missing pytest dependency when tests/config imply pytest.
- Interactive static Lazarus Lab frontend.
- No OAuth, remote HTTP MCP server, broad language support, or remote git push.

## Safety

- Commands time out after 120 seconds by default.
- Logs are redacted for obvious secrets.
- Lazarus never force-pushes, never pushes, and never modifies remotes.
- Low-confidence fixes are reported as suggestions instead of mutations.
- Applied changes are intentionally small and auditable.

## Product Demo

The Vercel-ready Lazarus Lab lives in `apps/web`. It is explicitly a static
frontend simulation of the working CLI/MCP workflow; arbitrary repositories
are not executed on Vercel.

```bash
npm run landing:dev
npm run landing:build
```

Demo script and recording plan:

- `docs/DEMO_SCRIPT.md`
- `docs/VIDEO_STORYBOARD.md`
- `docs/JUDGE_GUIDE.md`
