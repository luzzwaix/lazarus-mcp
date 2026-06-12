import { detectRepo } from "../core/detect.js";
import { resolveWorkspaceTarget, type WorkspaceOptions } from "../core/workspace.js";

export async function scanRepo(path: string, options: WorkspaceOptions = {}) {
  const target = await resolveWorkspaceTarget(path, options);
  return detectRepo(target.path);
}
