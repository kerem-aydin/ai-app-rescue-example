// Fails the build if anything that looks like a secret key ends up in the browser bundle.
import fs from "node:fs";
import path from "node:path";

const dir = process.argv[2] ?? "dist";
const patterns = [/mk_live_[A-Za-z0-9_]+/, /sk_live_[A-Za-z0-9]+/, /MAIL_API_KEY/];
const files = fs.readdirSync(dir, { recursive: true }).map(String).filter((f) => /\.(js|html|css|map)$/.test(f));
const hits = [];
for (const f of files) {
  const text = fs.readFileSync(path.join(dir, f), "utf8");
  for (const p of patterns) if (p.test(text)) hits.push(`${f}: ${p}`);
}
if (hits.length) {
  console.error(`Secret scan FAILED (${hits.length}):\n` + hits.join("\n"));
  process.exit(1);
}
console.log(`Secret scan passed: ${files.length} files in ${dir}/, no keys found.`);
