import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const buildDirectory = fileURLToPath(
  new URL("../dist/client/", import.meta.url),
);

async function findHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name);
      return entry.isDirectory()
        ? findHtmlFiles(path)
        : entry.name.endsWith(".html")
          ? [path]
          : [];
    }),
  );
  return files.flat();
}

const htmlFiles = await findHtmlFiles(buildDirectory);
const failures = [];

for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  if (html.trim() === "[object Object]") {
    failures.push(`${relative(buildDirectory, file)} contains [object Object]`);
  } else if (!/^<!doctype html>/i.test(html)) {
    failures.push(
      `${relative(buildDirectory, file)} is not a complete HTML page`,
    );
  }
}

if (htmlFiles.length === 0) {
  failures.push("no generated HTML files were found");
}

if (failures.length > 0) {
  throw new Error(`Invalid build output:\n${failures.join("\n")}`);
}

console.log(`Validated ${htmlFiles.length} generated HTML files.`);
