import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { isPipelineGreen } from "../src/core/metrics.js";
import { resurrect } from "../src/tools/resurrect.js";
import { copyFixture } from "./helpers.js";

describe("Python resurrection", () => {
  it("adds pytest when tests/config clearly imply it", async () => {
    const repo = copyFixture("dead-python-missing-pytest");
    const result = await resurrect(repo, { safe: true });
    const requirements = readFileSync(join(repo, "requirements.txt"), "utf8");

    expect(result.before.errorClasses).toContain("missing_test_dependency");
    expect(result.appliedFixes.map((fix) => fix.id)).toContain("python.add_pytest_requirement");
    expect(requirements).toContain("pytest>=8.0.0");
    expect(isPipelineGreen(result.after.beforeMetrics)).toBe(true);
  }, 180_000);
});
