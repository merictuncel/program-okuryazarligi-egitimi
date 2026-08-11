/**
 * Vercel onBuildComplete bazen next-server.js.nft.json ister.
 * Next 16.3 + adapter kombinasyonunda dosya üretilmeyebilir — yedek oluştur.
 */
const fs = require("fs");
const path = require("path");

const dist = path.join(process.cwd(), ".next");
const target = path.join(dist, "next-server.js.nft.json");
const minimal = path.join(dist, "next-minimal-server.js.nft.json");

if (!fs.existsSync(dist)) {
  console.warn("ensure-nft: .next yok, atlanıyor");
  process.exit(0);
}

if (!fs.existsSync(target)) {
  if (fs.existsSync(minimal)) {
    fs.copyFileSync(minimal, target);
    console.log("ensure-nft: next-minimal-server.js.nft.json kopyalandı → next-server.js.nft.json");
  } else {
    fs.writeFileSync(
      target,
      JSON.stringify({ version: 1, files: [] }),
      "utf8",
    );
    console.log("ensure-nft: boş next-server.js.nft.json oluşturuldu");
  }
} else {
  console.log("ensure-nft: next-server.js.nft.json zaten var");
}
