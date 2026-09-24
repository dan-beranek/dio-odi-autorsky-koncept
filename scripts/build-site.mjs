import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { translations } from "./translations.mjs";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const origin = "https://dan-beranek.github.io";
const projectPath = "/dio-odi-autorsky-koncept/";
const siteUrl = `${origin}${projectPath}`;
const imageUrl = `${siteUrl}assets/dio-odi-social-v1.png`;
const imageAlt = {
  cs: "DIO/ODI – AI visibility, entity resolution a znalostní infrastruktura",
  en: "DIO/ODI – AI visibility, entity resolution and knowledge infrastructure",
};
const robots = "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1";

const pages = [
  {
    key: "home",
    active: "home",
    csFile: "index.html",
    enFile: "en/index.html",
    csPath: "",
    enPath: "en/",
    csTitle: "DIO/ODI: autorský koncept – AI visibility a entity resolution",
    csDescription: "DIO/ODI je autorský koncept pro AI visibility, entity resolution a znalostní infrastrukturu. Otevřený pilotům, společnému vývoji a strategickému kapitálu.",
    enTitle: "DIO/ODI: Author-Led IP – AI Visibility & Entity Resolution",
    enDescription: "DIO/ODI is author-led IP for AI visibility, entity resolution and knowledge infrastructure—open to pilots, co-development and strategic capital.",
    csSocialTitle: "DIO/ODI: IP pro AI visibility a entity resolution",
    csSocialDescription: "Tři propojené hodnotové větve: tržní viditelnost, entitní data a ontologie digitální identity. Pro piloty, partnerství a strategický kapitál.",
    enSocialTitle: "DIO/ODI: IP for AI Visibility & Entity Resolution",
    enSocialDescription: "Three connected value tracks: market visibility, entity data and the ontology of digital identity—open to pilots, partnerships and strategic capital.",
  },
  {
    key: "visibility",
    active: "visibility",
    csFile: "dio-viditelnost/index.html",
    enFile: "en/ai-visibility/index.html",
    csPath: "dio-viditelnost/",
    enPath: "en/ai-visibility/",
    csTitle: "AI visibility: optimalizace digitální identity | DIO",
    csDescription: "DIO řídí, jak jsou firmy, lidé a projekty rozpoznávány napříč webem, vyhledávači a AI – od analýzy výchozího stavu po měřitelnou intervenci.",
    enTitle: "AI Visibility & Digital Identity Optimization | DIO",
    enDescription: "DIO shapes how companies, people and projects are recognized across the web, search and AI—from an identity baseline to a measurable intervention.",
    csSocialTitle: "DIO pro AI visibility: řídit, jak systémy rozpoznají entitu",
    csSocialDescription: "Od analýzy výchozího stavu přes diagnostiku k měřitelné intervenci napříč webem, vyhledávači a AI.",
    enSocialTitle: "DIO for AI Visibility: Shape How Systems Recognize an Entity",
    enSocialDescription: "From identity baseline and diagnosis to measurable intervention across the web, search and AI.",
  },
  {
    key: "entity",
    active: "entity",
    csFile: "dio-ai-data/index.html",
    enFile: "en/entity-resolution/index.html",
    csPath: "dio-ai-data/",
    enPath: "en/entity-resolution/",
    csTitle: "Entity resolution a znalostní grafy pro AI | DIO",
    csDescription: "DIO pro entity resolution, znalostní grafy, RAG a provenance. Technický pilot pro spolehlivější rekonstrukci entit napříč datovými a AI systémy.",
    enTitle: "Entity Resolution & Knowledge Graphs for AI | DIO",
    enDescription: "DIO for entity resolution, knowledge graphs, RAG and provenance. A technical pilot for more reliable entity reconstruction across data and AI systems.",
    csSocialTitle: "DIO pro entity resolution a znalostní grafy",
    csSocialDescription: "Technický a výzkumný pilot pro konzistentnější rekonstrukci entit v datech, RAG a AI systémech.",
    enSocialTitle: "DIO for Entity Resolution & Knowledge Graphs",
    enSocialDescription: "A technical and research pilot for more consistent entity reconstruction across data, RAG and AI systems.",
  },
  {
    key: "odi",
    active: "odi",
    csFile: "odi/index.html",
    enFile: "en/ontology-of-digital-identity/index.html",
    csPath: "odi/",
    enPath: "en/ontology-of-digital-identity/",
    csTitle: "Ontology of Digital Identity a znalostní infrastruktura | ODI",
    csDescription: "ODI formalizuje digitální identitu pro ontologie, znalostní grafy, výzkum AI a standardizaci. Koncept je otevřený výzkumným a licenčním partnerstvím.",
    enTitle: "Ontology of Digital Identity & Knowledge Infrastructure | ODI",
    enDescription: "ODI formalizes digital identity for ontologies, knowledge graphs, AI R&D and standards—author-led IP open to research and licensing partnerships.",
    csSocialTitle: "ODI: ontologie digitální identity",
    csSocialDescription: "Teoretická, terminologická a IP vrstva pro ontologie, znalostní grafy, výzkum AI a standardizaci.",
    enSocialTitle: "ODI: An Ontology of Digital Identity",
    enSocialDescription: "A theoretical, terminological and IP layer for ontologies, knowledge graphs, AI research and standards.",
  },
  {
    key: "partnerships",
    active: "partnerships",
    csFile: "partnerstvi/index.html",
    enFile: "en/partnerships/index.html",
    csPath: "partnerstvi/",
    enPath: "en/partnerships/",
    csTitle: "Investiční teze, partnerství a licence | DIO/ODI",
    csDescription: "Piloty, licence, společný vývoj a investiční vstup do DIO/ODI: AI visibility, entity resolution a znalostní infrastruktura.",
    enTitle: "Investment Thesis, Partnerships & Licensing | DIO/ODI",
    enDescription: "Pilots, licensing, co-development and investment paths across DIO/ODI: AI visibility, entity resolution and knowledge infrastructure.",
    csSocialTitle: "DIO/ODI hledá piloty, partnery a strategický kapitál",
    csSocialDescription: "Vyberte konkrétní vstup: pilot, společný vývoj, výzkumné partnerství, licence nebo investice.",
    enSocialTitle: "DIO/ODI Is Open to Pilots, Partners & Strategic Capital",
    enSocialDescription: "Choose a concrete path: pilot, co-development, research partnership, licensing or investment.",
  },
  {
    key: "evidence",
    active: "evidence",
    csFile: "dukazy/index.html",
    enFile: "en/evidence/index.html",
    csPath: "dukazy/",
    enPath: "en/evidence/",
    csTitle: "DIO/ODI: důkazy, publikace a stav validace",
    csDescription: "Publikace, DOI, distribuční vrstvy a stav validace DIO/ODI. Co je doložitelné, co je operační hypotéza a co musí ověřit externí pilot.",
    enTitle: "DIO/ODI Evidence, Publications & Validation Status",
    enDescription: "Publications, DOI records, distribution layers and validation status: what DIO/ODI documents, what remains a hypothesis and what external pilots must test.",
    csSocialTitle: "DIO/ODI: co je doloženo a co má ověřit pilot",
    csSocialDescription: "Publikace, DOI, zdrojová stopa, pracovní hypotézy a transparentně oddělený stav validace.",
    enSocialTitle: "DIO/ODI: What Is Documented—and What a Pilot Must Test",
    enSocialDescription: "Publications, DOI records, source trail, working hypotheses and a transparent validation status.",
  },
  {
    key: "author",
    active: "author",
    csFile: "autor/index.html",
    enFile: "en/author/index.html",
    csPath: "autor/",
    enPath: "en/author/",
    csTitle: "Daniel Beránek – autor DIO a ODI",
    csDescription: "Daniel Beránek je autorem Digital Identity Optimization a Ontology of Digital Identity. Geneze obou konceptů, odborné zázemí a autorská IP.",
    enTitle: "Daniel Beránek – Author of DIO and ODI",
    enDescription: "Daniel Beránek is the author of Digital Identity Optimization and Ontology of Digital Identity. Explore the concepts’ origins, expertise and IP layer.",
    csSocialTitle: "Daniel Beránek, autor konceptů DIO a ODI",
    csSocialDescription: "Geneze Digital Identity Optimization a Ontology of Digital Identity, odborné zázemí a autorská IP vrstva.",
    enSocialTitle: "Daniel Beránek, Author of DIO and ODI",
    enSocialDescription: "The origins of Digital Identity Optimization and Ontology of Digital Identity, the author’s background and the IP layer.",
  },
];

const navItems = {
  cs: [
    ["visibility", "DIO pro viditelnost"],
    ["entity", "DIO pro AI a data"],
    ["odi", "ODI"],
    ["evidence", "Důkazy"],
    ["author", "Autor"],
    ["partnerships", "Partnerství"],
  ],
  en: [
    ["visibility", "AI visibility"],
    ["entity", "AI & entity data"],
    ["odi", "ODI"],
    ["evidence", "Evidence"],
    ["author", "Author"],
    ["partnerships", "Partnerships"],
  ],
};

const localPaths = Object.fromEntries(pages.flatMap((page) => [
  [`cs:${page.key}`, `${projectPath}${page.csPath}`],
  [`en:${page.key}`, `${projectPath}${page.enPath}`],
]));

function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function canonical(page, lang) {
  return `${siteUrl}${lang === "cs" ? page.csPath : page.enPath}`;
}

function structuredData(page, lang) {
  const isHome = page.key === "home";
  const url = canonical(page, lang);
  const title = page[`${lang}Title`];
  const description = page[`${lang}Description`];
  const person = {
    "@type": "Person",
    "@id": "https://danielberanek.cz/#person",
    name: "Daniel Beránek",
    url: "https://danielberanek.cz/",
  };
  const data = {
    "@context": "https://schema.org",
    "@type": isHome ? "WebSite" : "WebPage",
    "@id": `${url}#${isHome ? "website" : "webpage"}`,
    url,
    name: title,
    description,
    inLanguage: lang === "cs" ? "cs-CZ" : "en",
    [isHome ? "creator" : "author"]: person,
    about: [
      {
        "@type": "DefinedTerm",
        name: "Digital Identity Optimization",
        alternateName: "DIO",
        description: lang === "cs"
          ? "Aplikovaný rámec pro AI visibility, entity resolution a optimalizaci entity napříč lidskými a strojovými systémy."
          : "An applied framework for AI visibility, entity resolution and entity optimization across human and machine systems.",
      },
      {
        "@type": "DefinedTerm",
        name: "Ontology of Digital Identity",
        alternateName: "ODI",
        description: lang === "cs"
          ? "Teoretická, výzkumná a ontologická vrstva zaměřená na rekonstrukci digitální identity."
          : "A theoretical, research and ontological layer focused on the reconstruction of digital identity.",
      },
    ],
    citation: [
      "https://doi.org/10.5281/zenodo.21610934",
      "https://doi.org/10.2139/ssrn.7247578",
      "https://doi.org/10.2139/ssrn.7396398",
    ],
  };
  if (!isHome) {
    data.isPartOf = {
      "@type": "WebSite",
      "@id": `${siteUrl}#website`,
      url: siteUrl,
      name: lang === "cs" ? "DIO/ODI – autorský koncept Daniela Beránka" : "DIO/ODI – an author-led concept by Daniel Beránek",
    };
  }
  return JSON.stringify(data, null, 2).replaceAll("<", "\\u003c");
}

function head(page, lang) {
  const title = page[`${lang}Title`];
  const description = page[`${lang}Description`];
  const socialTitle = page[`${lang}SocialTitle`];
  const socialDescription = page[`${lang}SocialDescription`];
  const url = canonical(page, lang);
  const csUrl = canonical(page, "cs");
  const enUrl = canonical(page, "en");
  const locale = lang === "cs" ? "cs_CZ" : "en_US";
  const alternateLocale = lang === "cs" ? "en_US" : "cs_CZ";
  return `<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta name="robots" content="${robots}">
  <meta name="theme-color" content="#080b12">
  <link rel="canonical" href="${url}">
  <link rel="alternate" hreflang="cs-CZ" href="${csUrl}">
  <link rel="alternate" hreflang="en" href="${enUrl}">
  <link rel="alternate" hreflang="x-default" href="${csUrl}">
  <link rel="alternate" type="text/plain" href="${siteUrl}llms.txt" title="LLM context">
  <link rel="icon" href="${projectPath}favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="${projectPath}assets/site.css">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="DIO/ODI">
  <meta property="og:title" content="${escapeHtml(socialTitle)}">
  <meta property="og:description" content="${escapeHtml(socialDescription)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${imageUrl}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:type" content="image/png">
  <meta property="og:image:alt" content="${escapeHtml(imageAlt[lang])}">
  <meta property="og:locale" content="${locale}">
  <meta property="og:locale:alternate" content="${alternateLocale}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(socialTitle)}">
  <meta name="twitter:description" content="${escapeHtml(socialDescription)}">
  <meta name="twitter:image" content="${imageUrl}">
  <meta name="twitter:image:alt" content="${escapeHtml(imageAlt[lang])}">
  <script type="application/ld+json">
${structuredData(page, lang)}
  </script>
  <script src="${projectPath}assets/site.js" defer></script>
</head>`;
}

function brandMark() {
  return `<svg class="brand-mark" viewBox="0 0 40 40" aria-hidden="true"><line x1="20" y1="7" x2="33" y2="16"/><line x1="20" y1="7" x2="7" y2="16"/><line x1="7" y1="16" x2="12" y2="31"/><line x1="12" y1="31" x2="28" y2="31"/><line x1="28" y1="31" x2="33" y2="16"/><line x1="20" y1="20" x2="20" y2="7"/><line x1="20" y1="20" x2="33" y2="16"/><line x1="20" y1="20" x2="28" y2="31"/><line x1="20" y1="20" x2="12" y2="31"/><line x1="20" y1="20" x2="7" y2="16"/><circle cx="20" cy="7" r="3"/><circle cx="33" cy="16" r="3"/><circle cx="28" cy="31" r="3"/><circle cx="12" cy="31" r="3"/><circle cx="7" cy="16" r="3"/><circle class="core" cx="20" cy="20" r="4"/></svg>`;
}

function navLinks(lang, active, mobile = false) {
  return navItems[lang].map(([key, label]) => {
    const classes = key === "partnerships" && !mobile ? ' class="nav-cta"' : "";
    const current = key === active ? ' aria-current="page"' : "";
    return `<a${classes}${current} href="${localPaths[`${lang}:${key}`]}">${label}</a>`;
  }).join("");
}

function languageSwitch(page, lang) {
  const csHref = localPaths[`cs:${page.key}`];
  const enHref = localPaths[`en:${page.key}`];
  const label = lang === "cs" ? "Volba jazyka" : "Language selection";
  const cs = lang === "cs"
    ? '<span aria-current="true">CZ</span>'
    : `<a href="${csHref}" hreflang="cs-CZ" lang="cs" aria-label="Czech version">CZ</a>`;
  const en = lang === "en"
    ? '<span aria-current="true">EN</span>'
    : `<a href="${enHref}" hreflang="en" lang="en" aria-label="English version">EN</a>`;
  return `<nav class="language-switch" aria-label="${label}" data-language-switch>${cs}<span aria-hidden="true">|</span>${en}</nav>`;
}

function header(page, lang) {
  const isCs = lang === "cs";
  return `<a class="skip-link" href="#obsah">${isCs ? "Přejít na obsah" : "Skip to content"}</a>
  <header class="site-header">
    <div class="header-inner">
      <a class="brand" href="${localPaths[`${lang}:home`]}" aria-label="${isCs ? "DIO/ODI – domů" : "DIO/ODI – home"}">${brandMark()}<span>DIO/ODI</span></a>
      <nav class="main-nav" aria-label="${isCs ? "Hlavní navigace" : "Main navigation"}">${navLinks(lang, page.active)}</nav>
      <div class="header-actions">
        ${languageSwitch(page, lang)}
        <button class="menu-toggle" type="button" aria-label="${isCs ? "Otevřít navigaci" : "Open navigation"}" aria-controls="mobile-nav" aria-expanded="false"><span></span></button>
      </div>
    </div>
    <nav class="mobile-nav" id="mobile-nav" aria-label="${isCs ? "Mobilní navigace" : "Mobile navigation"}">${navLinks(lang, page.active, true)}</nav>
  </header>`;
}

function footer(lang) {
  const isCs = lang === "cs";
  return `<footer class="site-footer"><div class="shell footer-main"><div><p class="footer-label">DIO/ODI</p><h2>${isCs ? "Identita jako optimalizační objekt." : "Identity as the optimization object."}</h2><p>${isCs ? "Autorský koncept Daniela Beránka pro tržní viditelnost, AI a entitní data a znalostní infrastrukturu." : "An author-led concept by Daniel Beránek for market visibility, AI and entity data, and knowledge infrastructure."}</p></div><div><p class="footer-label">${isCs ? "Větve" : "Branches"}</p><ul class="footer-links"><li><a href="${localPaths[`${lang}:visibility`]}">${isCs ? "DIO pro viditelnost" : "DIO for AI visibility"}</a></li><li><a href="${localPaths[`${lang}:entity`]}">${isCs ? "DIO pro AI a data" : "DIO for AI & entity data"}</a></li><li><a href="${localPaths[`${lang}:odi`]}">${isCs ? "ODI" : "ODI for knowledge infrastructure"}</a></li></ul></div><div><p class="footer-label">${isCs ? "Projekt" : "Project"}</p><ul class="footer-links"><li><a href="${localPaths[`${lang}:partnerships`]}">${isCs ? "Partnerství" : "Partnerships"}</a></li><li><a href="${localPaths[`${lang}:evidence`]}">${isCs ? "Důkazy" : "Evidence"}</a></li><li><a href="${localPaths[`${lang}:author`]}">${isCs ? "Autor" : "Author"}</a></li><li><a href="https://danielberanek.cz/manifest-digital-identity-optimization-dio/" target="_blank" rel="noopener noreferrer">Manifest <span aria-hidden="true">↗</span></a></li></ul></div></div><div class="shell footer-bottom"><span>© 2026 Daniel Beránek · DIO/ODI</span><span>${isCs ? "Autorské IP · Brno" : "Author-led IP · Brno"}</span></div></footer>`;
}

function translateMain(main, key) {
  const pageTranslations = translations[key];
  if (!pageTranslations) throw new Error(`Missing translations for ${key}`);
  const translated = main.replace(/>([^<]+)</g, (match, value) => {
    const leading = value.match(/^\s*/)[0];
    const trailing = value.match(/\s*$/)[0];
    const text = value.trim();
    if (!text || !Object.hasOwn(pageTranslations, text)) return match;
    return `>${leading}${pageTranslations[text]}${trailing}<`;
  });
  return translated
    .replaceAll(`${projectPath}partnerstvi/`, `${projectPath}en/partnerships/`)
    .replaceAll(`${projectPath}dio-viditelnost/`, `${projectPath}en/ai-visibility/`)
    .replaceAll(`${projectPath}dio-ai-data/`, `${projectPath}en/entity-resolution/`)
    .replaceAll(`${projectPath}dukazy/`, `${projectPath}en/evidence/`)
    .replaceAll(`${projectPath}autor/`, `${projectPath}en/author/`)
    .replaceAll(`${projectPath}odi/`, `${projectPath}en/ontology-of-digital-identity/`)
    .replaceAll(`href="${projectPath}"`, `href="${projectPath}en/"`)
    .replace('aria-label="Média, která rekonstruují digitální identitu"', 'aria-label="Media that reconstruct digital identity"')
    .replace('aria-label="K6 – plně propojený model šesti dimenzí digitální identity"', 'aria-label="K6 – a fully connected model of six digital-identity dimensions"')
    .replace('aria-label="Entita"', 'aria-label="Entity"')
    .replace('aria-label="Reprezentace"', 'aria-label="Representation"')
    .replace('aria-label="Interpretace"', 'aria-label="Interpretation"')
    .replace('aria-label="Důvěra"', 'aria-label="Trust"')
    .replace('aria-label="Vztah"', 'aria-label="Relationship"')
    .replace('aria-label="Rekonstrukce"', 'aria-label="Reconstruction"')
    .replace('id="intervence"', 'id="intervention"')
    .replace('href="#intervence"', 'href="#intervention"')
    .replace('id="otazky"', 'id="questions"')
    .replace('href="#otazky"', 'href="#questions"')
    .replace('id="nabidka"', 'id="proposal"')
    .replaceAll('#nabidka', '#proposal')
    .replace('id="publikace"', 'id="publications"')
    .replace('href="#publikace"', 'href="#publications"')
    .replace('id="geneze"', 'id="origins"')
    .replace('href="#geneze"', 'href="#origins"');
}

function document(page, lang, main) {
  return `<!doctype html>
<html lang="${lang}">
${head(page, lang)}
<body>
  ${header(page, lang)}

  ${main}

  ${footer(lang)}
</body>
</html>
`;
}

for (const page of pages) {
  const source = await readFile(join(projectRoot, page.csFile), "utf8");
  const main = source.match(/<main\b[\s\S]*?<\/main>/)?.[0];
  if (!main) throw new Error(`Missing <main> in ${page.csFile}`);

  const csOutput = document(page, "cs", main);
  const enOutput = document(page, "en", translateMain(main, page.key));
  const enTarget = join(projectRoot, page.enFile);
  await mkdir(dirname(enTarget), { recursive: true });
  await writeFile(join(projectRoot, page.csFile), csOutput);
  await writeFile(enTarget, enOutput);
}

console.log(`Generated ${pages.length * 2} localized HTML pages.`);
