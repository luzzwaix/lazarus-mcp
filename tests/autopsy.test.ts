import { describe, expect, it } from "vitest";
import { autopsy } from "../src/tools/autopsy.js";
import { classifyFailure } from "../src/core/logs.js";
import { copyFixture } from "./helpers.js";

describe("autopsy", () => {
  it("classifies missing build scripts", async () => {
    const repo = copyFixture("dead-node-missing-build");
    const result = await autopsy(repo);

    expect(result.failStage).toBe("build");
    expect(result.errorClasses).toContain("missing_script");
    expect(result.suggestedPlaybooks).toContain("node.patchPackageJson");
  });

  it("classifies timeouts", () => {
    const errorClass = classifyFailure(
      "test",
      { stdout: "", stderr: "", timedOut: true, command: "slow" },
      {
        path: ".",
        stack: "node",
        packageManager: "npm",
        configFiles: ["package.json"],
        scripts: {},
        testRunnerHints: [],
        confidence: 1,
        healthHints: []
      }
    );

    expect(errorClass).toBe("command_timeout");
  });
});
