# DIO/ODI – autorský koncept Daniela Beránka

Veřejný, statický a plně dvojjazyčný web představující Digital Identity Optimization (DIO) a Ontology of Digital Identity (ODI), jejich společný mechanismus, tři realizační větve, publikační základ a možnosti partnerství.

---

## DIO/ODI — Reference infrastructure

The current archived Reference Model release is v0.8.0. It integrates the SKOS-first Reference Vocabulary v0.2.1, derived non-normative Application Mappings and the append-only Semantic Change Feed (SCF) v0.1.0 (JSON Schema v0.2.0; 44 documented events through 7 November 2026). SCF is a component of the Reference Model, not a separately DOI-identified work.

- **Current archived Reference Model v0.8.0:** https://doi.org/10.5281/zenodo.24056601
- **Reference Model source repository:** https://github.com/dan-beranek/dio-odi-reference-model/
- **Reference Vocabulary:** https://vocab.danielberanek.cz/dio-odi/
- **Semantic Change Feed:** https://vocab.danielberanek.cz/semantic-change-feed/
- **SCF event registry (JSON):** https://vocab.danielberanek.cz/semantic-change-feed/events.json
- **SCF JSON Schema:** https://vocab.danielberanek.cz/semantic-change-feed/schema.json

---

## Veřejný web

Po aktivaci GitHub Pages bude web dostupný na:

<https://dan-beranek.github.io/dio-odi-autorsky-koncept/>

## Obsah

- `index.html` – hlavní rozcestník DIO/ODI
- `dio-viditelnost/` – DIO pro firmy, osoby a projekty
- `dio-ai-data/` – DIO pro AI a entitní data
- `odi/` – ODI jako teoretická, výzkumná a IP vrstva
- `partnerstvi/` – formy spolupráce a pilotů
- `dukazy/` – vývojová linie, publikace, aplikační architektury a další kroky
- `autor/` – Daniel Beránek, geneze konceptu a autorská vrstva
- `en/` – anglický rozcestník a šest anglických protějšků českých podstránek
- `assets/dio-odi-social-v1.png` – univerzální social-preview obrázek 1200 × 630 px
- `llms.txt` a `llms-full.txt` – stručný a rozšířený kontext pro AI systémy
- `robots.txt`, `sitemap.xml` a `humans.txt` – strojově čitelné doprovodné soubory
- `scripts/build-site.mjs` – reprodukovatelná lokalizace, metadata a společné rozhraní
- `scripts/validate-site.mjs` – kontrola všech 14 stránek, metadat, sitemap a sociálního obrázku

## Primární zdroje

1. [Manifest of Digital Identity Optimization (DIO) and Ontology of Digital Identity (ODI): Canonical Multilingual Edition](https://doi.org/10.5281/zenodo.21610934)
2. [Digital Identity Optimization (DIO): A Conceptual Framework for Entity-Based Visibility in the Age of AI-Mediated Search](https://doi.org/10.2139/ssrn.7247578)
3. [The Crisis of Entity Resolution in Heterogeneous AI Environments: Data, Financial, and Semantic Dimensions](https://doi.org/10.2139/ssrn.7396398)
4. [Minimum Viable Digital Identity Optimization (DIO)](https://dx.doi.org/10.2139/ssrn.7590979)
5. [From Entity Resolution Anomalies to Reconstruction Failure Modes: A Taxonomic Note Following Minimum Viable Digital Identity Optimization (DIO)](https://doi.org/10.5281/zenodo.23269323)
6. [DIO/ODI Reference Model v0.8.0](https://doi.org/10.5281/zenodo.24056601)
7. [DIO/ODI Reference Vocabulary v0.2.1](https://vocab.danielberanek.cz/dio-odi/)
8. [Semantic Change Feed](https://vocab.danielberanek.cz/semantic-change-feed/)
8. [DIO/ODI Application Mappings](https://vocab.danielberanek.cz/mappings/)
9. [Constraining the Commit Boundary: A DIO/ODI-Informed Authorization Guardrail for Agentic Entity Resolution](https://arxiv.org/abs/2610.37407)
10. [Živý český manifest a changelog](https://danielberanek.cz/manifest-dio/)

## Lokální spuštění

Web nemá externí závislosti. Po obsahové úpravě lze z kořene repozitáře znovu vygenerovat statické HTML a spustit kontrolu:

```bash
node scripts/build-site.mjs
node scripts/validate-site.mjs
```

Pro lokální náhled spusťte z nadřazené složky například:

```bash
python3 -m http.server 8000
```

Poté otevřete:

<http://localhost:8000/dio-odi-autorsky-koncept/>

## Publikování

Workflow `.github/workflows/pages.yml` automaticky nasadí obsah na GitHub Pages při každém pushi do větve `main`. V nastavení repozitáře je potřeba jednorázově vybrat **Settings → Pages → Source → GitHub Actions**.

## Důkazní stav

Repozitář dokumentuje vývoj DIO/ODI od manifestu a konceptuálních prací přes MVDIO a taxonomii Reconstruction Failure Modes k aktuální referenční infrastruktuře: Reference Vocabulary v0.2.1, archivní Reference Model v0.8.0 a integrovaný Semantic Change Feed. Odvozená Application Mappings propojují referenční vrstvu s externími technickými doménami. Paper na arXiv představuje jeden konkrétní návrh technické aplikace pro Agentic ER; implementace, piloty a další aplikační směry zůstávají otevřené.

## Autorství a práva

© 2026 Daniel Beránek. DIO/ODI, jeho základní terminologie a autorské IP zůstávají Danielu Beránkovi, pokud konkrétní dohoda neurčí jinak. Podrobnosti uvádí `NOTICE.txt`.
