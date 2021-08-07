import React from "react";
import ReactDOMServer from "react-dom/server";
import fs from "fs";

import { processDir } from "./process-dir.js";
import { Tree } from "./Tree.tsx";

const defaultExcludedPaths = [];

const main = async () => {
  const maxDepth = process.env["max_depth"] || 9;
  const colorEncoding = process.env["color_encoding"] || "type";

  const excludedPaths = fs.existsSync(".gitignore")
    ? fs
        .readFileSync(".gitignore", { encoding: "utf-8" })
        .trim()
        .split("\n")
        .map((s) => s.trim())
    : defaultExcludedPaths;

  const data = await processDir(`./`, [...excludedPaths, ".git"]);

  const componentCodeString = ReactDOMServer.renderToStaticMarkup(
    <Tree data={data} maxDepth={+maxDepth} colorEncoding={colorEncoding} />
  );

  const outputFile = process.env["output_file"] || "./diagram.svg";

  await fs.writeFileSync(outputFile, componentCodeString);
};

main();
