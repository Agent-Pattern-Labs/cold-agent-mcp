import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const packageMetadata = require("../package.json");
const serverMetadata = require("../server.json");

assertEqual(
  packageMetadata.version,
  serverMetadata.version,
  "package.json and server.json versions",
);
assertEqual(
  packageMetadata.name,
  serverMetadata.packages?.[0]?.identifier,
  "npm package identifiers",
);
assertEqual(
  packageMetadata.mcpName,
  serverMetadata.name,
  "MCP registry names",
);

if ((serverMetadata.description || "").length > 100) {
  throw new Error("server.json description must be 100 characters or fewer");
}

const supportedInputFormats = new Set([
  "string",
  "number",
  "boolean",
  "filepath",
]);
for (const pkg of serverMetadata.packages || []) {
  for (const input of pkg.environmentVariables || []) {
    if (!supportedInputFormats.has(input.format || "string")) {
      throw new Error(
        `server.json input ${input.name} has unsupported format ${input.format}`,
      );
    }
  }
}

console.log("Package and MCP server metadata are consistent.");

function assertEqual(left, right, label) {
  if (left !== right) {
    throw new Error(`${label} do not match: ${left} !== ${right}`);
  }
}
