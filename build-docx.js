const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, HeadingLevel, BorderStyle,
  WidthType, ShadingType, VerticalAlign, PageNumber, TabStopType, TabStopPosition,
} = require("docx");

/* ---------- Brand palette (from the prototype) ---------- */
const TEAL = "107070";       // primary
const TEAL_D = "0A4747";     // dark teal
const TEAL_DD = "072F2F";    // darkest
const GOLD = "FCB900";
const GOLD_SOFT = "FFF1CC";
const CREAM = "FBF8F3";
const TEAL_TINT = "E7F1F1";
const INK = "16302F";
const MUTED = "5E7373";
const HEAD_FONT = "Cormorant Garamond";
const BODY_FONT = "Cormorant Upright";

const CONTENT_W = 9026; // A4, 1" margins

/* ---------- helpers ---------- */
const R = (text, o = {}) => new TextRun({ text, ...o });
const P = (children, o = {}) =>
  new Paragraph({ children: Array.isArray(children) ? children : [R(children)], ...o });

const lead = (boldText, rest, o = {}) =>
  P([R(boldText, { bold: true }), R(rest)], { spacing: { before: 120, after: 80 }, ...o });

const bullet = (children) =>
  new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { after: 60 },
    children: Array.isArray(children) ? children : [R(children)],
  });
const num = (ref, children) =>
  new Paragraph({
    numbering: { reference: ref, level: 0 },
    spacing: { after: 60 },
    children: Array.isArray(children) ? children : [R(children)],
  });

/* callout = single-cell shaded box with a colored left accent */
function callout(children, { fill = CREAM, accent = TEAL } = {}) {
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: [CONTENT_W],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: CONTENT_W, type: WidthType.DXA },
            shading: { fill, type: ShadingType.CLEAR },
            margins: { top: 140, bottom: 140, left: 220, right: 200 },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              left: { style: BorderStyle.SINGLE, size: 28, color: accent },
            },
            children,
          }),
        ],
      }),
    ],
  });
}
const spacer = (h = 100) => new Paragraph({ spacing: { after: h }, children: [] });

/* data table */
function hCell(text, w, align = AlignmentType.LEFT) {
  return new TableCell({
    width: { size: w, type: WidthType.DXA },
    shading: { fill: TEAL_D, type: ShadingType.CLEAR },
    margins: { top: 70, bottom: 70, left: 110, right: 110 },
    verticalAlign: VerticalAlign.CENTER,
    children: [P([R(text, { bold: true, color: "FFFFFF", font: HEAD_FONT, size: 22 })], { alignment: align })],
  });
}
function dCell(content, w, { align = AlignmentType.LEFT, fill, bold = false, size = 21 } = {}) {
  const runs = Array.isArray(content)
    ? content
    : [R(String(content), { bold, size })];
  return new TableCell({
    width: { size: w, type: WidthType.DXA },
    ...(fill ? { shading: { fill, type: ShadingType.CLEAR } } : {}),
    margins: { top: 60, bottom: 60, left: 110, right: 110 },
    verticalAlign: VerticalAlign.CENTER,
    children: [P(runs, { alignment: align, spacing: { after: 0 } })],
  });
}
const cellBorder = { style: BorderStyle.SINGLE, size: 2, color: "D8E4E4" };
function dataTable(widths, headerRow, rows) {
  return new Table({
    width: { size: CONTENT_W, type: WidthType.DXA },
    columnWidths: widths,
    borders: { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder,
      insideHorizontal: cellBorder, insideVertical: cellBorder },
    rows: [new TableRow({ tableHeader: true, children: headerRow }), ...rows],
  });
}

/* ---------- styles ---------- */
const styles = {
  default: {
    document: {
      run: { font: BODY_FONT, size: 25, color: INK },
      paragraph: { spacing: { after: 140, line: 288 } },
    },
  },
  paragraphStyles: [
    { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
      run: { font: HEAD_FONT, size: 40, bold: true, color: TEAL },
      paragraph: { spacing: { before: 360, after: 160 }, outlineLevel: 0,
        border: { bottom: { style: BorderStyle.SINGLE, size: 8, color: TEAL, space: 6 } } } },
    { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
      run: { font: HEAD_FONT, size: 28, bold: true, color: TEAL_D },
      paragraph: { spacing: { before: 220, after: 100 }, outlineLevel: 1 } },
  ],
};

/* ============================================================
   CONTENT
   ============================================================ */
const body = [];
const A = (...x) => body.push(...x);

/* ---- COVER ---- */
A(
  P([R("♪  ostinato", { font: HEAD_FONT, size: 30, bold: true, color: TEAL })],
    { spacing: { after: 40 } }),
  new Paragraph({
    spacing: { before: 60, after: 120 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: GOLD, space: 8 } },
    children: [R("Állapotfelmérés és továbblépési javaslat",
      { font: HEAD_FONT, size: 52, bold: true, color: TEAL_DD })],
  }),
  P([R("Online zongoraiskola — a befejezéstől az élesítésig",
    { italics: true, color: MUTED, size: 26 })], { spacing: { after: 200 } }),
);
A(dataTable([2200, 6826],
  [hCell("", 2200), hCell("", 6826)],
  [
    new TableRow({ children: [dCell("Címzett", 2200, { bold: true }), dCell("Ördög Kata — ostinato.hu", 6826)] }),
    new TableRow({ children: [dCell("Készítette", 2200, { bold: true }), dCell("Gábor (eredeti fejlesztő)", 6826)] }),
    new TableRow({ children: [dCell("Tárgy", 2200, { bold: true }), dCell("Az oldal jelenlegi állapota és a felelős továbblépés útja", 6826)] }),
    new TableRow({ children: [dCell("Dátum", 2200, { bold: true }), dCell("2026. június 10.", 6826)] }),
  ],
));
A(spacer(120),
  P([R("Ez a dokumentum egy közös helyzetképet rajzol fel: hol tart most az oldal, mi változott a négy év alatt a háttértechnológiában, és mi a legésszerűbb út, hogy az ostinato.hu végre élesen, gyorsan és biztonságosan működjön.")]),
);

/* ---- 1. Vezetői összefoglaló ---- */
A(new Paragraph({ heading: HeadingLevel.HEADING_1, children: [R("1. Vezetői összefoglaló")] }));
A(callout([
  P([R("A lényeg egy bekezdésben. ", { bold: true }),
     R("Az ostinato.hu alapja a maga idejében (2022) korrekt, modern felépítésű oldal volt — csak soha nem fejeződött be, és közben eltelt négy év. Ez alatt a négy év alatt nem az oldal „romlott el”, hanem "),
     R("az iparág lépett tovább", { bold: true }),
     R(": kicserélődtek a fizetési szolgáltatók, megváltozott a sütikezelés törvényi kerete, egy egész generációt ugrott a WooCommerce és az Elementor. Emiatt az oldal "),
     R("felelősen nem élesíthető a jelenlegi állapotában", { bold: true }),
     R(", és a puszta „frissítsük fel” út is zsákutca: vagy elszáll hibára, vagy ha mégis lefut, akkor is elavult marad alatta a technológia.")],
    { spacing: { after: 100 } }),
  P([R("A javaslatom: korszerű alapokra helyezés (újraépítés). ", { bold: true }),
     R("Ez egyszeri, de nagyobb munka — cserébe viszont egy 4–5 évre előre stabil, gyors, hirdethető és könnyen kezelhető rendszert kapsz, amit valóban érdemes élesíteni.")],
    { spacing: { after: 0 } }),
], { fill: TEAL_TINT, accent: TEAL }));
A(spacer(80));
A(callout([
  P([R("💰  A javasolt megoldás (C – újraépítés) díja: 200 000 Ft",
      { bold: true, size: 30, color: TEAL_DD })], { spacing: { after: 40 } }),
  P([R("20 munkaóra × 10 000 Ft/óra alapján. Egyszeri befektetés egy évekre előre stabil, hirdethető rendszerbe.",
      { size: 23 })], { spacing: { after: 0 } }),
], { fill: GOLD_SOFT, accent: GOLD }));
A(spacer(100));
A(lead("Miért nem elég „csak kiélesíteni”? ", "Három dolog egyszerre akadályozza:"));
A(num("nA", [R("Nincs működő fizetés ", { bold: true }), R("— a beépített fizetési szolgáltató (Paylike) időközben kivonult, így jelenleg fizikailag nem lehet vásárolni az oldalon.")]));
A(num("nA", [R("Jogi kockázat ", { bold: true }), R("— a jelenlegi sütikezelő nem felel meg a 2024-ben kötelezővé vált Google Consent Mode követelményeinek, ami hirdetési tiltást és bírságkockázatot jelent.")]));
A(num("nA", [R("Technikai elavulás ", { bold: true }), R("— a kereskedelmi pluginek és az oldalépítő egy teljes generációval vannak lemaradva; a frissítésük reális eséllyel végzetes hibát (fatal error) okoz.")]));
A(lead("Miért nem megoldás a puszta frissítés sem? ", "Mert kétféleképp járhatunk, és egyik sem jó:"));
A(bullet("Egy lépésben négy évnyi változást ráengedni az oldalra reális eséllyel végzetes hibát (fatal error) okoz, és a hibakeresés bizonytalan időigényű, nehezen tervezhető munka."));
A(bullet("Ha a frissítés mégis lefut, akkor is elavult marad alatta a technológia (régi konténer, vegyes kódhalmaz, leváltandó pluginek) — a problémát nem megoldottuk, csak elhalasztottuk."));
A(spacer(40), lead("A három lehetséges út — dióhéjban:", ""));
A(dataTable([2200, 3826, 3000],
  [hCell("Út", 2200), hCell("Mit jelent", 3826), hCell("Eredmény", 3000)],
  [
    new TableRow({ children: [dCell("A) Élesítés most", 2200), dCell("a jelenlegi állapot azonnali élesítése", 3826), dCell("❌ nem üzemképes (nincs fizetés, jogi kockázat)", 3000)] }),
    new TableRow({ children: [dCell("B) Frissítés helyben", 2200), dCell("a régi rendszer megfoltozása", 3826), dCell("⚠️ kockázatos, és elavult marad", 3000)] }),
    new TableRow({ children: [dCell([R("C) Újraépítés", { bold: true })], 2200, { fill: TEAL_TINT }), dCell("korszerű alapokra helyezés", 3826, { fill: TEAL_TINT }), dCell([R("✅ ezt javaslom — stabil, gyors, hirdethető", { bold: true })], 3000, { fill: TEAL_TINT })] }),
  ],
));
A(spacer(60), lead("Mit nyersz az újraépítéssel? ", "Nem öncélú technikát, hanem üzleti eredményt:"));
A(bullet([R("működő Stripe-fizetés ", { bold: true }), R("→ tényleg lehet vásárolni, valódi bevétel;")]));
A(bullet([R("jogtisztán hirdethető ", { bold: true }), R("oldal (Consent Mode) → biztonságos hirdetési növekedés;")]));
A(bullet("gyorsabb oldal → jobb vásárlási arány és Google-helyezés;"));
A(bullet([R("egyszerű admin → Kata maga is tud ", { bold: true }), R("kurzust feltölteni, szöveget módosítani;")]));
A(bullet("modern, bizalomkeltő megjelenés és könnyen bővíthető alap a jövőre."));
A(spacer(60), callout([
  P([R("A részletes indoklás, a teljes technikai audit és a három út összehasonlítása a következő fejezetekben olvasható — de a döntéshez a fentiek megadják a lényeget.", { italics: true })], { spacing: { after: 0 } }),
]));

/* ---- 2. Hogyan olvasd ---- */
A(new Paragraph({ heading: HeadingLevel.HEADING_1, children: [R("2. Hogyan olvasd ezt az anyagot?")] }));
A(callout([P([R("Ez nem hibalista, hanem döntés-előkészítő. ", { bold: true }), R("A célja, hogy te is tisztán lásd, mi van a motorháztető alatt, és együtt tudjuk meghozni a jó döntést.")], { spacing: { after: 0 } })]));
A(P("Igyekeztem közérthetően, marketingszöveg és riogatás nélkül fogalmazni. Ahol technikai szót használok, ott a Függelékben egy mondatban elmagyarázom. A dokumentum végén három konkrét utat teszek le az asztalra, hogy ne egy „így lesz” érzés maradjon, hanem egy valódi választás."));

/* ---- 3. Jelleg, cél, funkciók ---- */
A(new Paragraph({ heading: HeadingLevel.HEADING_1, children: [R("3. Az oldal jellege, célja és funkciói")] }));
A(callout([P([R("Az ostinato.hu nem egy egyszerű bemutatkozó oldal — egy működő webáruház és tagsági rendszer. ", { bold: true }), R("Épp ezért számít, hogy minden alkatrésze megbízhatóan működjön.")], { spacing: { after: 0 } })]));
A(lead("Mi az oldal célja? ", "Ördög Kata online zongoraiskolája: strukturált, videós kurzusokat kínál kezdőtől haladóig, amelyeket a tanulók a saját tempójukban végezhetnek."));
A(lead("Milyen rendszer hajtja? ", "Az oldal a következő, egymásra épülő rétegekből áll:"));
A(dataTable([2400, 3626, 3000],
  [hCell("Réteg", 2400), hCell("Mit csinál", 3626), hCell("Mire épül", 3000)],
  [
    new TableRow({ children: [dCell("🛒 Webáruház", 2400), dCell("A kurzusok megvásárlása, kosár, fizetés", 3626), dCell("WooCommerce", 3000)] }),
    new TableRow({ children: [dCell("🔑 Tagsági rendszer", 2400), dCell("Ki mit lát/ér el a vásárlás után", 3626), dCell("WooCommerce Memberships", 3000)] }),
    new TableRow({ children: [dCell("🎥 Kurzusfelület", 2400), dCell("A videós leckék lejátszása, tananyag", 3626), dCell("Presto Player + Elementor", 3000)] }),
    new TableRow({ children: [dCell("📝 Tartalom / blog / hírlevél", 2400), dCell("Marketing, SEO, feliratkozók gyűjtése", 3626), dCell("WordPress + Yoast + űrlapok", 3000)] }),
  ],
));
A(spacer(60), P([R("Miért fontos ezt látni előre? ", { bold: true }), R("Mert épp ezek a kritikus rétegek — a "), R("fizetés, a tagság, a videólejátszás és a sütikezelés", { bold: true }), R(" — azok, amelyek a négy év alatt a leglátványosabban elavultak. Egy bemutatkozó oldalnál ez kevésbé számítana; egy pénzt mozgató, hozzáférést kezelő rendszernél viszont alapfeltétel, hogy minden alkatrész naprakész és megbízható legyen.")]));

/* ---- 4. Tartalmi készenlét ---- */
A(new Paragraph({ heading: HeadingLevel.HEADING_1, children: [R("4. Hol tart most az oldal? — tartalmi készenlét")] }));
A(callout([P([R("A tartalom befejezetlen, de ez a könnyebbik feladat. ", { bold: true }), R("A valódi akadály nem itt van, hanem a technikai alapokban (lásd a következő fejezetet).")], { spacing: { after: 0 } })]));
A(P("Az oldal több ponton még „prototípus” állapotban van — ez teljesen természetes, hiszen annak idején nem fejeztük be:"));
A(dataTable([2600, 6426],
  [hCell("Terület", 2600), hCell("Jelenlegi állapot", 6426)],
  [
    ["Szövegek", "Több helyen helykitöltő szöveg (Lorem ipsum, „Ez a címsor” típusú próbacímek)"],
    ["Képek", "Placeholder / próbaképek a végleges fotók helyett"],
    ["GYIK", "Kidolgozatlan, kitöltetlen kérdés-válasz párok"],
    ["Kurzusok", "Nincs élesen feltöltve valódi kurzus, ár és leírás"],
    ["Lábléc", "Még 2022-es a copyright év"],
    ["Vásárlás", "A fizetési szolgáltató megszűnése miatt nem teljesíthető"],
  ].map(([a, b]) => new TableRow({ children: [dCell([R(a, { bold: true })], 2600), dCell(b, 6426)] })),
));
A(spacer(60), P([R("Összegezve: ", { bold: true }), R("a tartalmi hiányok pótolhatók — ez rutinmunka. "), R("A fő akadály nem ez", { bold: true }), R(", hanem az alatta lévő technikai környezet, amit a következő fejezet vesz górcső alá.")]));

/* ---- 5. Technikai audit ---- */
A(new Paragraph({ heading: HeadingLevel.HEADING_1, children: [R("5. Technikai állapotfelmérés")] }));
A(callout([P([R("Itt van a kutya elásva. ", { bold: true }), R("Az oldal kereskedelmi „motorja” 2022-ben befagyott, miközben körülötte mindent kicseréltek. Ez a kombináció az, ami miatt a sima frissítés veszélyes.")], { spacing: { after: 0 } })]));

A(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [R("5.1 A környezet pillanatképe")] }));
A(P("Az alábbi adatokat az oldal saját rendszerjelzéseiből és a megadott szerveradatokból állítottam össze (2026-06-10)."));
A(dataTable([2100, 2400, 1500, 1626, 1400],
  [hCell("Komponens", 2100), hCell("Telepített", 2400), hCell("2026-os aktuális", 1500), hCell("Elmaradás", 1626), hCell("Kockázat", 1400)],
  [
    ["WooCommerce", "6.5.2 (2022. ápr.)", "~10.x", "~4 főverzió", "🔴 Magas"],
    ["Elementor", "3.6.5", "4.x", "egy generáció (konténer-váltás)", "🔴 Magas"],
    ["WC Memberships", "régi (2022-es)", "aktuális", "több főverzió", "🔴 Magas"],
    ["WordPress mag", "frissítés vár", "legfrissebb", "aszinkron a pluginekkel", "🟠 Közepes"],
    ["PHP", "7.4 (EOL 2022 vége)", "8.2 / 8.3", "1–2 főverzió", "🔴 Magas"],
    ["Webszerver", "Apache", "—", "—", "—"],
    ["Cache / CDN", "NitroPack", "korszerűbb alt.", "—", "🟠 Közepes"],
  ].map((r) => new TableRow({ children: [
    dCell([R(r[0], { bold: true })], 2100), dCell(r[1], 2400), dCell(r[2], 1500, { align: AlignmentType.CENTER }),
    dCell(r[3], 1626), dCell(r[4], 1400, { align: AlignmentType.CENTER }),
  ] })),
));
A(spacer(60), callout([
  P([R("Egy fontos megfigyelés. ", { bold: true }), R("Az oldal magja (WordPress) idő közben mozoghatott, miközben a kereskedelmi réteg — WooCommerce, Elementor, fizetés — 2022-ben befagyott. "), R("Pont ez a szétcsúszás a legkockázatosabb:", { bold: true }), R(" egy korszerű mag alatt négyéves, nem kompatibilis bővítmények futnak. Bármilyen frissítési kísérletnél ez vezet leggyakrabban végzetes hibához.")], { spacing: { after: 0 } }),
], { fill: GOLD_SOFT, accent: GOLD }));

A(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [R("5.2 Mi történt négy év alatt? — nem az oldal romlott el, hanem az iparág lépett")] }));
A(P("Ez a kulcsfejezet. A 2022-ben választott megoldások akkor korrektek és korszerűek voltak. Azóta viszont az alábbi, tőlünk független iparági váltások történtek:"));
A(bullet([R("Elementor konténer-váltás. ", { bold: true }), R("A 3.x (a telepített verzió) még a régi, „display block” alapú elrendezést használta. Az Elementor azóta áttért a modern flexbox/grid konténerre — ez gyorsabb és reszponzívabb, de a régi felépítés nem konvertálódik át automatikusan. "), R("Fontos következmény:", { bold: true }), R(" új szekciókat és elemeket mostantól már csak az új rendszerben lehet létrehozni, miközben a meglévő tartalom a régin marad — így ugyanazon az oldalon "), R("vegyes kódhalmaz", { bold: true }), R(" keletkezik. Ez közvetlenül rontja a kódminőséget, és a mindennapokban két szinten csapódik le: "), R("kezelői (admin) szinten", { bold: true }), R(" inkonzisztens szerkesztőfelületekben (kétféle építő-logika, eltérő megoldások ugyanarra a feladatra), "), R("látogatói szinten", { bold: true }), R(" pedig széteső, „elcsúszó” layoutokban és lassuló oldalban.")]));
A(bullet([R("PHP 7.4 → 8.x. ", { bold: true }), R("Az oldal jelenleg PHP 7.4-en fut, amelynek hivatalos támogatása 2022 vége óta megszűnt — vagyis "), R("nem kap több biztonsági frissítést", { bold: true }), R(". A korszerű PHP 8.x viszont sok régi kódszerkezetet már nem tolerál; a 2022-es pluginek egy része egész egyszerűen nem fut le rajta hiba nélkül. Ez egy csapda: a 7.4-en maradni biztonsági kockázat, a 8.x-re lépni viszont a jelenlegi bővítményekkel hibákat okoz.")]));
A(bullet([R("Google Consent Mode v2 (2024). ", { bold: true }), R("A sütikezelésnek 2024 óta új, kötelező követelményei vannak. A jelenlegi cookie-plugin ezeknek nem felel meg → emiatt nem lehet jogtisztán hirdetni, és ellenőrzés esetén bírságot kockáztat.")]));
A(bullet([R("A Paylike kivonulása. ", { bold: true }), R("A beépített fizetési szolgáltató megszűnt. A piaci sztenderd ma a Stripe — ez nem csere-darab, hanem új fizetési integráció.")]));
A(bullet([R("WooCommerce HPOS. ", { bold: true }), R("A WooCommerce időközben új, gyorsabb rendelés-adatmodellre (HPOS) állt át, ami az aktuális verziók alapértelmezése. A 2022-es adatszerkezet erre külön migrációt igényel.")]));
A(spacer(40), callout([P([R("Tehát: ", { bold: true }), R("nem arról van szó, hogy az oldal rosszul készült. Arról van szó, hogy a körülötte lévő egész ökoszisztéma kicserélődött — és egy befejezetlenül, négy évig állt oldal ezt nem tudta „magától” lekövetni.")], { spacing: { after: 0 } })]));

A(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [R("5.3 Plugin-leltár — mi avult el és mivel váltjuk ki")] }));
A(P("Az alábbi bővítmények ma már elavultak, megszűntek, vagy korszerűbb megoldás váltotta le őket. Ez nem azt jelenti, hogy 2022-ben rosszul választottuk őket — egyszerűen lejárt az idejük."));
A(dataTable([2200, 1400, 3026, 2400],
  [hCell("Plugin", 2200), hCell("Állapot", 1400), hCell("Probléma 2026-ban", 3026), hCell("Korszerű kiváltás", 2400)],
  [
    ["WooCommerce Paylike Gateway", "🔴 Megszűnt", "A fizetési szolgáltató kivonult — nincs működő fizetés", "Stripe integráció"],
    ["GDPR Cookie Compliance", "🔴 Nem megfelelő", "Nem támogatja a Google Consent Mode-ot → hirdetési tiltás, bírságkockázat", "Consent Mode-kompatibilis sütikezelő"],
    ["NitroPack", "🟠 Nem ajánlott", "Külső, „dobozos” cache; saját megoldás stabilabb és gyorsabb", "Saját szerveroldali cache + képoptimalizálás"],
    ["Envato Elements", "🔴 Megszűnt", "A bővítmény támogatása megszűnt", "Beépített, natív design-elemek"],
    ["HelloPack", "🟠 Lejárt licensz", "A prémium csomag előfizetése nem él", "Hivatalos prémium plugin-licenszek (általam)"],
    ["The Plus Addons for Elementor", "🟠 Kockázatos", "Addon-rétegek lassúak és sérülékenyek", "Korszerű, könnyű építő-megoldás"],
    ["Presto Player", "🟠 Elavult", "Mai videós igényekre korlátozott", "Modern videó-beágyazás"],
    ["Quiz Maker", "🟠 Elavult", "Nehézkesen kezelhető", "Könnyebben kezelhető kvíz-megoldás"],
    ["wpDiscuz", "🟠 Elavult", "Korszerűbb hozzászólás/chat-megoldások vannak", "Modern megoldás (ha kell)"],
    ["Plugin Organizer", "🟠 Elavult", "Régi optimalizáló logika", "Korszerű teljesítmény-megoldás"],
    ["UpdraftPlus", "🟢 Cserélhető", "Megbízhatóbb mentés-megoldás elérhető", "Korszerű, ütemezett backup"],
    ["Akismet Anti-Spam", "🟢 Súlytalan", "Mai űrlapokra már nem hatékony", "Modern captcha / spam-szűrés"],
  ].map((r) => new TableRow({ children: [
    dCell([R(r[0], { bold: true, size: 20 })], 2200), dCell(r[1], 1400, { size: 20 }), dCell(r[2], 3026, { size: 20 }), dCell(r[3], 2400, { size: 20 }),
  ] })),
));
A(P([R("🔴 = blokkoló / megszűnt · 🟠 = elavult, cserélendő · 🟢 = működik, de jobb alternatíva van", { italics: true, color: MUTED, size: 20 })], { spacing: { before: 60 } }));

A(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [R("5.4 Miért zsákutca a „csak frissítsük fel”?")] }));
A(P("Logikus kérdés: ha minden elavult, miért nem nyomjuk meg egyszerűen a „Frissítés” gombot? Két okból:"));
A(num("nB", [R("Reális a végzetes hiba (fatal error). ", { bold: true }), R("Egy lépésben négy évnyi változást ráengedni az oldalra — WooCommerce 6.5 → 10, Elementor 3 → 4, plusz a PHP-ugrás — azt jelenti, hogy egyszerre több tucat „töréspont” (breaking change) zúdul rá. Ezek egy része megáll egy fehér képernyős hibánál, és innen a hibakeresés bizonytalan időigényű kézi munka — gyakran hosszabb és drágább, mint tiszta lapról építeni.")]));
A(num("nB", [R("Még ha le is fut, elavult marad. ", { bold: true }), R("Tegyük fel, hogy a frissítés valahogy átmegy. Akkor is ott marad alatta a régi Elementor-konténer, a köré épült logika, a leváltandó pluginek köré huzalozott működés. Vagyis a technikai adósságot nem törlesztettük, csak elhalasztottuk — fél-egy év múlva ugyanitt tartunk, újra fizetve a foltozgatásért.")]));
A(spacer(40), callout([P([R("Analógia: ", { bold: true }), R("felújíthatjuk a motort egy autóban, de ha az alváz és a karosszéria elkorrodált, akkor sem lesz belőle megbízható, biztonságos kocsi. Az ostinato.hu „alváza” — az alaparchitektúra — az, ami megújításra szorul.", { italics: true })], { spacing: { after: 0 } })]));

/* ---- 6. Három út ---- */
A(new Paragraph({ heading: HeadingLevel.HEADING_1, children: [R("6. A három lehetséges út")] }));
A(callout([P([R("Három valódi opció van. A javasolt út (C) konkrét árát alább megadom; a másik kettőt összehasonlításként, a következményeikkel együtt teszem mellé, hogy lásd, mit mivel veszel.", { bold: true })], { spacing: { after: 0 } })]));
const mk = (s, a, b, c, hi) => new TableRow({ children: [
  dCell([R(s, { bold: true, size: 21 })], 3626, hi ? { fill: TEAL_TINT } : {}),
  dCell(a, 1800, { align: AlignmentType.CENTER, fill: hi ? TEAL_TINT : undefined }),
  dCell(b, 1800, { align: AlignmentType.CENTER, fill: hi ? TEAL_TINT : undefined }),
  dCell(c, 1800, { align: AlignmentType.CENTER, fill: hi ? TEAL_TINT : undefined }),
] });
A(dataTable([3626, 1800, 1800, 1800],
  [hCell("Szempont", 3626), hCell("A) Élesítés most", 1800, AlignmentType.CENTER), hCell("B) Frissítés helyben", 1800, AlignmentType.CENTER), hCell("C) Újraépítés", 1800, AlignmentType.CENTER)],
  [
    mk("Biztonság", "❌", "⚠️", "✅"),
    mk("Sebesség", "❌", "⚠️", "✅"),
    mk("Stabilitás (fatal error kockázat)", "⚠️", "❌", "✅"),
    mk("Működő fizetés", "❌", "⚠️", "✅"),
    mk("GDPR / Consent megfelelés", "❌", "⚠️", "✅"),
    mk("Hirdethetőség", "❌", "⚠️", "✅"),
    mk("Bővíthetőség", "❌", "❌", "✅"),
    mk("Admin-kezelhetőség", "⚠️", "⚠️", "✅"),
    mk("Hosszú távú költség", "🔴", "🔴", "🟢"),
  ],
));
A(P([R("✅ = megfelelő · ⚠️ = részleges / kockázatos · ❌ = nem megfelelő", { italics: true, color: MUTED, size: 20 })], { spacing: { before: 60 } }));

A(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [R("A) Élesítés a jelenlegi állapotban — nem javasolt")] }));
A(P("Gyors lenne, de érdemben nem üzemképes: nincs működő fizetés, a sütikezelés nem jogtiszta, a tartalom helykitöltő, és biztonságilag is sebezhető. Élesen ez nem segítené, hanem inkább rontaná Kata megítélését."));
A(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [R("B) Frissítés helyben (patch & launch) — részmegoldás, hosszabb távon drágább")] }));
A(P("Megpróbálnánk a meglévőt frissíteni és összefoltozni. A kimenet bizonytalan: reális a végzetes hiba, és a hibakeresés időigénye nehezen tervezhető. Ráadásul siker esetén is elavult architektúra és technikai adósság marad — ez a „most olcsóbbnak tűnik, később többe kerül” forgatókönyv."));
A(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [R("C) Újraépítés korszerű alapokon — javasolt")] }));
A(P("Tiszta, modern alapokra helyezzük az oldalt, megtartva mindent, ami értékes (márka, koncepció, a már megtervezett modern arculat):"));
[
  "friss WordPress + PHP 8.x;",
  "aktuális WooCommerce + Memberships, már a gyors HPOS-adatmodellen;",
  "Stripe fizetés (működő vásárlás);",
  "Consent Mode-kompatibilis sütikezelés (jogtiszta + hirdethető);",
  "korszerű, gyors oldalépítő-konténer a régi helyett;",
  "saját, finomhangolt cache a NitroPack helyett;",
  "hivatalos prémium plugin-licenszek a lejárt HelloPack helyett (ezt biztosítom);",
  "korszerű, könnyen karbantartható kurzus- és tagsági felület;",
  "valódi tartalom, képek, kurzusok.",
].forEach((t) => A(bullet(t)));
A(P([R("Az eredmény: ", { bold: true }), R("gyors, biztonságos, hirdethető, bővíthető és Kata által is könnyen kezelhető oldal — olyan, amit valóban érdemes élesíteni.")]));
A(spacer(40), callout([P([R("💰  A C út díja: 200 000 Ft ", { bold: true, color: TEAL_DD, size: 26 }), R("— 20 munkaóra × 10 000 Ft/óra. Egyszeri tétel, a részletes ütemtervvel együtt.", { size: 23 })], { spacing: { after: 0 } })], { fill: GOLD_SOFT, accent: GOLD }));

/* ---- 7. Üzleti érték ---- */
A(new Paragraph({ heading: HeadingLevel.HEADING_1, children: [R("7. Mit nyersz az újraépítéssel? — az üzleti érték")] }));
A(callout([P([R("Ez nem öncélú technika. ", { bold: true }), R("Minden műszaki döntésnek van egy üzleti megfelelője.")], { spacing: { after: 0 } })]));
A(dataTable([3800, 5226],
  [hCell("Műszaki előny", 3800), hCell("Amit Kata ebből lát", 5226)],
  [
    ["Gyorsabb oldal", "Jobb élmény → magasabb vásárlási arány, jobb Google-helyezés"],
    ["Működő Stripe-fizetés", "Tényleg lehet vásárolni → valódi bevétel"],
    ["Consent Mode-megfelelés", "Jogtisztán hirdethető → biztonságos hirdetési növekedés"],
    ["Egyszerű admin", "Kata maga is fel tud tölteni kurzust, módosítani szöveget"],
    ["Modern dizájn", "Profi, bizalomkeltő megjelenés → erősebb márka"],
    ["Karbantartható alap", "Az új funkciók gyorsan és olcsón ráépíthetők"],
  ].map((r) => new TableRow({ children: [dCell([R(r[0], { bold: true })], 3800), dCell(r[1], 5226)] })),
));

/* ---- 8. Miért kerül többe ---- */
A(new Paragraph({ heading: HeadingLevel.HEADING_1, children: [R("8. Miért kerül ez kicsit többe?")] }));
A(callout([P([R("Őszintén: mert ez nem ugyanaz a munka, mint amiről eredetileg szó volt.", { bold: true })], { spacing: { after: 0 } })]));
A(P("Az eredeti elképzelés egy „kész oldal kiélesítése” volt — az pár napos rutinfeladat lenne. A valóság viszont az, hogy a négy év alatt megváltozott környezet miatt ez mostanra három feladat egyben:"));
A(num("nC", [R("Korszerű alapra helyezés ", { bold: true }), R("— friss, biztonságos, gyors technikai környezet.")]));
A(num("nC", [R("A kritikus rendszerek újrahuzalozása ", { bold: true }), R("— fizetés (Stripe), tagság, kurzusfelület, sütikezelés.")]));
A(num("nC", [R("A tartalom befejezése ", { bold: true }), R("— valódi szövegek, képek, kurzusok.")]));
A(spacer(40), lead("A javasolt újraépítés díja:", ""));
A(dataTable([4626, 1600, 1400, 1400],
  [hCell("Tétel", 4626), hCell("Mennyiség", 1600, AlignmentType.CENTER), hCell("Óradíj", 1400, AlignmentType.CENTER), hCell("Összeg", 1400, AlignmentType.CENTER)],
  [
    new TableRow({ children: [
      dCell("Korszerű alap + fizetés/tagság/kurzus újrahuzalozás + tartalom befejezése", 4626),
      dCell("20 munkaóra", 1600, { align: AlignmentType.CENTER }),
      dCell("10 000 Ft", 1400, { align: AlignmentType.CENTER }),
      dCell("200 000 Ft", 1400, { align: AlignmentType.CENTER }),
    ] }),
    new TableRow({ children: [
      dCell([R("Mindösszesen", { bold: true })], 4626, { fill: GOLD_SOFT }),
      dCell("", 1600, { fill: GOLD_SOFT }),
      dCell("", 1400, { fill: GOLD_SOFT }),
      dCell([R("200 000 Ft", { bold: true })], 1400, { align: AlignmentType.CENTER, fill: GOLD_SOFT }),
    ] }),
  ],
));
A(spacer(60), callout([P([R("Ez ", {}), R("egyszeri", { bold: true }), R(" tétel — szemben a „foltozzunk” úttal, ami jó eséllyel fél éven belül újabb, ismétlődő kiadást jelent. A pontos ütemtervet a megrendelés után egyeztetjük.")], { spacing: { after: 0 } })]));

/* ---- 9. Következő lépések ---- */
A(new Paragraph({ heading: HeadingLevel.HEADING_1, children: [R("9. Javasolt következő lépések")] }));
A(num("nD", [R("Részletes technikai feltárás ", { bold: true }), R("— a tárhely- és szerverkörnyezet teljes feltérképezése, és a pontos újraépítési/migrációs lista összeállítása.")]));
A(num("nD", [R("Közös döntés ", { bold: true }), R("— átbeszéljük a három utat, és kiválasztjuk a Katának megfelelőt (a javaslatom a C).")]));
A(num("nD", [R("Indulás ", { bold: true }), R("— a döntés után rögzítjük az ütemtervet, és megkezdjük a munkát a C út szerint (20 munkaóra, 200 000 Ft).")]));
A(spacer(40), callout([P([R("Egy mondatban: ", { bold: true }), R("az ostinato.hu jó koncepció erős alapokkal — most az a feladat, hogy a technika is felzárkózzon hozzá, hogy végre élesen, magabiztosan működhessen.", { italics: true })], { spacing: { after: 0 } })], { fill: TEAL_TINT, accent: TEAL }));

/* ---- 10. Függelék ---- */
A(new Paragraph({ heading: HeadingLevel.HEADING_1, children: [R("10. Függelék — fogalomtár")] }));
[
  ["Fatal error (végzetes hiba):", " olyan programhiba, amitől az oldal teljesen leáll (fehér képernyő). Frissítéskor a leggyakoribb buktató."],
  ["PHP:", " a szerveroldali „nyelv”, amin a WordPress fut. A régi PHP-verziók már nem kapnak biztonsági frissítést, és sok modern bővítmény nem fut rajtuk."],
  ["Consent Mode (Google):", " a sütik/hirdetési hozzájárulás 2024 óta kötelező, szabványos kezelési módja. Enélkül nem lehet jogtisztán hirdetni."],
  ["HPOS (High-Performance Order Storage):", " a WooCommerce új, gyorsabb rendelés-adattárolása, ami a mai verziók alapértelmezése."],
  ["Flexbox/grid konténer (Elementor):", " a modern, gyorsabb és rugalmasabb elrendezési mód, ami leváltotta a régi „display block” felépítést."],
  ["Technikai adósság:", " a halasztott frissítések/elavult megoldások „kamatos” költsége — minél tovább halogatjuk, annál drágább behozni."],
  ["Stripe:", " vezető, megbízható online fizetési szolgáltató; a megszűnt Paylike korszerű utódja."],
].forEach(([t, d]) => A(bullet([R(t, { bold: true, color: TEAL_D }), R(d)])));
A(spacer(120), new Paragraph({
  border: { top: { style: BorderStyle.SINGLE, size: 6, color: "D8E4E4", space: 8 } },
  spacing: { before: 80 },
  children: [R("Forrás: az ostinato.hu rendszerjelzései és a telepített bővítmények listája, 2026. június 10.",
    { italics: true, color: MUTED, size: 20 })],
}));

/* ============================================================
   DOCUMENT
   ============================================================ */
const doc = new Document({
  styles,
  numbering: {
    config: [
      { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { run: { color: TEAL }, paragraph: { indent: { left: 460, hanging: 260 } } } }] },
      ...["nA", "nB", "nC", "nD"].map((ref) => ({
        reference: ref,
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { run: { bold: true, color: TEAL }, paragraph: { indent: { left: 460, hanging: 260 } } } }],
      })),
    ],
  },
  sections: [{
    properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1300, right: 1440, bottom: 1300, left: 1440 } } },
    headers: { default: new Header({ children: [new Paragraph({
      border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "D8E4E4", space: 4 } },
      tabStops: [{ type: TabStopType.RIGHT, position: 9026 }],
      children: [R("♪  ostinato.hu", { color: TEAL, font: HEAD_FONT, size: 20, bold: true }), R("\tÁllapotfelmérés és továbblépési javaslat", { color: MUTED, size: 18 })],
    })] }) },
    footers: { default: new Footer({ children: [new Paragraph({
      border: { top: { style: BorderStyle.SINGLE, size: 4, color: "D8E4E4", space: 4 } },
      tabStops: [{ type: TabStopType.RIGHT, position: 9026 }],
      children: [R("Ördög Kata — ostinato.hu", { color: MUTED, size: 18 }), new TextRun({ children: ["\t", PageNumber.CURRENT, " / ", PageNumber.TOTAL_PAGES], color: MUTED, size: 18 })],
    })] }) },
    children: body,
  }],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync("ostinato-allapotfelmeres-es-javaslat.docx", buf);
  console.log("WROTE ostinato-allapotfelmeres-es-javaslat.docx", buf.length, "bytes");
});
