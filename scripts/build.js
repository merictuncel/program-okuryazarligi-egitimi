/**
 * Vercel build girişi.
 * NEXT_ADAPTER_PATH unset edilmezse Next 16 + Vercel onBuildComplete
 * next-server.js.nft.json ENOENT ile çöker (#96646).
 */
const { spawnSync } = require("child_process");
const path = require("path");
const fs = require("fs");

function run(command, args) {
  console.log(`> ${command} ${args.join(" ")}`);
  const result = spawnSync(command, args, {
    stdio: "inherit",
    env: process.env,
    shell: true,
    cwd: process.cwd(),
  });
  if (result.status !== 0) {
    process.exit(result.status === null ? 1 : result.status);
  }
}

// Vercel builder'ın enjekte ettiği adapter'ı kapat
delete process.env.NEXT_ADAPTER_PATH;
delete process.env.NEXT_ENABLE_ADAPTER;

console.log("build: NEXT_ADAPTER_PATH unset");
console.log("build: next =", require(path.join(process.cwd(), "node_modules/next/package.json")).version);

run("npx", ["prisma", "generate"]);
run("npx", ["next", "build", "--webpack"]);

// Yedek: adapter yine de dosyayı isterse
require(path.join(__dirname, "ensure-nft.js"));

// Son kontrol
const nft = path.join(process.cwd(), ".next", "next-server.js.nft.json");
if (!fs.existsSync(nft)) {
  fs.mkdirSync(path.dirname(nft), { recursive: true });
  fs.writeFileSync(nft, JSON.stringify({ version: 1, files: [] }));
  console.log("build: emergency next-server.js.nft.json written");
}

console.log("build: OK");
