import sharp from "sharp";
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "..");
const brandDir = path.join(repoRoot, "assets", "brand");
const outputDir = path.join(brandDir, "raster");
const sizes = [128, 256, 512];

const variants = [
  {
    name: "light",
    source: "symbol.svg",
    jpegBackground: "#f7f8fb",
  },
  {
    name: "inverse",
    source: "symbol-inverse.svg",
    jpegBackground: "#080b12",
  },
];

function parseHex(hex) {
  const value = hex.replace("#", "");
  return {
    r: Number.parseInt(value.slice(0, 2), 16),
    g: Number.parseInt(value.slice(2, 4), 16),
    b: Number.parseInt(value.slice(4, 6), 16),
  };
}

let generated = 0;

for (const variant of variants) {
  const svg = await readFile(path.join(brandDir, variant.source));
  const background = parseHex(variant.jpegBackground);

  for (const size of sizes) {
    const sizeDir = path.join(outputDir, String(size));
    await mkdir(sizeDir, { recursive: true });

    const base = sharp(svg, { density: 1024, failOn: "error" }).resize(
      size,
      size,
      {
        fit: "contain",
        position: "centre",
        kernel: "lanczos3",
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    );

    const filename = `symbol-${variant.name}-${size}`;

    await Promise.all([
      base
        .clone()
        .png({ compressionLevel: 9, palette: true, quality: 100 })
        .toFile(path.join(sizeDir, `${filename}.png`)),
      base
        .clone()
        .flatten({ background })
        .jpeg({
          quality: 90,
          mozjpeg: true,
          chromaSubsampling: "4:4:4",
        })
        .toFile(path.join(sizeDir, `${filename}.jpg`)),
      base
        .clone()
        .webp({ quality: 90, alphaQuality: 100, effort: 6 })
        .toFile(path.join(sizeDir, `${filename}.webp`)),
      base
        .clone()
        .avif({ quality: 70, effort: 6, chromaSubsampling: "4:4:4" })
        .toFile(path.join(sizeDir, `${filename}.avif`)),
    ]);

    generated += 4;
    process.stdout.write(`Generated ${filename}.{png,jpg,webp,avif}\n`);
  }
}

if (generated !== 24) {
  throw new Error(`Expected 24 raster assets, generated ${generated}.`);
}

process.stdout.write(`Successfully generated ${generated} raster assets in ${outputDir}\n`);
