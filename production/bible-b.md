# Bible B: Day Zero

Bron: "Interactieve serie: Part 1 scripts en opschaalplan" (PDF, 18 oktober 2026). Teksten die in beeld of in captions komen zijn Engels en bevatten nooit em dashes.

## Concept

- Serietitel: **Day Zero**
- Tagline: **"Nobody is coming."**
- Interactieve stem-serie op Instagram Reels, TikTok en YouTube Shorts. Na een ramp zit je met drie bijna-vreemden in een kelder, met twaalf flessen water en 30 dagen te gaan. De kijker kiest aan het eind van elk deel; de meerderheid schrijft het volgende deel.
- Part 1 "Twelve Bottles": keuze **GO** of **STAY**. Lengte ongeveer 85 seconden, zo'n 265 woorden voice-over.
- De ramp zelf blijft bewust vaag.
- Waarom de keuze werkt: GO is verdedigbaar omdat Part 1 net heeft geleerd dat water voorgaat. STAY is verdedigbaar omdat er om drie uur 's nachts iets op de deur klopte. Beide keuzes leveren in Part 2 een echte les op: hoe je een boiler veilig aftapt (eerst gas of stroom uit, dan het kraantje onderaan), of hoe lang 11 liter echt meegaat.
- Onder elke aflevering: **"Fiction. The survival facts are real. Not medical advice."**

## HUD

Drie vakjes: **WATER** (start 18 L), **MORALE** (start 80%), **DANGER** (start 0%). Zie `state-b.json`.

## Personages

| Naam | Rol | Look (Flow-personageblok) |
|---|---|---|
| Jij | Hoofdpersoon | Round plain white head with simple dot eyes, dark knit cap, yellow rain jacket, flashlight on a cord around the neck |
| Mara | Verpleegkundige, kalm, scherp | Short dark hair, navy scrubs under a cardigan |
| Theo | De jongste, stelt de vragen die de kijker ook heeft | Smaller, oversized red hoodie |
| Holt | De buurman, wantrouwig, zegt weinig | Older, grey stubble, brown work jacket |

Alle personages hebben ronde, gewone witte hoofden met minimale gezichten. Referentiebeelden in Flow: een per personage uit de personagesheet (`you_ref.png`, `mara_ref.png`, `theo_ref.png`, `holt_ref.png`, namen te bevestigen).

## Toon

- Eén verteller in de tweede persoon ("you"), korte zinnen, spreektaal.
- Getallen tellen mee met de stem.
- Precieze getallen in plaats van ronde.
- Gedempt en benauwd; de dreiging blijft vaag en komt van geluid (sirenes, radio, kloppen), niet van beeld.

## Regels

### Aflevering-structuur (9 beats, vaste tijden)

| # | Tijd | Beat | Beeldlaag |
|---|---|---|---|
| 1 | 0:00-0:07 | Hook | Illustratie |
| 2 | 0:07-0:10 | Titelkaart | Zwarte kaart, één woord in accentkleur |
| 3 | 0:10-0:24 | Probleem 1 | Crème infographic |
| 4 | 0:24-0:35 | Probleem 2 | Illustratie met label |
| 5 | 0:35-0:37 | Regelkaart | Zwarte kaart |
| 6 | 0:37-1:11 | Dag 2: slimme zet, de val en de dreiging | "DAY 2" kaart, infographic, begripskaart, illustratie |
| 7 | 1:11-1:16 | Dag 3: de stand | "DAY 3" kaart, crème statusbord |
| 8 | 1:16-1:22 | Verleiding en keuze | Illustratie, keuzewoord als knop |
| 9 | 1:22-1:27 | Eindkaart | Zwarte kaart |

Part 1 heeft ongeveer 30 beeldwissels (gemiddeld één per 2,8 seconden) en rond 180 woorden per minuut.

### Schrijfformule

1. Elke 10 tot 15 seconden een nieuw probleem.
2. Een omslagzin: "Here's what you don't know."
3. De held doet iets slims, gevolgd door "Except that has a name." De naam van het echte begrip komt groot in beeld.
4. Precieze getallen in plaats van ronde.
5. Een saai, menselijk detail vlak voor de keuze (in B: Theo vraagt of je okay bent en je zegt ja). Dat maakt de verleiding echt.
6. Een keuze waarbij beide kanten verdedigbaar zijn.

### Productieregels

- Elke caption begint met "New here? Start with Day 1."
- Alleen geïllustreerde shots gaan naar Google Flow. Infographics, tekstkaarten, HUD en ondertitels bouwt Remotion.
- Geen tekst, cijfers of logo's in Flow-beelden. Schermen, borden en e-mails blijven leeg.
- Bufferregel: beide takken van het volgende deel zijn klaar voordat de stem sluit.
- Geen em dashes in tekst die in beeld of in captions komt.
- Voor publicatie checken: één gallon per persoon per dag en "never ration drinking water" (beide FEMA), de boiler als verborgen waterbron (FEMA en lokale noodhulpgidsen), ongeveer drie dagen zonder water (vuistregel, verschilt per situatie) en het effect van 2% vochtverlies op denken. Bronnen: FEMA, Guidelines for Managing Water Supplies; Alameda County, Emergency Drinking Water; Ready.gov.

## Stijlgids

### Vaste elementen

- **HUD**: drie donkere, half doorzichtige vakjes bovenin op elke illustratie, labels in monospace. Waarden tellen zichtbaar op of af op het moment dat de voice-over het zegt.
- **Ondertitels**: woord voor woord, onderin het midden. Actief woord wit, de rest grijs, één tot drie woorden tegelijk.
- **Drie beeldlagen**: (1) geïllustreerde scènes, donker en koel met één neon accentkleur; (2) crème infographic-borden met klein monospace kopje (bijv. "PROBLEM 1 · THE WATER") en grote cijfers; (3) zwarte tekstkaarten voor titel, regel, dag en einde.

### Kleur

| Rol | Waarde |
|---|---|
| Accent: signaaloranje, als een noodlamp, voor gevaar en kernwoorden | `#FF6A1A` (voorstel, te bevestigen) |
| Koel blauw (illustratie en bijkleur) | `#1E3A5F` (voorstel) |
| Zwart (tekstkaarten) | `#0B0B0C` |
| Crème (infographic) | `#F3EAD3` |
| Wit (actief ondertitelwoord) | `#FFFFFF` |
| Grijs (inactieve ondertitel) | `#8A8A8A` |
| HUD-vakje | zwart, ongeveer 55% dekking |

Verder alleen donker, koel blauw en crème.

### Flow-stijlblok (letterlijk)

> Hand-drawn digital illustration, thick clean black outlines, simple cartoon characters with round plain white heads and minimal faces, detailed painterly backgrounds, low-key cinematic lighting, cold blue and charcoal palette with a single signal-orange emergency light, vertical 9:16, empty space at the top and bottom, no text anywhere

### Flow-regels

9:16 (1080 x 1920), vrije ruimte boven en onder, expliciet shottype (wide, medium, close-up) en hoek, altijd een referentiebeeld uit de personagesheet. Vermijden: text, letters, numbers, logos, watermark, extra limbs. Bestandsnaam: `B01_S03.png` is serie B, Part 1, shot 3.

## Open punten

- Voice-over: tool en stem nog te kiezen (vraag aan de gebruiker).
- Hex-waarden hierboven zijn voorstellen; het plan noemt alleen de kleurnamen.
- Fonts voor titels en monospace nog te kiezen in stap 2.
- Rekenpunt in het plan: het script laat WATER van 18 L naar 11 L gaan op Dag 3, terwijl rantsoeneren op 2 L per dag dat niet verklaart (je verliest 7 L in ongeveer anderhalve dag). Staat zo in het plan; nog te bevestigen of dat zo moet blijven.

## Referentiestijl (Saveo Part 1, frame voor frame bekeken)

Vastgelegd uit de originele video (87 s, 720x1280, 32 beeldwissels bekeken). Waar dit afwijkt van het plan staat dat erbij; Remotion volgt in stap 2 dit overzicht tenzij je anders zegt.

- **Illustraties**: dikke zwarte contouren, rond wit hoofd met pet en simpele ogen, dunne zwarte benen, witte sneakers, schilderachtige detailrijke achtergronden. Held vaak klein in een grote omgeving (wide), afgewisseld met extreme close-ups van het gezicht. Eén gekleurde lichtbron per scène; bij Saveo roze jaloeziën en neon, daarbuiten warm geel.
- **Overgangen**: zachte cross-dissolves van ongeveer 0,3 tot 0,5 s tussen shots, geen harde cuts, en trage push-ins binnen een shot. Titel- en kaartovergangen zijn dezelfde dissolve.
- **HUD**: drie afgeronde, donker half doorzichtige vakjes naast elkaar bovenin, onder de veilige rand. Per vakje een klein label in hoofdletters (monospace, grijs) boven een grote vette waarde (sans, wit). De waarde in gevaar kleurt in de accentkleur (signaaloranje) als hij oploopt. Een klein accent-label (bijv. "PROBLEM 1", "DAY 3") staat onder het eerste vakje.
- **Ondertitels**: onderin het midden, vet sans, 1 tot 3 woorden, actief woord wit en de rest dof grijs. Af en toe één kernwoord in de accentkleur. Altijd met lichte schaduw, geen vak erachter.
- **Cijferbadge**: bij optellende getallen verschijnt midden in beeld een halftransparant crème vakje met een klein monospace label (bijv. "DEPOSIT 3 · BANK 3") boven een groot cijfer dat meetelt met de stem.
- **Labels op illustraties**: kleine accentkleurige tag in monospace (bijv. "BAIT MONEY") met een dunne accentring om het object waar het over gaat.
- **Crème borden**: bijna wit crème, klein monospace kopje in grijs, kopregel in zeer vette, strak gezette sans met één woord in de accentkleur (bijv. "HALF A TON"), onderaan een kleine rekenregel in grijs. Elementen bouwen op (balkjes, raster, voortgangsbalk).
- **Begripskaart**: groot accentwoord ("STRUCTURING") over een illustratie met stempel.
- **Zwarte kaarten**: bijna zwart (warm), tekst in crème; kleine monospace kop in de accentkleur ("RULE 1"), "DAY 3" groot en vet in het midden.
- **Statusbord**: crème, kop "DAY 3 · WHERE YOU STAND", per regel monospace label en grote waarde, voortgangsbalk voor het percentage in accentkleur.
- **Eindkaart**: in de referentie ligt de eindkaart over een vervaagde illustratie in plaats van op zwart. Kopregel "PART 2 TOMORROW" (Part 2 wit, TOMORROW accent), twee regels uitleg, klein monospace "COMMENT ONE WORD" en twee knoppen naast elkaar (grijs en accent). Besloten: we volgen de referentie, niet de zwarte kaart uit het plan.
- **Typografie**: een strakke grotesk (type Inter) in zeer vette snede met negatieve letterafstand voor koppen, monospace voor labels. Nog te bevestigen in stap 2.

(Voor de Flow-queues is de zin over personages ("simple cartoon characters with round plain white heads and minimal faces") uit het stijlblok gelaten, omdat de personages als character in Flow zijn opgeslagen. Zie episodes/*/queues.)
