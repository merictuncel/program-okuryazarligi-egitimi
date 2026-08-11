/**
 * Vercel build girişi.
 * NEXT_ADAPTER_PATH, Next 16'da onBuildComplete sırasında
 * next-server.js.nft.json ENOENT üretir (#96646).
 */
const { spawnSync } = require("child_process");
const path = require("path");
const fs = require("fs");

function cleanEnv() {
  const env = { ...process.env };
  delete env.NEXT_ADAPTER_PATH;
  delete env.NEXT_ENABLE_ADAPTER;
  // Boş string de Rust tarafında "adapter var" sayılabiliyor
  env.NEXT_ADAPTER_PATH = undefined;
  return Object.fromEntries(
    Object.entries(env).filter(
      ([key, value]) =>
        value !== undefined &&
        key !== "NEXT_ADAPTER_PATH" &&
        key !== "NEXT_ENABLE_ADAPTER",
    ),
  );
}

function run(command, args, env) {
  console.log(`> ${command} ${args.join(" ")}`);
  const result = spawnSync(command, args, {
    stdio: "inherit",
    env,
    shell: true,
    cwd: process.cwd(),
  });
  if (result.status !== 0) {
    process.exit(result.status === null ? 1 : result.status);
  }
}

const env = cleanEnv();
console.log("build: NEXT_ADAPTER_PATH unset =", !("NEXT_ADAPTER_PATH" in env));
console.log(
  "build: next =",
  require(path.join(process.cwd(), "node_modules/next/package.json")).version,
);

run("npx", ["prisma", "generate"], env);
run("npx", ["next", "build", "--webpack"], env);

require(path.join(__dirname, "ensure-nft.js"));

const nft = path.join(process.cwd(), ".next", "next-server.js.nft.json");
if (!fs.existsSync(nft)) {
  fs.writeFileSync(nft, JSON.stringify({ version: 1, files: [] }));
  console.log("build: emergency next-server.js.nft.json written");
}

console.log("build: OK");
