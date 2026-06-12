#!/usr/bin/env node
import { autopsy } from "./tools/autopsy.js";
import { evidencePack } from "./tools/evidencePack.js";
import { resurrect } from "./tools/resurrect.js";
import { scanRepo } from "./tools/scanRepo.js";

type CommandName = "scan" | "autopsy" | "resurrect" | "evidence-pack";

async function main(argv: string[]) {
  const [command, target, ...rest] = argv;
  if (!isCommand(command) || !target) {
    printUsage();
    process.exitCode = 1;
    return;
  }

  const branchIndex = rest.indexOf("--branch");
  const branch = branchIndex >= 0 ? rest[branchIndex + 1] : undefined;
  const safe = rest.includes("--safe");

  const output =
    command === "scan"
      ? await scanRepo(target)
      : command === "autopsy"
        ? await autopsy(target)
        : command === "resurrect"
          ? await resurrect(target, { safe, branch })
          : await evidencePack(target);

  console.log(JSON.stringify(output, null, 2));
}

function isCommand(value: string | undefined): value is CommandName {
  return value === "scan" || value === "autopsy" || value === "resurrect" || value === "evidence-pack";
}

function printUsage() {
  console.error(`Usage:
  lazarus scan <path>
  lazarus autopsy <path>
  lazarus resurrect <path> [--safe] [--branch <name>]
  lazarus evidence-pack <path>`);
}

main(process.argv.slice(2)).catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
