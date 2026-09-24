# DIO/ODI – autorský koncept Daniela Beránka

Veřejný, statický a plně dvojjazyčný web představující Digital Identity Optimization (DIO) a Ontology of Digital Identity (ODI), jejich společný mechanismus, tři realizační větve, publikační základ a možnosti partnerství.

## Veřejný web

Po aktivaci GitHub Pages bude web dostupný na:

<https://dan-beranek.github.io/dio-odi-autorsky-koncept/>

## Obsah

- `index.html` – hlavní rozcestník DIO/ODI
- `dio-viditelnost/` – DIO pro firmy, osoby a projekty
- `dio-ai-data/` – DIO pro AI a entitní data
- `odi/` – ODI jako teoretická, výzkumná a IP vrstva
- `partnerstvi/` – formy spolupráce a pilotů
- `dukazy/` – publikace, důkazní stav a validační agenda
- `autor/` – Daniel Beránek, geneze konceptu a autorská vrstva
- `en/` – anglický rozcestník a šest anglických protějšků českých podstránek
- `assets/dio-odi-social-v1.png` – univerzální social-preview obrázek 1200 × 630 px
- `llms.txt` a `llms-full.txt` – stručný a rozšířený kontext pro AI systémy
- `sitemap.xml` a `humans.txt` – strojově čitelné doprovodné soubory
- `scripts/build-site.mjs` – reprodukovatelná lokalizace, metadata a společné rozhraní
- `scripts/validate-site.mjs` – kontrola všech 14 stránek, metadat, sitemap a sociálního obrázku

## Primární zdroje

1. [Manifest of Digital Identity Optimization (DIO) and Ontology of Digital Identity (ODI): Canonical Multilingual Edition](https://doi.org/10.5281/zenodo.21610934)
2. [Digital Identity Optimization (DIO): A Conceptual Framework for Entity-Based Visibility in the Age of AI-Mediated Search](https://doi.org/10.2139/ssrn.7247578)
3. [The Crisis of Entity Resolution in Heterogeneous AI Environments: Data, Financial, and Semantic Dimensions](https://doi.org/10.2139/ssrn.7396398)
4. [Živá česká verze manifestu](https://danielberanek.cz/manifest-digital-identity-optimization-dio/)

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

## Důkazní omezení

Repozitář dokumentuje veřejnou podobu autorského konceptu a jeho zdrojovou stopu. Samotná publikace, indexace nebo distribuce nedokládá univerzální účinnost metodiky, opakovatelnost ani product-market fit.

## Autorství a práva

© 2026 Daniel Beránek. DIO/ODI, jeho základní terminologie a autorské IP zůstávají Danielu Beránkovi, pokud konkrétní dohoda neurčí jinak. Podrobnosti uvádí `NOTICE.txt`.
