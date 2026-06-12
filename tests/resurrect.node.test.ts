import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { isPipelineGreen } from "../src/core/metrics.js";
import { resurrect } from "../src/tools/resurrect.js";
import { copyFixture } from "./helpers.js";

describe("Node resurrection", () => {
  it("repairs a conservative ESM/CJS mismatch", async () => {
    const repo = copyFixture("dead-node-esm-cjs");
    const result = await resurrect(repo, { safe: true });
    const packageJson = JSON.parse(readFileSync(join(repo, "package.json"), "utf8")) as { type: string };

    expect(result.before.errorClasses).toContain("esm_cjs_mismatch");
    expect(result.appliedFixes.map((fix) => fix.id)).toContain("node.type_commonjs");
    expect(packageJson.type).toBe("commonjs");
    expect(isPipelineGreen(result.after.beforeMetrics)).toBe(true);
  }, 20_000);

  it("adds a missing build script when an entry point is obvious", async () => {
    const repo = copyFixture("dead-node-missing-build");
    const result = await resurrect(repo, { safe: true });
    const packageJson = JSON.parse(readFileSync(join(repo, "package.json"), "utf8")) as {
      scripts: Record<string, string>;
    };

    expect(result.before.errorClasses).toContain("missing_script");
    expect(packageJson.scripts.build).toBe("node --check src/index.js");
    expect(isPipelineGreen(result.after.beforeMetrics)).toBe(true);
  }, 20_000);
});
