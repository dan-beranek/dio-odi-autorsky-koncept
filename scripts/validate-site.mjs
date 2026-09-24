import { access, readFile, stat } from "node:fs/promises";
import { constants } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const siteUrl = "https://dan-beranek.github.io/dio-odi-autorsky-koncept/";
const projectPath = "/dio-odi-autorsky-koncept/";
const imageUrl = `${siteUrl}assets/dio-odi-social-v1.png`;
const robots = "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";
const imageAlt = {
  cs: "DIO/ODI – AI visibility, entity resolution a znalostní infrastruktura",
  en: "DIO/ODI – AI visibility, entity resolution and knowledge infrastructure",
};

const pairs = [
  {
    cs: ["index.html", "", "DIO/ODI: autorský koncept – AI visibility a entity resolution", "DIO/ODI je autorský koncept pro AI visibility, entity resolution a znalostní infrastrukturu. Otevřený pilotům, společnému vývoji a strategickému kapitálu.", "DIO/ODI: IP pro AI visibility a entity resolution", "Tři propojené hodnotové větve: tržní viditelnost, entitní data a ontologie digitální identity. Pro piloty, partnerství a strategický kapitál."],
    en: ["en/index.html", "en/", "DIO/ODI: Author-Led IP – AI Visibility & Entity Resolution", "DIO/ODI is author-led IP for AI visibility, entity resolution and knowledge infrastructure—open to pilots, co-development and strategic capital.", "DIO/ODI: IP for AI Visibility & Entity Resolution", "Three connected value tracks: market visibility, entity data and the ontology of digital identity—open to pilots, partnerships and strategic capital."],
  },
  {
    cs: ["dio-viditelnost/index.html", "dio-viditelnost/", "AI visibility: optimalizace digitální identity | DIO", "DIO řídí, jak jsou firmy, lidé a projekty rozpoznávány napříč webem, vyhledávači a AI – od analýzy výchozího stavu po měřitelnou intervenci.", "DIO pro AI visibility: řídit, jak systémy rozpoznají entitu", "Od analýzy výchozího stavu přes diagnostiku k měřitelné intervenci napříč webem, vyhledávači a AI."],
    en: ["en/ai-visibility/index.html", "en/ai-visibility/", "AI Visibility & Digital Identity Optimization | DIO", "DIO shapes how companies, people and projects are recognized across the web, search and AI—from an identity baseline to a measurable intervention.", "DIO for AI Visibility: Shape How Systems Recognize an Entity", "From identity baseline and diagnosis to measurable intervention across the web, search and AI."],
  },
  {
    cs: ["dio-ai-data/index.html", "dio-ai-data/", "Entity resolution a znalostní grafy pro AI | DIO", "DIO pro entity resolution, znalostní grafy, RAG a provenance. Technický pilot pro spolehlivější rekonstrukci entit napříč datovými a AI systémy.", "DIO pro entity resolution a znalostní grafy", "Technický a výzkumný pilot pro konzistentnější rekonstrukci entit v datech, RAG a AI systémech."],
    en: ["en/entity-resolution/index.html", "en/entity-resolution/", "Entity Resolution & Knowledge Graphs for AI | DIO", "DIO for entity resolution, knowledge graphs, RAG and provenance. A technical pilot for more reliable entity reconstruction across data and AI systems.", "DIO for Entity Resolution & Knowledge Graphs", "A technical and research pilot for more consistent entity reconstruction across data, RAG and AI systems."],
  },
  {
    cs: ["odi/index.html", "odi/", "Ontology of Digital Identity a znalostní infrastruktura | ODI", "ODI formalizuje digitální identitu pro ontologie, znalostní grafy, výzkum AI a standardizaci. Koncept je otevřený výzkumným a licenčním partnerstvím.", "ODI: ontologie digitální identity", "Teoretická, terminologická a IP vrstva pro ontologie, znalostní grafy, výzkum AI a standardizaci."],
    en: ["en/ontology-of-digital-identity/index.html", "en/ontology-of-digital-identity/", "Ontology of Digital Identity & Knowledge Infrastructure | ODI", "ODI formalizes digital identity for ontologies, knowledge graphs, AI R&D and standards—author-led IP open to research and licensing partnerships.", "ODI: An Ontology of Digital Identity", "A theoretical, terminological and IP layer for ontologies, knowledge graphs, AI research and standards."],
  },
  {
    cs: ["partnerstvi/index.html", "partnerstvi/", "Investiční teze, partnerství a licence | DIO/ODI", "Piloty, licence, společný vývoj a investiční vstup do DIO/ODI: AI visibility, entity resolution a znalostní infrastruktura.", "DIO/ODI hledá piloty, partnery a strategický kapitál", "Vyberte konkrétní vstup: pilot, společný vývoj, výzkumné partnerství, licence nebo investice."],
    en: ["en/partnerships/index.html", "en/partnerships/", "Investment Thesis, Partnerships & Licensing | DIO/ODI", "Pilots, licensing, co-development and investment paths across DIO/ODI: AI visibility, entity resolution and knowledge infrastructure.", "DIO/ODI Is Open to Pilots, Partners & Strategic Capital", "Choose a concrete path: pilot, co-development, research partnership, licensing or investment."],
  },
  {
    cs: ["dukazy/index.html", "dukazy/", "DIO/ODI: důkazy, publikace a stav validace", "Publikace, DOI, distribuční vrstvy a stav validace DIO/ODI. Co je doložitelné, co je operační hypotéza a co musí ověřit externí pilot.", "DIO/ODI: co je doloženo a co má ověřit pilot", "Publikace, DOI, zdrojová stopa, pracovní hypotézy a transparentně oddělený stav validace."],
    en: ["en/evidence/index.html", "en/evidence/", "DIO/ODI Evidence, Publications & Validation Status", "Publications, DOI records, distribution layers and validation status: what DIO/ODI documents, what remains a hypothesis and what external pilots must test.", "DIO/ODI: What Is Documented—and What a Pilot Must Test", "Publications, DOI records, source trail, working hypotheses and a transparent validation status."],
  },
  {
    cs: ["autor/index.html", "autor/", "Daniel Beránek – autor DIO a ODI", "Daniel Beránek je autorem Digital Identity Optimization a Ontology of Digital Identity. Geneze obou konceptů, odborné zázemí a autorská IP.", "Daniel Beránek, autor konceptů DIO a ODI", "Geneze Digital Identity Optimization a Ontology of Digital Identity, odborné zázemí a autorská IP vrstva."],
    en: ["en/author/index.html", "en/author/", "Daniel Beránek – Author of DIO and ODI", "Daniel Beránek is the author of Digital Identity Optimization and Ontology of Digital Identity. Explore the concepts’ origins, expertise and IP layer.", "Daniel Beránek, Author of DIO and ODI", "The origins of Digital Identity Optimization and Ontology of Digital Identity, the author’s background and the IP layer."],
  },
];

const failures = [];
const descriptions = new Set();

function fail(scope, message) {
  failures.push(`${scope}: ${message}`);
}

function decode(value = "") {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function attrs(tag) {
  return Object.fromEntries([...tag.matchAll(/([:\w-]+)=(?:"([^"]*)"|'([^']*)')/g)].map((match) => [match[1], decode(match[2] ?? match[3] ?? "")]));
}

function metas(html) {
  return [...html.matchAll(/<meta\b[^>]*>/gi)].map((match) => attrs(match[0]));
}

function links(html) {
  return [...html.matchAll(/<link\b[^>]*>/gi)].map((match) => attrs(match[0]));
}

function one(values, scope, label) {
  if (values.length !== 1) {
    fail(scope, `${label} must occur exactly once (found ${values.length})`);
    return undefined;
  }
  return values[0];
}

function expect(scope, actual, expected, label) {
  if (actual !== expected) fail(scope, `${label} mismatch\n  expected: ${expected}\n  actual:   ${actual}`);
}

const publicFiles = new Map();
for (const pair of pairs) {
  const csUrl = `${siteUrl}${pair.cs[1]}`;
  const enUrl = `${siteUrl}${pair.en[1]}`;
  for (const lang of ["cs", "en"]) {
    const [file, path, title, description, socialTitle, socialDescription] = pair[lang];
    const scope = `/${path}`;
    const fullPath = join(root, file);
    const html = await readFile(fullPath, "utf8");
    const url = `${siteUrl}${path}`;
    publicFiles.set(`${projectPath}${path}`, fullPath);

    expect(scope, html.match(/<html\s+lang="([^"]+)"/)?.[1], lang, "html lang");
    const titleTags = [...html.matchAll(/<title>([\s\S]*?)<\/title>/gi)].map((match) => decode(match[1].trim()));
    expect(scope, one(titleTags, scope, "title"), title, "title");

    const meta = metas(html);
    const descriptionValues = meta.filter((item) => item.name === "description").map((item) => item.content);
    const actualDescription = one(descriptionValues, scope, "meta description");
    expect(scope, actualDescription, description, "description");
    if (descriptions.has(actualDescription)) fail(scope, "description is not unique");
    descriptions.add(actualDescription);
    if (meta.some((item) => item.name === "title")) fail(scope, "redundant meta name=title found");
    if (meta.some((item) => item.name === "keywords")) fail(scope, "meta keywords found");
    expect(scope, one(meta.filter((item) => item.name === "robots").map((item) => item.content), scope, "robots meta"), robots, "robots meta");

    const link = links(html);
    expect(scope, one(link.filter((item) => item.rel === "canonical").map((item) => item.href), scope, "canonical"), url, "canonical");
    const alternates = Object.fromEntries(link.filter((item) => item.rel === "alternate" && item.hreflang).map((item) => [item.hreflang, item.href]));
    expect(scope, Object.keys(alternates).length, 3, "hreflang count");
    expect(scope, alternates["cs-CZ"], csUrl, "cs-CZ hreflang");
    expect(scope, alternates.en, enUrl, "en hreflang");
    expect(scope, alternates["x-default"], csUrl, "x-default hreflang");

    const byProperty = Object.fromEntries(meta.filter((item) => item.property).map((item) => [item.property, item.content]));
    const byName = Object.fromEntries(meta.filter((item) => item.name).map((item) => [item.name, item.content]));
    expect(scope, byProperty["og:type"], "website", "og:type");
    expect(scope, byProperty["og:site_name"], "DIO/ODI", "og:site_name");
    expect(scope, byProperty["og:title"], socialTitle, "og:title");
    expect(scope, byProperty["og:description"], socialDescription, "og:description");
    expect(scope, byProperty["og:url"], url, "og:url");
    expect(scope, byProperty["og:image"], imageUrl, "og:image");
    expect(scope, byProperty["og:image:width"], "1200", "og:image:width");
    expect(scope, byProperty["og:image:height"], "630", "og:image:height");
    expect(scope, byProperty["og:image:type"], "image/png", "og:image:type");
    expect(scope, byProperty["og:image:alt"], imageAlt[lang], "og:image:alt");
    expect(scope, byProperty["og:locale"], lang === "cs" ? "cs_CZ" : "en_US", "og:locale");
    expect(scope, byProperty["og:locale:alternate"], lang === "cs" ? "en_US" : "cs_CZ", "og:locale:alternate");
    expect(scope, byName["twitter:card"], "summary_large_image", "twitter:card");
    expect(scope, byName["twitter:title"], socialTitle, "twitter:title");
    expect(scope, byName["twitter:description"], socialDescription, "twitter:description");
    expect(scope, byName["twitter:image"], imageUrl, "twitter:image");
    expect(scope, byName["twitter:image:alt"], imageAlt[lang], "twitter:image:alt");

    const jsonScripts = [...html.matchAll(/<script\s+type="application\/ld\+json">([\s\S]*?)<\/script>/gi)].map((match) => match[1]);
    const json = one(jsonScripts, scope, "JSON-LD block");
    if (json) {
      try {
        const data = JSON.parse(json);
        expect(scope, data.url, url, "JSON-LD url");
        expect(scope, data.name, title, "JSON-LD name");
        expect(scope, data.inLanguage, lang === "cs" ? "cs-CZ" : "en", "JSON-LD inLanguage");
        const person = data.author ?? data.creator;
        expect(scope, person?.["@type"], "Person", "JSON-LD author type");
        expect(scope, person?.name, "Daniel Beránek", "JSON-LD author name");
        if (JSON.stringify(data).includes('"Organization"')) fail(scope, "DIO/ODI must not be represented as an Organization");
      } catch (error) {
        fail(scope, `invalid JSON-LD: ${error.message}`);
      }
    }

    const switchBlock = html.match(/<nav class="language-switch"[\s\S]*?<\/nav>/)?.[0] ?? "";
    if (!switchBlock.includes(`href="${projectPath}${lang === "cs" ? pair.en[1] : pair.cs[1]}"`)) fail(scope, "language switch does not point to the direct counterpart");
    if (!switchBlock.includes("CZ") || !switchBlock.includes("EN")) fail(scope, "language switch must show CZ and EN");

    if (lang === "en") {
      const body = (html.match(/<body\b[\s\S]*?<\/body>/i)?.[0] ?? "")
        .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
        .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replaceAll("Beránek", "Beranek");
      if (/[áčďéěíňóřšťúůýžÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]/.test(body)) fail(scope, "English visible content contains Czech diacritics");
      const czechUi = /\b(Přejít|Otevřít|Důkazy|Partnerství|Větve|Projekt|Kontaktovat|Přineste|Vyberte|Navrhnout|Prozkoumat|Prověřit)\b/;
      if (czechUi.test(body)) fail(scope, "English visible content contains Czech interface text");
    }
  }
}

for (const [publicPath, sourceFile] of publicFiles) {
  const html = await readFile(sourceFile, "utf8");
  const hrefs = [...html.matchAll(/href="([^"]+)"/g)].map((match) => match[1].split("#")[0]).filter((href) => href.startsWith(projectPath));
  for (const href of hrefs) {
    if (href === projectPath) continue;
    const relative = href.slice(projectPath.length);
    let target = join(root, relative);
    if (relative.endsWith("/")) target = join(target, "index.html");
    try {
      await access(target, constants.R_OK);
    } catch {
      fail(publicPath, `broken internal target: ${href}`);
    }
  }
}

const expectedUrls = pairs.flatMap((pair) => [pair.cs, pair.en]).map((entry) => `${siteUrl}${entry[1]}`);
const sitemap = await readFile(join(root, "sitemap.xml"), "utf8");
const sitemapLocs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
expect("sitemap.xml", sitemapLocs.length, 14, "canonical URL count");
expect("sitemap.xml", new Set(sitemapLocs).size, 14, "unique canonical URL count");
for (const url of expectedUrls) if (!sitemapLocs.includes(url)) fail("sitemap.xml", `missing canonical URL ${url}`);
for (const pair of pairs) {
  const csUrl = `${siteUrl}${pair.cs[1]}`;
  const enUrl = `${siteUrl}${pair.en[1]}`;
  for (const url of [csUrl, enUrl]) {
    const escapedUrl = url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const block = sitemap.match(new RegExp(`<url>\\s*<loc>${escapedUrl}<\\/loc>([\\s\\S]*?)<\\/url>`))?.[1] ?? "";
    if (!block.includes(`hreflang="cs-CZ" href="${csUrl}"`)) fail("sitemap.xml", `${url} missing cs-CZ alternate`);
    if (!block.includes(`hreflang="en" href="${enUrl}"`)) fail("sitemap.xml", `${url} missing en alternate`);
    if (!block.includes(`hreflang="x-default" href="${csUrl}"`)) fail("sitemap.xml", `${url} missing x-default alternate`);
  }
}

const imagePath = join(root, "assets/dio-odi-social-v1.png");
const image = await readFile(imagePath);
const imageInfo = await stat(imagePath);
if (image.subarray(1, 4).toString("ascii") !== "PNG") fail("social image", "file is not PNG");
expect("social image", image.readUInt32BE(16), 1200, "width");
expect("social image", image.readUInt32BE(20), 630, "height");
if (imageInfo.size >= 1_000_000) fail("social image", `file should remain below 1 MB (found ${imageInfo.size} bytes)`);

try {
  await access(join(root, "robots.txt"), constants.F_OK);
  fail("robots.txt", "must not exist inside the project subdirectory");
} catch {
  // Expected: project-scoped robots.txt cannot control the GitHub Pages host root.
}

if (failures.length) {
  console.error(`Validation failed with ${failures.length} issue(s):\n\n${failures.map((item) => `- ${item}`).join("\n")}`);
  process.exit(1);
}

console.log("Validated 14 pages, bilingual metadata, reciprocal hreflang, JSON-LD, sitemap, internal routes and 1200×630 social image.");
