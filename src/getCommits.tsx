import { execFileSync } from "child_process";

function parseRevString(revstring: string) {
  const lines = revstring.split("\n");
  const commits = [];
  let curr = 0;
  let commit = null;
  while (curr < lines.length) {
    let line = lines[curr];
    if (line.startsWith("commit")) {
      if (commit) {
        commits.push(commit);
      }

      commit = {
        hash: line.slice(7),
      };
    } else if (line.startsWith("Author: ")) {
      if (!commit) {
        throw new Error("expected commit");
      }
      commit.author = line.slice(8);
    } else if (line.startsWith("Date: ")) {
      if (!commit) {
        throw new Error("expected commit");
      }
      commit.date = line.slice(8);
    } else if (line.startsWith("    ")) {
      if (!commit) {
        throw new Error("expected commit");
      }
      if (!commit.msg) commit.msg = "";
      if (line.trim() !== "") {
        commit.msg = commit.msg + (commit.msg ? "\n" : "") + `${line.slice(4)}`;
      }
    }
    curr += 1;
  }
  if (commit) commits.push(commit);
  return commits;
}

export default function getCommits({
  ref,
  filePath,
  since,
}: {
  ref: string;
  filePath?: string;
  since?: Date;
}) {
  const fileArgs = filePath ? ["--", filePath] : [];
  const sinceArgs = since ? [`--since=${since.toJSON()}`] : [];

  const revstring = execFileSync(
    "git",
    [
      "rev-list",
      "--format=medium",
      "--max-count=1",
      ...sinceArgs,
      ref,
      ...fileArgs,
    ],
    {
      encoding: "utf-8",
    }
  );
  const revs = revstring.trim();

  return parseRevString(revs);
}
