import type { FilesApi } from "@statewalker/webrun-files";
import { type Project, ProjectAdapter } from "@statewalker/workspace.core";
import { tryReadJson, writeJsonAtomic } from "../util/io.js";
import { projectIndexPath } from "./page-paths.js";
import type {
  ExistingClass,
  GlobalOutlier,
  GlobalTopic,
  OutlierIndex,
  TopicIndex,
} from "./types.js";

function filesApiOf(adapter: { filesApi: FilesApi }): FilesApi {
  return adapter.filesApi;
}

/** Project-level read/write of the global topic index (`index/topics.json`). */
export class WikiTopicIndex extends ProjectAdapter {
  private artifactPath(): string {
    return projectIndexPath(this.project.root, "topics.json");
  }

  async read(): Promise<TopicIndex> {
    return (
      (await tryReadJson<TopicIndex>(filesApiOf(this), this.artifactPath())) ?? {
        generated: "",
        topics: [],
      }
    );
  }

  async *list(): AsyncIterable<GlobalTopic> {
    for (const t of (await this.read()).topics) yield t;
  }

  async get(key: string): Promise<GlobalTopic | undefined> {
    return (await this.read()).topics.find((t) => t.key === key);
  }

  async write(index: TopicIndex): Promise<void> {
    await writeJsonAtomic(filesApiOf(this), this.artifactPath(), index);
  }
}

/** Project-level read/write of the global outlier index (`index/outliers.json`). */
export class WikiOutlierIndex extends ProjectAdapter {
  private artifactPath(): string {
    return projectIndexPath(this.project.root, "outliers.json");
  }

  async read(): Promise<OutlierIndex> {
    return (
      (await tryReadJson<OutlierIndex>(filesApiOf(this), this.artifactPath())) ?? {
        generated: "",
        outliers: [],
      }
    );
  }

  async *list(): AsyncIterable<GlobalOutlier> {
    for (const o of (await this.read()).outliers) yield o;
  }

  async get(key: string): Promise<GlobalOutlier | undefined> {
    return (await this.read()).outliers.find((o) => o.key === key);
  }

  async write(index: OutlierIndex): Promise<void> {
    await writeJsonAtomic(filesApiOf(this), this.artifactPath(), index);
  }
}

/** Collect every already-coined class from the global indexes (for meta reuse). */
export async function collectExistingClasses(project: Project): Promise<ExistingClass[]> {
  const out: ExistingClass[] = [];
  for await (const t of project.requireAdapter(WikiTopicIndex).list()) {
    out.push({ kind: "topic", key: t.key, name: t.name, description: t.description });
  }
  for await (const o of project.requireAdapter(WikiOutlierIndex).list()) {
    out.push({ kind: "outlier", key: o.key, name: o.name, description: o.description });
  }
  return out;
}
