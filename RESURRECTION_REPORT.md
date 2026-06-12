# Resurrection Report

## Problem Statement

Broken repositories often fail before a maintainer can understand whether the project is salvageable. Lazarus MCP provides a repeatable autopsy-and-resurrection loop for common Node/Python failures and emits evidence that is readable by humans and AI judges.

## Before State

| Fixture | install | build | test |
| --- | --- | --- | --- |
| dead-node-esm-cjs | skipped | failed | failed |
| dead-node-missing-build | skipped | failed | passed |
| dead-python-missing-pytest | skipped | passed | failed |

## Autopsy Findings

| Fixture | Error class | Suggested playbook |
| --- | --- | --- |
| dead-node-esm-cjs | esm_cjs_mismatch | node.patchEsmCjs |
| dead-node-missing-build | missing_script | node.patchPackageJson |
| dead-python-missing-pytest | missing_test_dependency | python.patchRequirements |

## Applied Fixes

| Fixture | Fix |
| --- | --- |
| dead-node-esm-cjs | Switch package type from `module` to `commonjs` only when files use require syntax and no ESM syntax is detected. |
| dead-node-missing-build | Add `build: node --check src/index.js` when the entry point is obvious. |
| dead-python-missing-pytest | Add `pytest>=8.0.0` when pytest config/tests imply pytest. |

## After State

| Fixture | install | build | test |
| --- | --- | --- | --- |
| dead-node-esm-cjs | skipped | passed | passed |
| dead-node-missing-build | skipped | passed | passed |
| dead-python-missing-pytest | passed | passed | passed |

## Metrics

Metrics are emitted per run from `lazarus resurrect` and written into generated evidence packs. The committed `evidence/summary.json` records expected fixture proof for the MVP.

## Changed Files

- `package.json` for Node script/type fixes.
- `requirements.txt` for Python pytest dependency fixes.
- `RESURRECTION_REPORT.md`, `AI_JUDGES.md`, and `evidence/summary.json` for judge evidence.

## Remaining Limitations

- MVP supports Node and Python only.
- Git URL cloning is not implemented yet.
- The MCP adapter is stdio-only.
- Playbooks are conservative and intentionally skip low-confidence repairs.
