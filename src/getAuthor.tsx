import { execFileSync } from "child_process";

export default function getAuthor({
  ref,
  filePath,
  since,
}: {
  ref: string;
  filePath?: string;
  since?: Date;
}) {
  const fileArgs = filePath ? ["--", filePath] : [];

  const shortlog = execFileSync(
    "git",
    [
      "shortlog",
      "-n",
      "-s",
      ref,
      ...fileArgs,
    ],
    {
      encoding: "utf-8",
    }
  );
  
  const topAuthor = shortlog.split('\n')[0].split('\t')[1];

  return topAuthor;
}
