import { describe, expect, it } from "vitest";
import { detectRepo } from "../src/core/detect.js";
import { fixturePath } from "./helpers.js";

describe("detectRepo", () => {
  it("detects Node package manager, scripts, and missing build hint", () => {
    const scan = detectRepo(fixturePath("dead-node-missing-build"));

    expect(scan.stack).toBe("node");
    expect(scan.packageManager).toBe("npm");
    expect(scan.scripts.test).toContain("node");
    expect(scan.healthHints).toContain("node package has no build script");
  });

  it("detects pytest usage in Python repos", () => {
    const scan = detectRepo(fixturePath("dead-python-missing-pytest"));

    expect(scan.stack).toBe("python");
    expect(scan.packageManager).toBe("pip");
    expect(scan.testRunnerHints).toContain("pytest");
    expect(scan.healthHints).toContain("pytest implied but not declared");
  });
});
