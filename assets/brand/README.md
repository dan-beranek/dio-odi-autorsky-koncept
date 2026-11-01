# DIO/ODI — oficiální logo sada

Tato složka obsahuje kanonické vektorové podoby značky DIO/ODI a její kratší varianty DIO. Geometrie symbolu vychází z inline SVG, které bylo dosud použito v hlavičce webu.

## Architektura značky

- **DIO/ODI** je primární horizontální logo společného konceptu.
- **DIO** je kratší varianta pro kontexty, které se výslovně týkají aplikované větve DIO.
- **Sdílený symbol** je grafickou značkou obou vrstev; není samostatným logem jiné entity.
- Samostatné logo ODI se záměrně nedefinuje. DIO a ODI jsou propojené vrstvy jednoho autorského konceptu, nikoli dvě nesouvisející značky.

## Přehled souborů

| Soubor | Použití |
|---|---|
| `symbol.svg` | Samostatný symbol na světlém pozadí |
| `symbol-inverse.svg` | Samostatný symbol na tmavém pozadí |
| `logo-dio-odi.svg` | Primární horizontální logo DIO/ODI |
| `logo-dio-odi-inverse.svg` | Inverzní primární logo pro tmavé pozadí |
| `logo-dio.svg` | Kratší horizontální logo DIO |
| `logo-dio-inverse.svg` | Inverzní kratší logo DIO |

## Primární podoba

![Primární logo DIO/ODI](logo-dio-odi.svg)

Primární volbou pro web, dokumenty, prezentace, odborné texty a partnerskou komunikaci je `logo-dio-odi.svg`. Variantu `logo-dio.svg` používej tam, kde je z kontextu zřejmé, že se komunikace vztahuje k aplikované větvi DIO.

## Inverzní podoba

Pro tmavé plochy použij odpovídající soubor s příponou `-inverse`. Inverzní varianta není pouhý filtr ani automatické CSS převrácení barev; má upravené výplně uzlů, obrysy, spojnice i wordmark.

## Geometrická poznámka k symbolu

Značka zobrazuje šest uzlů v projekci pětibokého jehlanu: pět uzlů tvoří obvod a šestý leží uvnitř. Je v ní zakresleno **deset spojnic**. Jde o záměrnou stylizaci existující značky z webové hlavičky, nikoli o úplný graf K6 se všemi patnácti hranami. Když je potřeba výslovně znázornit úplný graf K6, použij příslušnou modelovou vizualizaci, ne samotné logo.

## Rastrové exporty

Samostatný symbol je dostupný také v běžných rastrových formátech. Soubory jsou uloženy přímo v repozitáři, nikoli pouze v distribučním archivu.

| Formát | Pozadí | Vhodné použití |
|---|---|---|
| PNG | Průhledné | Univerzální kompatibilita, grafické editory |
| JPG | Plné podle varianty | Systémy, které neumějí průhlednost |
| WebP | Průhledné | Webové použití s dobrou kompresí |
| AVIF | Průhledné | Moderní webové použití s úsporným přenosem |

Každý formát je dostupný v rozměrech **128 × 128, 256 × 256 a 512 × 512 px**, vždy ve světlé a inverzní variantě. Celkem jde o 24 souborů.

Pojmenování odpovídá vzoru `raster/{rozměr}/symbol-{light|inverse}-{rozměr}.{formát}`. Například:

- [PNG 512 px – světlý symbol](raster/512/symbol-light-512.png)
- [PNG 512 px – inverzní symbol](raster/512/symbol-inverse-512.png)
- [WebP 512 px – světlý symbol](raster/512/symbol-light-512.webp)
- [AVIF 512 px – světlý symbol](raster/512/symbol-light-512.avif)
- [JPG 512 px – světlý symbol](raster/512/symbol-light-512.jpg)

PNG, WebP a AVIF zachovávají průhledné okolí. JPG má neprůhledný podklad: světlá varianta `#f7f8fb`, inverzní varianta `#080b12`.

Rastrové soubory lze znovu vytvořit z kanonických SVG příkazem `node scripts/generate-brand-raster-assets.mjs`. GitHub Actions používá připnutou verzi Sharp a při aktualizaci zdrojových SVG znovu vygeneruje soubory; exportní skript je uložen v `scripts/`.

## Barevnost

| Token | HEX | Role |
|---|---|---|
| Ink | `#080b12` | Wordmark a obrysy na světlém pozadí |
| Paper | `#f7f8fb` | Výplň uzlů světlé varianty |
| Blue | `#154cff` | Spojnice a centrální uzel |
| Blue light | `#8eabff` | Spojnice na tmavém pozadí |
| Paper light | `#f7f8fb` | Wordmark a obrysy na tmavém pozadí |

Světlé varianty jsou optimalizované pro plochu `#f7f8fb`, tmavé pro `#080b12`. Výplň obvodových uzlů odpovídá podkladové ploše, aby spojnice končily vizuálně v uzlech stejně jako v původní webové značce.

## Základní pravidla použití

- Zachovej původní proporce, pořadí barev a orientaci symbolu.
- Nedeformuj značku, neměň jednotlivé barvy ani nepřidávej stíny, obrysy či efekty.
- Okolo loga ponech volný prostor alespoň ve velikosti průměru jednoho vnějšího uzlu.
- Samostatný symbol používej pro malé formáty, avatar, navigační prvky a místa, kde je slovní označení zřejmé z okolního kontextu.
- Pro běžné použití upřednostňuj SVG. Při exportu do PNG zachovej průhledné okolí a odpovídající barevnou variantu.
- Nepoužívej kořenový `favicon.svg` jako náhradu primárního loga. Favicon je samostatná, tmavě orámovaná adaptace pro rozhraní prohlížeče.

## Doporučené umístění

Logo sada je uložena v `assets/brand/`, odděleně od obecných assetů webu. Tato struktura umožňuje později doplnit exporty PNG, tiskové varianty, šablony nebo samostatný stručný manuál, aniž by se míchaly s ilustracemi a sociálními náhledy.

## Práva a podmínky užití

**Copyright © 2026 Daniel Beránek. All rights reserved.**

Název DIO/ODI, název DIO, společný symbol a soubory této logo sady jsou proprietárními materiály značky. Jejich zveřejnění v tomto veřejném repozitáři ani možnost stažení nepředstavují obecnou licenci k užití, úpravám, začlenění do jiných značek nebo dalšímu šíření.

Bez předchozího souhlasu autora je dovoleno logo reprodukovat pouze v nezměněné podobě pro věcnou identifikaci, popis, recenzi nebo odbornou citaci konceptu DIO/ODI, a to způsobem, který nevyvolává dojem schválení, partnerství, sponzorství či jiné afiliace. Je-li to přiměřené, uveď autora a odkaz na oficiální web DIO/ODI.

Předchozí výslovný souhlas autora je nutný zejména pro:

- komerční užití loga jako označení vlastních produktů, služeb, akcí nebo činností třetí strany;
- začlenění loga do cizího loga, vizuální identity, produktu nebo propagačního materiálu;
- úpravy, překreslení, barevné změny, deformace nebo vytváření odvozených variant;
- použití, které by mohlo naznačovat oficiální vztah, podporu, certifikaci nebo partnerství;
- poskytování loga dalším subjektům jako součást licence, balíčku nebo vlastní nabídky.

Tato pravidla upravují užití grafických a slovních prvků značky. **Autorskoprávní ochrana grafického zpracování a případná známkoprávní ochrana označení jsou dvě odlišné právní otázky.** Toto prohlášení samo o sobě netvrdí, že označení DIO nebo DIO/ODI je registrovanou ochrannou známkou, ani nenahrazuje individuální licenční smlouvu. Konkrétní souhlas nebo širší oprávnění lze sjednat přímo s autorem.

Tato logo sada není vydána pod licencí Creative Commons, MIT, BSD ani jinou obecnou open-source či open-content licencí.

## Technická poznámka

SVG wordmarky používají textový element s font stackem `Inter, Arial, sans-serif`, nikoli vložený font. Pro web se vykreslí dostupným systémovým písmem; pro finální tiskovou výrobu lze text při exportu převést na křivky.
