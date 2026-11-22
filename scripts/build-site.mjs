import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { exposedAttributeTranslations, translations } from "./translations.mjs";

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

const artifactMetadataPath = join(projectRoot, "metadata/artifact-metadata.json");
const artifactMetadata = JSON.parse(await readFile(artifactMetadataPath, "utf8"));
const entityRegistryLock = JSON.parse(await readFile(join(projectRoot, "metadata/entity-registry.lock.json"), "utf8"));
const entityRegistry = JSON.parse(await readFile(join(projectRoot, entityRegistryLock.snapshot_path), "utf8"));
if (entityRegistry.status !== "canonical-approved" ||
    entityRegistry.registry_version !== entityRegistryLock.registry_version ||
    !/^[0-9a-f]{40}$/.test(entityRegistryLock.registry_commit ?? "")) {
  throw new Error("The pinned Entity Registry is missing, unapproved, or inconsistent with its lock.");
}
const entityByKey = new Map(entityRegistry.entities.map((entity) => [entity.key, entity]));
function requireEntity(key) {
  const entity = entityByKey.get(key);
  if (!entity || entity.status !== "active") throw new Error("Missing active Entity Registry record: " + key);
  return entity;
}
const personIdentity = requireEntity("person-daniel-beranek");
const frameworkIdentity = requireEntity("framework-dio-odi-author-led");
const referenceModelIdentity = requireEntity("project-dio-odi-reference-model");
const vocabularyIdentity = requireEntity("vocabulary-dio-odi-reference");
if (frameworkIdentity.url !== siteUrl || frameworkIdentity["@id"] !== siteUrl + "#framework") {
  throw new Error("Author-led framework identity diverges from the pinned Entity Registry.");
}
if (referenceModelIdentity.url !== "https://vocab.danielberanek.cz/" ||
    vocabularyIdentity.url !== "https://vocab.danielberanek.cz/dio-odi/") {
  throw new Error("Canonical DIO/ODI reference resources diverge from the pinned Entity Registry.");
}
if (artifactMetadata.author.id !== personIdentity["@id"] ||
    artifactMetadata.author.name !== personIdentity.name ||
    artifactMetadata.author.url !== personIdentity.url ||
    JSON.stringify(artifactMetadata.author.same_as) !== JSON.stringify(personIdentity.sameAs ?? [])) {
  throw new Error("Author metadata diverges from the pinned Entity Registry.");
}
artifactMetadata.author = {
  id: personIdentity["@id"],
  name: personIdentity.name,
  url: personIdentity.url,
  same_as: personIdentity.sameAs ?? []
};
const registrySource = artifactMetadata.registry_source;

async function loadKeywordRegistry() {
  const url = `https://raw.githubusercontent.com/${registrySource.repository}/${registrySource.ref}/${registrySource.file}`;
  try {
    const response = await fetch(url, { headers: { accept: "application/json" } });
    if (!response.ok) throw new Error("HTTP " + response.status);
    return { text: await response.text(), fetched_from: url, url };
  } catch (error) {
    const snapshotPath = join(projectRoot, registrySource.snapshot_path);
    try {
      return { text: await readFile(snapshotPath, "utf8"), fetched_from: registrySource.snapshot_path, url };
    } catch {
      throw new Error("Unable to fetch the canonical keyword registry and no committed snapshot is available: " + error.message);
    }
  }
}

function parseVersion(value) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(value ?? "");
  if (!match) throw new Error("Invalid semantic version in canonical keyword registry: " + value);
  return match.slice(1).map(Number);
}

function compareVersions(left, right) {
  for (let index = 0; index < 3; index += 1) {
    if (left[index] !== right[index]) return left[index] - right[index];
  }
  return 0;
}

function resolveCanonicalProfile(profileId, profile, keywordRegistry) {
  if (!profile || profile.status !== "canonical-approved") throw new Error("Missing or unapproved canonical keyword profile: " + profileId);
  const chunkOrder = keywordRegistry.export_policy?.chunk_order;
  if (!Array.isArray(chunkOrder) || chunkOrder.length !== 7) throw new Error("Canonical keyword chunk order is missing or incomplete.");
  const selections = profile.chunks ?? {};
  if (selections.C0_identity_invariant !== "all") throw new Error(profileId + ": C0 must be exported in full.");
  if (!Array.isArray(selections.C1_reconstruction_environments)) throw new Error(profileId + ": C1 must be an explicit ordered selection.");
  if (selections.C4_k6 !== "all" && selections.C4_k6 !== "none") throw new Error(profileId + ": K6 must be complete or absent.");

  const resolved = [];
  const resolvedChunks = {};
  const seen = new Set();
  for (const chunkName of chunkOrder) {
    const sourceTerms = keywordRegistry.chunks?.[chunkName]?.terms;
    if (!Array.isArray(sourceTerms)) throw new Error("Canonical chunk is missing terms: " + chunkName);
    if (!Object.hasOwn(selections, chunkName)) throw new Error(profileId + ": missing selector for " + chunkName);
    const selected = selections[chunkName];
    let terms;
    if (selected === "all") terms = sourceTerms;
    else if (selected === "none") terms = [];
    else if (Array.isArray(selected)) {
      terms = selected;
      if (chunkName !== "C2_work_positioning") {
        const positions = terms.map((term) => sourceTerms.indexOf(term));
        if (positions.some((position) => position < 0)
          || positions.some((position, index) => index > 0 && positions[index - 1] >= position)) {
          throw new Error(profileId + ": " + chunkName + " must be a unique subsequence of the canonical chunk order.");
        }
      } else if (new Set(terms.map((term) => term.toLowerCase())).size !== terms.length) {
        throw new Error(profileId + ": duplicate C2 terms are not permitted.");
      }
    } else {
      throw new Error(profileId + ": invalid selector for " + chunkName);
    }
    resolvedChunks[chunkName] = terms;
    for (const term of terms) {
      const folded = term.toLowerCase();
      if (!seen.has(folded)) { seen.add(folded); resolved.push(term); }
    }
  }

  if (profile.resolved_keywords !== undefined) throw new Error(profileId + ": derived page profiles must resolve from chunk selectors, not store a duplicate keyword list.");
  const c0 = new Set(keywordRegistry.chunks.C0_identity_invariant.terms);
  const requiredRationales = new Set(resolved.filter((term) => !c0.has(term)));
  const rationales = profile.term_rationales ?? {};
  if (Object.keys(rationales).length !== requiredRationales.size
    || [...requiredRationales].some((term) => !rationales[term]?.trim())
    || Object.keys(rationales).some((term) => !requiredRationales.has(term))) {
    throw new Error(profileId + ": every selected non-C0 term must have exactly one rationale.");
  }
  return { profile, keywords: resolved, chunks: resolvedChunks };
}

const registryResource = await loadKeywordRegistry();
const keywordRegistryText = registryResource.text;
const keywordRegistrySha256 = createHash("sha256").update(keywordRegistryText).digest("hex");
const keywordRegistry = JSON.parse(keywordRegistryText);
const registryVersion = parseVersion(keywordRegistry.registry_version);
const minimumRegistryVersion = parseVersion(registrySource.minimum_registry_version);
if (keywordRegistry.status !== registrySource.status_required
  || registryVersion[0] !== registrySource.compatible_major
  || compareVersions(registryVersion, minimumRegistryVersion) < 0) {
  throw new Error("Expected canonical-approved keyword registry >= " + registrySource.minimum_registry_version
    + " within compatible major " + registrySource.compatible_major
    + "; received " + keywordRegistry.registry_version + " (" + keywordRegistry.status + ").");
}


const pages = [
  {
    key: "home",
    active: "home",
    csFile: "index.html",
    enFile: "en/index.html",
    csPath: "",
    enPath: "en/",
    csTitle: "DIO/ODI: autorský koncept – AI visibility a entity resolution",
    csDescription: "DIO/ODI pomáhá digitálním systémům správně poznat, spojit a popsat firmy, lidi, produkty a projekty. Otevřeno pilotům, společnému vývoji a strategickému kapitálu.",
    enTitle: "DIO/ODI: Author-Led IP – AI Visibility & Entity Resolution",
    enDescription: "DIO/ODI is author-led IP for AI visibility, entity resolution and knowledge infrastructure—open to pilots, co-development and strategic capital.",
    csSocialTitle: "DIO/ODI: IP pro AI visibility a entity resolution",
    csSocialDescription: "DIO/ODI pomáhá digitálním systémům správně poznat, spojit a popsat firmy, lidi, produkty a projekty. Pro piloty, partnerství a strategický kapitál.",
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
    csDescription: "DIO pro entity resolution, znalostní grafy, RAG a diagnostiku rekonstrukce entit. Jeden z možných směrů aplikace vede k Agentic ER.",
    enTitle: "Entity Resolution & Knowledge Graphs for AI | DIO",
    enDescription: "DIO for entity resolution, knowledge graphs, RAG and entity-reconstruction diagnosis. One possible application direction is Agentic ER.",
    csSocialTitle: "DIO pro entity resolution a znalostní grafy",
    csSocialDescription: "Diagnostická taxonomie, aplikační mapování a návrh sémantického jističe pro Agentic ER jako jedna z možných cest.",
    enSocialTitle: "DIO for Entity Resolution & Knowledge Graphs",
    enSocialDescription: "A diagnostic taxonomy, application mappings and a proposed semantic guardrail for Agentic ER as one possible path.",
  },
  {
    key: "odi",
    active: "odi",
    csFile: "odi/index.html",
    enFile: "en/ontology-of-digital-identity/index.html",
    csPath: "odi/",
    enPath: "en/ontology-of-digital-identity/",
    csTitle: "Ontology of Digital Identity a znalostní infrastruktura | ODI",
    csDescription: "ODI propojuje kanonický Reference Vocabulary a Reference Model s odvozenými aplikačními mapováními a integrovaným Semantic Change Feed pro další využití v AI a znalostních systémech.",
    enTitle: "Ontology of Digital Identity & Knowledge Infrastructure | ODI",
    enDescription: "ODI connects the canonical Reference Vocabulary and Reference Model with derived application mappings and an integrated Semantic Change Feed for AI and knowledge systems.",
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
    csTitle: "DIO/ODI: od teorie k aplikacím | Vývoj a důkazy",
    csDescription: "Od ontologického základu DIO/ODI k referenční architektuře a návrhům konkrétních aplikací včetně sémantického jističe pro Agentic ER.",
    enTitle: "DIO/ODI: From Theory to Applications | Development & Evidence",
    enDescription: "From the DIO/ODI ontological foundation to a reference architecture and concrete application designs, including a semantic guardrail for Agentic ER.",
    csSocialTitle: "DIO/ODI: od teorie k aplikacím",
    csSocialDescription: "Ontologický a diagnostický základ, strojově čitelný model a návrh sémantického jističe pro Agentic ER.",
    enSocialTitle: "DIO/ODI: From Theory to Applications",
    enSocialDescription: "An ontological and diagnostic foundation, a machine-readable model and a proposed semantic guardrail for Agentic ER.",
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

const artifacts = artifactMetadata.artifacts;
if (!Array.isArray(artifacts) || artifacts.length !== pages.length) {
  throw new Error("Expected exactly one canonical keyword profile mapping for each logical page.");
}
const artifactsByPageKey = new Map();
const resolvedArtifacts = [];
for (const artifact of artifacts) {
  if (!artifact.id || !artifact.page_key || !artifact.keyword_profile_id || !Array.isArray(artifact.urls) || artifact.urls.length !== 2) {
    throw new Error("Each page artefact needs an ID, page_key, keyword_profile_id and two localized URLs.");
  }
  if (artifactsByPageKey.has(artifact.page_key)) throw new Error("Duplicate artifact page_key: " + artifact.page_key);
  const page = pages.find((candidate) => candidate.key === artifact.page_key);
  if (!page) throw new Error("Unknown page_key in artifact metadata: " + artifact.page_key);
  const expectedUrls = [`${siteUrl}${page.csPath}`, `${siteUrl}${page.enPath}`];
  if (JSON.stringify(artifact.urls) !== JSON.stringify(expectedUrls)) throw new Error(artifact.id + ": localized URLs do not match the page generator.");
  const projection = resolveCanonicalProfile(artifact.keyword_profile_id, keywordRegistry.surface_profiles?.[artifact.keyword_profile_id], keywordRegistry);
  const surface = projection.profile.surface ?? {};
  if (surface.repository !== "dan-beranek/dio-odi-autorsky-koncept"
    || surface.page_key !== artifact.page_key
    || JSON.stringify(surface.urls) !== JSON.stringify(artifact.urls)) {
    throw new Error(artifact.id + ": canonical registry surface identity does not match the local page mapping.");
  }
  artifactsByPageKey.set(artifact.page_key, { ...artifact, projection });
  resolvedArtifacts.push({
    ...artifact,
    status: projection.profile.status,
    scope: projection.profile.scope,
    purpose: projection.profile.purpose,
    keyword_chunks: projection.chunks,
    keywords: projection.keywords,
    keyword_rationales: projection.profile.term_rationales,
    pages: [
      { path: page.csFile, url: expectedUrls[0], in_language: "cs-CZ" },
      { path: page.enFile, url: expectedUrls[1], in_language: "en" },
    ],
  });
}
if (artifactsByPageKey.size !== pages.length) throw new Error("A page is missing its canonical surface profile.");

const navItems = {
  cs: [
    ["visibility", "DIO pro viditelnost"],
    ["entity", "DIO pro AI a data"],
    ["odi", "ODI"],
    ["evidence", "Vývoj"],
    ["author", "Autor"],
    ["partnerships", "Partnerství"],
  ],
  en: [
    ["visibility", "AI visibility"],
    ["entity", "AI & entity data"],
    ["odi", "ODI"],
    ["evidence", "Development"],
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
  const keywordProjection = artifactsByPageKey.get(page.key)?.projection;
  if (!keywordProjection) throw new Error("Missing resolved keyword profile for " + page.key);
  const url = canonical(page, lang);
  const title = page[`${lang}Title`];
  const description = page[`${lang}Description`];
  const isHome = page.key === "home";
  const isAuthorProfile = page.key === "author";
  const citations = [
    "https://doi.org/10.5281/zenodo.21610934",
    "https://doi.org/10.2139/ssrn.7247578",
    "https://doi.org/10.2139/ssrn.7396398",
    "https://dx.doi.org/10.2139/ssrn.7590979",
    "https://doi.org/10.5281/zenodo.23269323",
    "https://doi.org/10.5281/zenodo.24085589",
    "https://vocab.danielberanek.cz/semantic-change-feed/",
    "https://arxiv.org/abs/2610.37407",
    "https://doi.org/10.5281/zenodo.24123229",
    "https://doi.org/10.5281/zenodo.24123228"
  ];
  const personId = personIdentity["@id"];
  const profileUrl = personIdentity.url;
  const profilePageId = profileUrl + "#profilepage";
  const websiteId = siteUrl + "#website";
  const pageId = url + "#webpage";
  const dioId = "https://vocab.danielberanek.cz/dio-odi/#DIO";
  const odiId = "https://vocab.danielberanek.cz/dio-odi/#ODI";
  const person = {
    "@type": "Person",
    "@id": personId,
    name: personIdentity.name,
    url: profileUrl,
    sameAs: personIdentity.sameAs ?? []
  };
  const website = {
    "@type": "WebSite",
    "@id": websiteId,
    url: siteUrl,
    name: "DIO/ODI",
    description: lang === "cs"
      ? "Autorský a výzkumný web představující Digital Identity Optimization a Ontology of Digital Identity."
      : "Author-led research and concept website presenting Digital Identity Optimization and the Ontology of Digital Identity.",
    inLanguage: ["cs-CZ", "en"],
    creator: { "@id": personId },
    publisher: { "@id": personId },
    about: [{ "@id": dioId }, { "@id": odiId }]
  };
  const pageNode = {
    "@type": isAuthorProfile ? "ProfilePage" : "WebPage",
    "@id": pageId,
    url,
    name: title,
    description,
    keywords: keywordProjection.keywords,
    inLanguage: lang === "cs" ? "cs-CZ" : "en",
    isPartOf: { "@id": websiteId },
    author: { "@id": personId },
    about: [{ "@id": dioId }, { "@id": odiId }],
    citation: citations.map((citation) => ({ "@id": citation }))
  };
  const graph = [website, person, pageNode];
  if (isAuthorProfile) {
    pageNode.mainEntity = { "@id": personId };
  }
  if (isHome) {
    const frameworkId = frameworkIdentity["@id"];
    pageNode.mainEntity = { "@id": frameworkId };
    graph.push({
      "@type": "CreativeWork",
      "@id": frameworkId,
      name: frameworkIdentity.name,
      url: frameworkIdentity.url,
      description: lang === "cs"
        ? "Autorský konceptuální a výzkumný rámec DIO/ODI pro digitální identitu, její reprezentaci a rekonstrukci napříč lidskými a strojovými systémy."
        : "An author-led conceptual and research framework for digital identity, its representation and reconstruction across human and machine systems.",
      author: { "@id": personId },
      mainEntityOfPage: { "@id": pageId },
      about: [{ "@id": dioId }, { "@id": odiId }],
      citation: citations.map((citation) => ({ "@id": citation }))
    });
  }
  return JSON.stringify({
    "@context": "https://schema.org",
    "@graph": graph
  }, null, 2).replaceAll("<", "\\u003c");
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
  <meta name="keywords" content="${escapeHtml(artifactsByPageKey.get(page.key).projection.keywords.join(", "))}">
  <meta name="dio-odi:keyword-profile" content="${escapeHtml(artifactsByPageKey.get(page.key).keyword_profile_id)}">
  <meta name="dio-odi:keyword-registry-version" content="${escapeHtml(keywordRegistry.registry_version)}">
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
  return `<footer class="site-footer"><div class="shell footer-main"><div><p class="footer-label">DIO/ODI</p><h2>${isCs ? "Identita jako optimalizační objekt." : "Identity as the optimization object."}</h2><p>${isCs ? "Autorský koncept Daniela Beránka pro tržní viditelnost, AI a entitní data a znalostní infrastrukturu." : "An author-led concept by Daniel Beránek for market visibility, AI and entity data, and knowledge infrastructure."}</p></div><div><p class="footer-label">${isCs ? "Větve" : "Branches"}</p><ul class="footer-links"><li><a href="${localPaths[`${lang}:visibility`]}">${isCs ? "DIO pro viditelnost" : "DIO for AI visibility"}</a></li><li><a href="${localPaths[`${lang}:entity`]}">${isCs ? "DIO pro AI a data" : "DIO for AI & entity data"}</a></li><li><a href="${localPaths[`${lang}:odi`]}">${isCs ? "ODI" : "ODI for knowledge infrastructure"}</a></li></ul></div><div><p class="footer-label">${isCs ? "Projekt" : "Project"}</p><ul class="footer-links"><li><a href="${localPaths[`${lang}:partnerships`]}">${isCs ? "Partnerství" : "Partnerships"}</a></li><li><a href="${localPaths[`${lang}:evidence`]}">${isCs ? "Vývoj" : "Development"}</a></li><li><a href="${localPaths[`${lang}:author`]}">${isCs ? "Autor" : "Author"}</a></li><li><a href="https://danielberanek.cz/manifest-dio/" target="_blank" rel="noopener noreferrer">Manifest <span aria-hidden="true">↗</span></a></li></ul></div></div><div class="shell footer-bottom"><span>© 2026 Daniel Beránek · DIO/ODI</span><span>${isCs ? "Autorské IP · Brno" : "Author-led IP · Brno"}</span></div></footer>`;
}

const exposedTextAttributes = new Set([
  "alt",
  "aria-description",
  "aria-label",
  "aria-placeholder",
  "aria-roledescription",
  "aria-valuetext",
  "placeholder",
  "title",
]);
const czechDiacritics = /[áčďéěíňóřšťúůýžÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]/u;
const czechAsciiInterface = /\b(?:autor|geneze|kontakt|kontaktovat|koordinace|navrhnout|obsah|praxe|projekt|strategie)\b/iu;

function normalizeTranslationKey(value) {
  return value.replace(/\s+/gu, " ").trim();
}

function translationIndex(records, label) {
  const index = new Map();
  for (const record of records) {
    for (const [source, target] of Object.entries(record)) {
      const key = normalizeTranslationKey(source);
      if (index.has(key) && index.get(key) !== target) {
        throw new Error(`Conflicting normalized translation key in ${label}: ${JSON.stringify(key)}`);
      }
      index.set(key, target);
    }
  }
  return index;
}

function looksCzech(value) {
  const withoutNames = value
    .replaceAll("Daniel Beránek", "Daniel Beranek")
    .replaceAll("Beránek", "Beranek");
  return czechDiacritics.test(withoutNames) || czechAsciiInterface.test(withoutNames);
}

function translateValue(value, index, page, type, missing) {
  const leading = value.match(/^\s*/u)?.[0] ?? "";
  const trailing = value.match(/\s*$/u)?.[0] ?? "";
  const exactFragment = value.slice(leading.length, value.length - trailing.length);
  const normalized = normalizeTranslationKey(exactFragment);
  if (!normalized) return value;

  const translated = index.get(normalized);
  if (translated !== undefined) return `${leading}${translated}${trailing}`;

  if (looksCzech(exactFragment)) {
    missing.push(`${page.csFile} -> /${page.enPath} [${type}]: ${JSON.stringify(exactFragment)}`);
  }
  return value;
}

function findTagEnd(markup, start) {
  let quote = "";
  for (let index = start + 1; index < markup.length; index += 1) {
    const character = markup[index];
    if (quote) {
      if (character === quote) quote = "";
    } else if (character === '"' || character === "'") {
      quote = character;
    } else if (character === ">") {
      return index;
    }
  }
  return -1;
}

function translateExposedAttributes(tag, index, page, missing) {
  return tag.replace(/\b([:\w-]+)(\s*=\s*)(["'])([\s\S]*?)\3/gu, (match, name, equals, quote, value) => {
    if (!exposedTextAttributes.has(name.toLowerCase())) return match;
    const translated = translateValue(value, index, page, `attribute ${name}`, missing);
    return `${name}${equals}${quote}${translated}${quote}`;
  });
}

function translateMarkup(main, page, textIndex, attributeIndex, missing) {
  let cursor = 0;
  let output = "";
  let rawTextElement = "";

  while (cursor < main.length) {
    if (rawTextElement) {
      const closing = new RegExp(`</${rawTextElement}\\s*>`, "iu").exec(main.slice(cursor));
      if (!closing) {
        output += main.slice(cursor);
        break;
      }
      const closingStart = cursor + closing.index;
      output += main.slice(cursor, closingStart + closing[0].length);
      cursor = closingStart + closing[0].length;
      rawTextElement = "";
      continue;
    }

    if (main[cursor] !== "<") {
      const nextTag = main.indexOf("<", cursor);
      const end = nextTag === -1 ? main.length : nextTag;
      const value = main.slice(cursor, end);
      output += rawTextElement ? value : translateValue(value, textIndex, page, "text node", missing);
      cursor = end;
      continue;
    }

    const tagEnd = findTagEnd(main, cursor);
    if (tagEnd === -1) throw new Error(`${page.csFile}: unterminated HTML tag in <main>`);
    const sourceTag = main.slice(cursor, tagEnd + 1);
    output += translateExposedAttributes(sourceTag, attributeIndex, page, missing);

    const tagName = sourceTag.match(/^<\/?\s*([\w:-]+)/u)?.[1]?.toLowerCase();
    if (tagName === "script" || tagName === "style") {
      if (/^<\//u.test(sourceTag)) rawTextElement = "";
      else if (!/\/\s*>$/u.test(sourceTag)) rawTextElement = tagName;
    }
    cursor = tagEnd + 1;
  }

  return output;
}

function translateMain(main, page) {
  const pageTranslations = translations[page.key];
  if (!pageTranslations) throw new Error(`Missing translations for ${page.key}`);

  const missing = [];
  const textIndex = translationIndex([pageTranslations], page.key);
  const attributeIndex = translationIndex([pageTranslations, exposedAttributeTranslations], `${page.key} attributes`);
  const translated = translateMarkup(main, page, textIndex, attributeIndex, missing);
  if (missing.length) {
    throw new Error(`Missing English localization:\n${missing.map((item) => `- ${item}`).join("\n")}`);
  }

  return translated
    .replaceAll(`${projectPath}partnerstvi/`, `${projectPath}en/partnerships/`)
    .replaceAll(`${projectPath}dio-viditelnost/`, `${projectPath}en/ai-visibility/`)
    .replaceAll(`${projectPath}dio-ai-data/`, `${projectPath}en/entity-resolution/`)
    .replaceAll(`${projectPath}dukazy/`, `${projectPath}en/evidence/`)
    .replaceAll(`${projectPath}autor/`, `${projectPath}en/author/`)
    .replaceAll(`${projectPath}odi/`, `${projectPath}en/ontology-of-digital-identity/`)
    .replaceAll(`href="${projectPath}"`, `href="${projectPath}en/"`)
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
  await writeFile(join(projectRoot, page.csFile), csOutput);

  const enOutput = document(page, "en", translateMain(main, page));
  const enTarget = join(projectRoot, page.enFile);
  await mkdir(dirname(enTarget), { recursive: true });
  await writeFile(enTarget, enOutput);
}

const resolvedMetadata = {
  schema_version: "1.1.0",
  site: artifactMetadata.site,
  author: artifactMetadata.author,
  entity_registry: {
    repository: entityRegistryLock.registry_repository,
    version: entityRegistry.registry_version,
    commit: entityRegistryLock.registry_commit,
    snapshot_path: entityRegistryLock.snapshot_path,
    source_url: "https://raw.githubusercontent.com/" + entityRegistryLock.registry_repository + "/" + entityRegistryLock.registry_commit + "/" + entityRegistryLock.source_path
  },
  keyword_registry: {
    repository: registrySource.repository,
    file: registrySource.file,
    ref: registrySource.ref,
    registry_version: keywordRegistry.registry_version,
    status: keywordRegistry.status,
    sha256: keywordRegistrySha256,
    fetched_from: registryResource.fetched_from,
    canonical_discovery: registrySource.registry_discovery,
    resolved_snapshot_path: "assets/data/keyword-registry.resolved.json",
  },
  artifacts: resolvedArtifacts,
};
const metadataOutput = join(projectRoot, artifactMetadata.site.metadata_output);
const resolvedRegistryPath = join(projectRoot, "assets/data/keyword-registry.resolved.json");
await mkdir(dirname(metadataOutput), { recursive: true });
await writeFile(resolvedRegistryPath, keywordRegistryText);
await writeFile(metadataOutput, JSON.stringify(resolvedMetadata, null, 2) + "\n");

console.log(`Generated ${pages.length * 2} localized HTML pages using canonical keyword registry v${keywordRegistry.registry_version} (${resolvedArtifacts.length} page profiles).`);
