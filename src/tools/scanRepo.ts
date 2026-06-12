import { detectRepo } from "../core/detect.js";

export async function scanRepo(path: string) {
  return detectRepo(path);
}
