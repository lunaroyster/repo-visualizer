import React from 'react';
import ReactDOMServer from 'react-dom/server';
import fs from "fs"

import { processDir } from "./process-dir.js"
import { Tree } from "./Tree.tsx"

const main = async () => {
  const maxDepth = process.env["max_depth"] || 9
  const colorEncoding = process.env["color_encoding"] || "type"
  const excludedPathsString = process.env["excluded_paths"] || "node_modules,bower_components,dist,out,build,eject,.next,.netlify,.yarn,.git,.vscode,package-lock.json,yarn.lock,.npm_cache,.jestcache"
  const excludedPaths = excludedPathsString.split(",").map(str => str.trim())
  const data = await processDir(`./`, excludedPaths);

  const componentCodeString = ReactDOMServer.renderToStaticMarkup(
    <Tree data={data} maxDepth={+maxDepth} colorEncoding={colorEncoding} />
  );

  const outputFile = process.env["output_file"] || "./diagram.svg"

  await fs.writeFileSync(outputFile, componentCodeString)
}

main()