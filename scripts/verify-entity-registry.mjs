#!/usr/bin/env node
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const lock = JSON.parse(await readFile(resolve(root, "metadata/entity-registry.lock.json"), "utf8"));
const snapshotRaw = await readFile(resolve(root, lock.snapshot_path), "utf8");
const snapshot = JSON.parse(snapshotRaw);

if (lock.registry_repository !== "dan-beranek/dio-odi-entity-registry") {
  throw new Error("Unexpected Entity Registry repository.");
}
if (!/^[0-9a-f]{40}$/.test(lock.registry_commit ?? "")) {
  throw new Error("Entity Registry must be pinned to a full immutable commit SHA.");
}
if (snapshot.registry_version !== lock.registry_version || snapshot.status !== "canonical-approved") {
  throw new Error("Entity Registry snapshot version/status does not match the lock.");
}
const url = `https://raw.githubusercontent.com/${lock.registry_repository}/${lock.registry_commit}/${lock.source_path}`;
const response = await fetch(url, { headers: { accept: "application/json" } });
if (!response.ok) throw new Error("Unable to retrieve pinned Entity Registry: HTTP " + response.status);
if (await response.text() !== snapshotRaw) {
  throw new Error("Vendored Entity Registry snapshot differs from the immutable upstream commit.");
}
for (const key of lock.consumed_entities ?? []) {
  if (!snapshot.entities.some((entity) => entity.key === key && entity.status === "active")) {
    throw new Error("Pinned Entity Registry does not contain an active required entity: " + key);
  }
}
console.log("Verified Entity Registry v" + lock.registry_version + " at " + lock.registry_commit + ".");
