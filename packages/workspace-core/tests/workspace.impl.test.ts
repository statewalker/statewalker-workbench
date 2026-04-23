import { MemFilesApi } from "@statewalker/webrun-files-mem";
import { describe, expect, it, vi } from "vitest";
import { SecretsFilesImpl } from "../src/impl/secrets-files.impl.ts";
import { WorkspaceImpl } from "../src/impl/workspace.impl.ts";

describe("WorkspaceImpl", () => {
  function seed(label = "project-a"): WorkspaceImpl {
    const root = new MemFilesApi();
    const secrets = new SecretsFilesImpl({
      files: root,
      secretsDir: "secrets",
    });
    return new WorkspaceImpl({
      files: root,
      systemFiles: root,
      secrets,
      label,
    });
  }

  it("exposes the handles passed to the constructor", () => {
    const workspace = seed("initial");
    expect(workspace.label).toBe("initial");
    expect(workspace.files).toBeDefined();
    expect(workspace.secrets).toBeDefined();
  });

  it("replace() swaps fields in place and fires onUpdate exactly once", () => {
    const workspace = seed("initial");
    const listener = vi.fn();
    workspace.onUpdate(listener);

    const newRoot = new MemFilesApi();
    const newSecrets = new SecretsFilesImpl({
      files: newRoot,
      secretsDir: "secrets",
    });
    workspace.replace({
      files: newRoot,
      systemFiles: newRoot,
      secrets: newSecrets,
      label: "next",
    });

    expect(workspace.label).toBe("next");
    expect(workspace.files).toBe(newRoot);
    expect(workspace.secrets).toBe(newSecrets);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("unsubscribing onUpdate stops further notifications", () => {
    const workspace = seed();
    const listener = vi.fn();
    const unsub = workspace.onUpdate(listener);
    unsub();

    workspace.replace({
      files: workspace.files,
      systemFiles: workspace.systemFiles,
      secrets: workspace.secrets,
      label: "unchanged-but-replaced",
    });
    expect(listener).not.toHaveBeenCalled();
  });

  it("close() invokes the onClose callback", async () => {
    const root = new MemFilesApi();
    const secrets = new SecretsFilesImpl({
      files: root,
      secretsDir: "secrets",
    });
    const onClose = vi.fn(() => Promise.resolve());
    const workspace = new WorkspaceImpl({
      files: root,
      systemFiles: root,
      secrets,
      label: "x",
      onClose,
    });

    await workspace.close();
    expect(onClose).toHaveBeenCalledOnce();
  });
});
