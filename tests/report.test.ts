import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { evidencePack } from "../src/tools/evidencePack.js";
import { copyFixture } from "./helpers.js";

describe("evidence pack", () => {
  it("writes judge-readable markdown and summary JSON", async () => {
    const repo = copyFixture("dead-node-missing-build");
    const pack = await evidencePack(repo);

    expect(existsSync(pack.files.resurrectionReport)).toBe(true);
    expect(existsSync(pack.files.aiJudges)).toBe(true);
    expect(existsSync(pack.files.summary)).toBe(true);
    expect(readFileSync(pack.files.resurrectionReport, "utf8")).toContain("## Autopsy Findings");
    expect(pack.summary.fixtures[0]?.appliedFixes).toContain("node.add_build_script");
  }, 20_000);
});
