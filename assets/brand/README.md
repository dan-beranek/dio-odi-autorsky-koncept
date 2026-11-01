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

## Technická poznámka

SVG wordmarky používají textový element s font stackem `Inter, Arial, sans-serif`, nikoli vložený font. Pro web se vykreslí dostupným systémovým písmem; pro finální tiskovou výrobu lze text při exportu převést na křivky.
