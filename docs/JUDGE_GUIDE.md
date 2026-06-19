# Judge Guide

Lazarus MCP turns a broken Node or Python repository into an auditable rescue
workflow:

`input -> scan -> autopsy -> safe patch -> verify -> evidence`

## 60-Second Verification

```bash
npm install
npm run build
npm test
npm run dev -- autopsy fixtures/dead-node-esm-cjs
npm run dev -- resurrect fixtures/dead-node-esm-cjs --safe
```

The test suite exercises stack detection, failure classification, conservative
Node/Python repairs, GitHub URL workspace isolation, report generation, direct
JSON-RPC tool calls, and a real MCP stdio process.

## Real Product Surfaces

- CLI: `scan`, `autopsy`, `resurrect`, `evidence-pack`
- MCP tools: `scan_repo`, `autopsy`, `resurrect`, `evidence_pack`
- Inputs: local paths and public GitHub HTTPS URLs
- Evidence: `RESURRECTION_REPORT.md`, `AI_JUDGES.md`,
  `evidence/summary.json`
- CI: <https://github.com/luzzwaix/lazarus-mcp/actions>
- Product demo: <https://web-jet-tau-46.vercel.app>

## What The Web Demo Is

The Lazarus Lab website is an interactive, static product simulation. It
demonstrates the exact state machine and evidence artifacts produced by the
working CLI/MCP core, but it does not execute arbitrary repositories in a
browser or on Vercel.

## Safety Boundaries

- No upstream pushes.
- No remote mutation.
- GitHub inputs are cloned into timestamped local workspaces.
- Repairs are allowlisted, conservative, and skipped when confidence is low.
- Command execution is bounded by timeouts.
- Obvious secrets are redacted from logs.

## Current Limits

- Node and Python only.
- Public GitHub HTTPS URLs only; no authentication.
- MCP transport is stdio-only.
- The committed proof uses deterministic fixtures rather than claiming broad
  autonomous repair.
