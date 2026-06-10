# ostinato.hu — Állapotfelmérés és továbblépési javaslat

> **♪ Online zongoraiskola — a befejezéstől az élesítésig**
>
> | | |
> |---|---|
> | **Címzett** | Ördög Kata — ostinato.hu |
> | **Készítette** | Gábor (eredeti fejlesztő) |
> | **Tárgy** | Az oldal jelenlegi állapota és a felelős továbblépés útja |
> | **Dátum** | 2026. június 10. |

Ez a dokumentum egy közös helyzetképet rajzol fel: hol tart most az oldal, mi változott a négy év alatt a háttértechnológiában, és mi a legészszerűbb út, hogy az ostinato.hu végre élesen, gyorsan és biztonságosan működjön.

---

## 1. Vezetői összefoglaló

> **A lényeg egy bekezdésben.** Az ostinato.hu alapja a maga idejében (2022) korrekt, modern felépítésű oldal volt — csak soha nem fejeződött be, és közben eltelt négy év. Ez alatt a négy év alatt nem az oldal „romlott el", hanem **az iparág lépett tovább**: kicserélődtek a fizetési szolgáltatók, megváltozott a sütikezelés törvényi kerete, egy egész generációt ugrott a WooCommerce és az Elementor. Emiatt az oldal **felelősen nem élesíthető a jelenlegi állapotában**, és a puszta „frissítsük fel" út is zsákutca: vagy elszáll hibára, vagy ha mégis lefut, akkor is elavult marad alatta a technológia.
>
> **A javaslatom: korszerű alapokra helyezés (újraépítés).** Ez egyszeri, de nagyobb munka — cserébe viszont egy 4–5 évre előre stabil, gyors, hirdethető és könnyen kezelhető rendszert kapsz, amit valóban érdemes élesíteni.

> 💰 **A javasolt megoldás (C – újraépítés) díja: 200 000 Ft**
> — 20 munkaóra × 10 000 Ft/óra alapján. Egyszeri befektetés egy évekre előre stabil, hirdethető rendszerbe.

**Miért nem elég „csak kiélesíteni"?** Három dolog egyszerre akadályozza:

1. **Nincs működő fizetés** — a beépített fizetési szolgáltató (Paylike) időközben kivonult, így jelenleg fizikailag nem lehet vásárolni az oldalon.
2. **Jogi kockázat** — a jelenlegi sütikezelő nem felel meg a 2024-ben kötelezővé vált Google Consent Mode követelményeinek, ami hirdetési tiltást és bírságkockázatot jelent.
3. **Technikai elavulás** — a kereskedelmi pluginek és az oldalépítő egy teljes generációval vannak lemaradva; a frissítésük reális eséllyel végzetes hibát (fatal error) okoz.

**Miért nem megoldás a puszta frissítés sem?** Mert kétféleképp járhatunk, és egyik sem jó:

- Egy lépésben négy évnyi változást ráengedni az oldalra reális eséllyel **végzetes hibát (fatal error)** okoz, és a hibakeresés bizonytalan időigényű, nehezen tervezhető munka.
- Ha a frissítés mégis lefut, **akkor is elavult marad** alatta a technológia (régi konténer, vegyes kódhalmaz, leváltandó pluginek) — a problémát nem megoldottuk, csak elhalasztottuk.

**A három lehetséges út — dióhéjban:**

| Út | Mit jelent | Eredmény |
|---|---|---|
| A) Élesítés most | a jelenlegi állapot azonnali élesítése | ❌ nem üzemképes (nincs fizetés, jogi kockázat) |
| B) Frissítés helyben | a régi rendszer megfoltozása | ⚠️ kockázatos, és elavult marad |
| **C) Újraépítés** | korszerű alapokra helyezés | ✅ **ezt javaslom** — stabil, gyors, hirdethető |

**Mit nyersz az újraépítéssel?** Nem öncélú technikát, hanem üzleti eredményt:

- működő **Stripe-fizetés** → tényleg lehet vásárolni, **valódi bevétel**;
- **jogtisztán hirdethető** oldal (Consent Mode) → biztonságos hirdetési növekedés;
- gyorsabb oldal → jobb vásárlási arány és Google-helyezés;
- egyszerű admin → **Kata maga is tud** kurzust feltölteni, szöveget módosítani;
- modern, bizalomkeltő megjelenés és könnyen bővíthető alap a jövőre.

> A részletes indoklás, a teljes technikai audit és a három út összehasonlítása a következő fejezetekben olvasható — de a döntéshez a fentiek megadják a lényeget.

---

## 2. Hogyan olvasd ezt az anyagot?

> **Ez nem hibalista, hanem döntés-előkészítő.** A célja, hogy te is tisztán lásd, mi van a motorháztető alatt, és együtt tudjuk meghozni a jó döntést.

Igyekeztem közérthetően, marketingszöveg és riogatás nélkül fogalmazni. Ahol technikai szót használok, ott a [Függelékben](#10-függelék--fogalomtár) egy mondatban elmagyarázom. A dokumentum végén három konkrét utat teszek le az asztalra, hogy ne egy „így lesz" érzés maradjon, hanem egy valódi választás.

---

## 3. Az oldal jellege, célja és funkciói

> **Az ostinato.hu nem egy egyszerű bemutatkozó oldal — egy működő webáruház és tagsági rendszer.** Épp ezért számít, hogy minden alkatrésze megbízhatóan működjön.

**Mi az oldal célja?** Ördög Kata online zongoraiskolája: strukturált, videós kurzusokat kínál kezdőtől haladóig, amelyeket a tanulók a saját tempójukban végezhetnek.

**Milyen rendszer hajtja?** Az oldal a következő, egymásra épülő rétegekből áll:

| Réteg | Mit csinál | Mire épül |
|---|---|---|
| 🛒 **Webáruház** | A kurzusok megvásárlása, kosár, fizetés | WooCommerce |
| 🔑 **Tagsági rendszer** | Ki mit lát/ér el a vásárlás után | WooCommerce Memberships |
| 🎥 **Kurzusfelület** | A videós leckék lejátszása, tananyag | Presto Player + Elementor |
| 📝 **Tartalom / blog / hírlevél** | Marketing, SEO, feliratkozók gyűjtése | WordPress + Yoast + űrlapok |

**Miért fontos ezt látni előre?** Mert épp ezek a kritikus rétegek — a **fizetés, a tagság, a videólejátszás és a sütikezelés** — azok, amelyek a négy év alatt a leglátványosabban elavultak. Egy bemutatkozó oldalnál ez kevésbé számítana; egy pénzt mozgató, hozzáférést kezelő rendszernél viszont alapfeltétel, hogy minden alkatrész naprakész és megbízható legyen.

---

## 4. Hol tart most az oldal? — tartalmi készenlét

> **A tartalom befejezetlen, de ez a könnyebbik feladat.** A valódi akadály nem itt van, hanem a technikai alapokban (lásd a következő fejezetet).

Az oldal több ponton még „prototípus" állapotban van — ez teljesen természetes, hiszen annak idején nem fejeztük be:

| Terület | Jelenlegi állapot |
|---|---|
| Szövegek | Több helyen helykitöltő szöveg (Lorem ipsum, „Ez a címsor" típusú próbacímek) |
| Képek | Placeholder / próbaképek a végleges fotók helyett |
| GYIK | Kidolgozatlan, kitöltetlen kérdés-válasz párok |
| Kurzusok | Nincs élesen feltöltve valódi kurzus, ár és leírás |
| Lábléc | Még 2022-es a copyright év |
| Vásárlás | A fizetési szolgáltató megszűnése miatt nem teljesíthető |

**Összegezve:** a tartalmi hiányok pótolhatók — ez rutinmunka. **A fő akadály nem ez**, hanem az alatta lévő technikai környezet, amit a következő fejezet vesz górcső alá.

---

## 5. Technikai állapotfelmérés

> **Itt van a kutya elásva.** Az oldal kereskedelmi „motorja" 2022-ben befagyott, miközben körülötte mindent kicseréltek. Ez a kombináció az, ami miatt a sima frissítés veszélyes.

### 5.1 A környezet pillanatképe

Az alábbi adatokat az oldal saját rendszerjelzéseiből és a megadott szerveradatokból állítottam össze (2026-06-10).

| Komponens | Telepített | 2026-os aktuális | Elmaradás | Kockázat |
|---|---|---|---|---|
| WooCommerce | **6.5.2** (2022. ápr.) | ~10.x | ⬆️ ~4 főverzió | 🔴 Magas |
| Elementor | **3.6.5** | 4.x | ⬆️ egy generáció (konténer-váltás) | 🔴 Magas |
| WooCommerce Memberships | régi (2022-es) | aktuális | ⬆️ több főverzió | 🔴 Magas |
| WordPress mag | frissítés vár (banner: „WP 7.0 elérhető") | legfrissebb | ⬆️ aszinkron a pluginekkel | 🟠 Közepes |
| PHP | **7.4** (támogatása 2022 vége óta megszűnt) | 8.2 / 8.3 | ⬆️ 1–2 főverzió | 🔴 Magas |
| Webszerver | Apache | — | — | — |
| Cache / CDN | NitroPack | korszerűbb alternatíva | — | 🟠 Közepes |

> **Egy fontos megfigyelés.** Az oldal magja (WordPress) idő közben mozoghatott, miközben a kereskedelmi réteg — WooCommerce, Elementor, fizetés — 2022-ben befagyott. **Pont ez a szétcsúszás a legkockázatosabb:** egy korszerű mag alatt négyéves, nem kompatibilis bővítmények futnak. Bármilyen frissítési kísérletnél ez vezet leggyakrabban végzetes hibához.

### 5.2 Mi történt négy év alatt? — nem az oldal romlott el, hanem az iparág lépett

Ez a kulcsfejezet. A 2022-ben választott megoldások akkor **korrektek és korszerűek** voltak. Azóta viszont az alábbi, tőlünk független iparági váltások történtek:

- **Elementor konténer-váltás.** A 3.x (a telepített verzió) még a régi, „display block" alapú elrendezést használta. Az Elementor azóta áttért a modern flexbox/grid konténerre — ez gyorsabb és reszponzívabb, de a régi felépítés nem konvertálódik át automatikusan. **Fontos következmény:** új szekciókat és elemeket mostantól már csak az új rendszerben lehet létrehozni, miközben a meglévő tartalom a régin marad — így ugyanazon az oldalon **vegyes kódhalmaz** keletkezik. Ez közvetlenül rontja a kódminőséget, és a mindennapokban két szinten csapódik le: **kezelői (admin) szinten** inkonzisztens szerkesztőfelületekben (kétféle építő-logika, eltérő megoldások ugyanarra a feladatra — nehezebb és lassabb a karbantartás), **látogatói szinten** pedig széteső, „elcsúszó" layoutokban és lassuló oldalban.
- **PHP 7.4 → 8.x.** Az oldal jelenleg PHP 7.4-en fut, amelynek hivatalos támogatása 2022 vége óta megszűnt — vagyis **nem kap több biztonsági frissítést**. A korszerű PHP 8.x viszont sok régi kódszerkezetet már nem tolerál; a 2022-es pluginek egy része egész egyszerűen nem fut le rajta hiba nélkül. Ez egy csapda: a 7.4-en maradni biztonsági kockázat, a 8.x-re lépni viszont a jelenlegi bővítményekkel hibákat okoz.
- **Google Consent Mode v2 (2024).** A sütikezelésnek 2024 óta új, kötelező követelményei vannak. A jelenlegi cookie-plugin ezeknek nem felel meg → **emiatt nem lehet jogtisztán hirdetni, és ellenőrzés esetén bírságot kockáztat.**
- **A Paylike kivonulása.** A beépített fizetési szolgáltató megszűnt. A piaci sztenderd ma a **Stripe** — ez nem csere-darab, hanem új fizetési integráció.
- **WooCommerce HPOS.** A WooCommerce időközben új, gyorsabb rendelés-adatmodellre (HPOS) állt át, ami az aktuális verziók alapértelmezése. A 2022-es adatszerkezet erre külön migrációt igényel.

> **Tehát:** nem arról van szó, hogy az oldal rosszul készült. Arról van szó, hogy a körülötte lévő egész ökoszisztéma kicserélődött — és egy befejezetlenül, négy évig állt oldal ezt nem tudta „magától" lekövetni.

### 5.3 Plugin-leltár — mi avult el és mivel váltjuk ki

Az alábbi bővítmények ma már elavultak, megszűntek, vagy korszerűbb megoldás váltotta le őket. Ez **nem** azt jelenti, hogy 2022-ben rosszul választottuk őket — egyszerűen lejárt az idejük.

| Plugin | Állapot | Probléma 2026-ban | Korszerű kiváltás |
|---|---|---|---|
| **WooCommerce Paylike Gateway** | 🔴 Megszűnt | A fizetési szolgáltató kivonult — nincs működő fizetés | **Stripe** integráció |
| **GDPR Cookie Compliance** | 🔴 Nem megfelelő | Nem támogatja a Google Consent Mode-ot → hirdetési tiltás, bírságkockázat | Consent Mode-kompatibilis sütikezelő |
| **NitroPack** | 🟠 Nem ajánlott | Külső, „dobozos" cache; saját, finomhangolt megoldás stabilabb és gyorsabb | Saját szerveroldali cache + képoptimalizálás |
| **Envato Elements** | 🔴 Megszűnt | A bővítmény támogatása megszűnt | Beépített, natív design-elemek |
| **HelloPack** | 🟠 Lejárt licensz | A prémium csomag előfizetése nem él | Hivatalos prémium plugin-licenszek (általam biztosítva) |
| **The Plus Addons for Elementor** | 🟠 Kockázatos | Addon-rétegek lassúak és sérülékenyek | Korszerű, könnyű építő-megoldás |
| **Presto Player** | 🟠 Elavult | Mai videós igényekre korlátozott | Modern videó-beágyazás |
| **Quiz Maker** | 🟠 Elavult | Nehézkesen kezelhető | Könnyebben kezelhető kvíz-megoldás |
| **wpDiscuz** | 🟠 Elavult | Korszerűbb hozzászólás/chat-megoldások vannak | Modern megoldás (ha kell egyáltalán) |
| **Plugin Organizer** | 🟠 Elavult | Régi optimalizáló logika | Korszerű teljesítmény-megoldás |
| **UpdraftPlus** | 🟢 Cserélhető | Megbízhatóbb mentés-megoldás elérhető | Korszerű, ütemezett backup |
| **Akismet Anti-Spam** | 🟢 Súlytalan | Mai űrlapokra már nem hatékony | Modern captcha / spam-szűrés |

🔴 = blokkoló / megszűnt · 🟠 = elavult, cserélendő · 🟢 = működik, de jobb alternatíva van

### 5.4 Miért zsákutca a „csak frissítsük fel"?

Logikus kérdés: ha minden elavult, miért nem nyomjuk meg egyszerűen a „Frissítés" gombot? Két okból:

1. **Reális a végzetes hiba (fatal error).** Egy lépésben négy évnyi változást ráengedni az oldalra — WooCommerce 6.5 → 10, Elementor 3 → 4, plusz a PHP-ugrás — azt jelenti, hogy egyszerre több tucat „töréspont" (breaking change) zúdul rá. Ezek egy része megáll egy fehér képernyős hibánál, és innen a hibakeresés bizonytalan időigényű kézi munka — gyakran hosszabb és drágább, mint tiszta lapról építeni.

2. **Még ha le is fut, elavult marad.** Tegyük fel, hogy a frissítés valahogy átmegy. Akkor is ott marad alatta a **régi Elementor-konténer**, a köré épült logika, a leváltandó pluginek köré huzalozott működés. Vagyis a technikai adósságot nem törlesztettük, csak elhalasztottuk — fél-egy év múlva ugyanitt tartunk, újra fizetve a foltozgatásért.

> **Analógia:** felújíthatjuk a motort egy autóban, de ha az alváz és a karosszéria elkorrodált, akkor sem lesz belőle megbízható, biztonságos kocsi. Az ostinato.hu „alváza" — az alaparchitektúra — az, ami megújításra szorul.

---

## 6. A három lehetséges út

> **Három valódi opció van. A javasolt út (C) konkrét árát alább megadom; a másik kettőt összehasonlításként, a következményeikkel együtt teszem mellé, hogy lásd, mit mivel veszel.**

| Szempont | **A) Élesítés most** | **B) Frissítés helyben** | **C) Újraépítés korszerű alapokon** |
|---|:---:|:---:|:---:|
| Biztonság | ❌ | ⚠️ | ✅ |
| Sebesség | ❌ | ⚠️ | ✅ |
| Stabilitás (fatal error kockázat) | ⚠️ | ❌ | ✅ |
| Működő fizetés | ❌ | ⚠️ | ✅ |
| GDPR / Consent megfelelés | ❌ | ⚠️ | ✅ |
| Hirdethetőség | ❌ | ⚠️ | ✅ |
| Bővíthetőség (jövőbeli fejlesztések) | ❌ | ❌ | ✅ |
| Admin-kezelhetőség (Kata maga tudja) | ⚠️ | ⚠️ | ✅ |
| Hosszú távú költség | 🔴 Rejtett, ismétlődő | 🔴 Magas | 🟢 Alacsony |

✅ = megfelelő · ⚠️ = részleges / kockázatos · ❌ = nem megfelelő

### A) Élesítés a jelenlegi állapotban — *nem javasolt*
Gyors lenne, de érdemben nem üzemképes: nincs működő fizetés, a sütikezelés nem jogtiszta, a tartalom helykitöltő, és biztonságilag is sebezhető. Élesen ez nem segítené, hanem inkább rontaná Kata megítélését.

### B) Frissítés helyben (patch & launch) — *részmegoldás, hosszabb távon drágább*
Megpróbálnánk a meglévőt frissíteni és összefoltozni. A kimenet bizonytalan: reális a végzetes hiba, és a hibakeresés időigénye nehezen tervezhető. Ráadásul siker esetén is elavult architektúra és technikai adósság marad — ez a „most olcsóbbnak tűnik, később többe kerül" forgatókönyv.

### C) Újraépítés korszerű alapokon — *javasolt*
Tiszta, modern alapokra helyezzük az oldalt, megtartva mindent, ami értékes (márka, koncepció, a már megtervezett modern arculat):

- friss WordPress + **PHP 8.x**;
- aktuális **WooCommerce + Memberships**, már a gyors HPOS-adatmodellen;
- **Stripe** fizetés (működő vásárlás);
- **Consent Mode-kompatibilis** sütikezelés (jogtiszta + hirdethető);
- korszerű, gyors oldalépítő-konténer a régi helyett;
- **saját, finomhangolt cache** a NitroPack helyett;
- **hivatalos prémium plugin-licenszek** a lejárt HelloPack helyett (ezt biztosítom);
- korszerű, könnyen karbantartható **kurzus- és tagsági felület**;
- valódi tartalom, képek, kurzusok.

Az eredmény: gyors, biztonságos, hirdethető, bővíthető és Kata által is könnyen kezelhető oldal — olyan, amit valóban érdemes élesíteni.

> 💰 **A C út díja: 200 000 Ft** — 20 munkaóra × 10 000 Ft/óra. Egyszeri tétel, a részletes ütemtervvel együtt.

---

## 7. Mit nyersz az újraépítéssel? — az üzleti érték

> **Ez nem öncélú technika. Minden műszaki döntésnek van egy üzleti megfelelője.**

| Műszaki előny | Amit Kata ebből lát |
|---|---|
| Gyorsabb oldal | Jobb élmény → magasabb vásárlási arány, jobb Google-helyezés |
| Működő Stripe-fizetés | Tényleg lehet vásárolni → **valódi bevétel** |
| Consent Mode-megfelelés | **Jogtisztán hirdethető** → biztonságos hirdetési növekedés |
| Egyszerű admin | Kata **maga is fel tud tölteni** kurzust, módosítani szöveget |
| Modern dizájn | Profi, bizalomkeltő megjelenés → erősebb márka |
| Karbantartható alap | Az új funkciók **gyorsan és olcsón** ráépíthetők |
---

## 8. Miért kerül ez kicsit többe?

> **Őszintén: mert ez nem ugyanaz a munka, mint amiről eredetileg szó volt.**

Az eredeti elképzelés egy „kész oldal kiélesítése" volt — az pár napos rutinfeladat lenne. A valóság viszont az, hogy a négy év alatt megváltozott környezet miatt ez mostanra **három feladat egyben**:

1. **Korszerű alapra helyezés** — friss, biztonságos, gyors technikai környezet.
2. **A kritikus rendszerek újrahuzalozása** — fizetés (Stripe), tagság, kurzusfelület, sütikezelés.
3. **A tartalom befejezése** — valódi szövegek, képek, kurzusok.

Ez a többletköltség **egyszeri befektetés** egy 4–5 évre előre stabil, hirdethető és bővíthető rendszerbe. A másik oldalon a „spóroljunk és foltozzunk" út áll, ami rövid távon olcsóbbnak tűnik, de jó eséllyel fél éven belül újabb — és ismétlődő — kiadást jelent. **Egyszer, jól megépíteni mindig olcsóbb, mint kétszer, félig.**

**A javasolt újraépítés díja:**

| Tétel | Mennyiség | Óradíj | Összeg |
|---|---|---|---|
| Korszerű alap + fizetés/tagság/kurzus újrahuzalozás + tartalom befejezése | 20 munkaóra | 10 000 Ft | 200 000 Ft |
| **Mindösszesen** | | | **200 000 Ft** |

> Ez **egyszeri** tétel — szemben a „foltozzunk" úttal, ami jó eséllyel fél éven belül újabb, ismétlődő kiadást jelent. A pontos ütemtervet a megrendelés után egyeztetjük.

---

## 9. Javasolt következő lépések

1. **Részletes technikai feltárás** — a tárhely- és szerverkörnyezet teljes feltérképezése, és a pontos újraépítési/migrációs lista összeállítása.
2. **Közös döntés** — átbeszéljük a három utat, és kiválasztjuk a Katának megfelelőt (a javaslatom a **C**).
3. **Indulás** — a döntés után rögzítjük az ütemtervet, és megkezdjük a munkát a **C** út szerint (20 munkaóra, 200 000 Ft).

> **Egy mondatban:** az ostinato.hu jó koncepció erős alapokkal — most az a feladat, hogy a technika is felzárkózzon hozzá, hogy végre élesen, magabiztosan működhessen.

---

## 10. Függelék — fogalomtár

- **Fatal error (végzetes hiba):** olyan programhiba, amitől az oldal teljesen leáll (fehér képernyő). Frissítéskor a leggyakoribb buktató.
- **PHP:** a szerveroldali „nyelv", amin a WordPress fut. A régi PHP-verziók már nem kapnak biztonsági frissítést, és sok modern bővítmény nem fut rajtuk.
- **Consent Mode (Google):** a sütik/hirdetési hozzájárulás 2024 óta kötelező, szabványos kezelési módja. Enélkül nem lehet jogtisztán hirdetni.
- **HPOS (High-Performance Order Storage):** a WooCommerce új, gyorsabb rendelés-adattárolása, ami a mai verziók alapértelmezése.
- **Flexbox/grid konténer (Elementor):** a modern, gyorsabb és rugalmasabb elrendezési mód, ami leváltotta a régi „display block" felépítést.
- **Technikai adósság:** a halasztott frissítések/elavult megoldások „kamatos" költsége — minél tovább halogatjuk, annál drágább behozni.
- **Stripe:** vezető, megbízható online fizetési szolgáltató; a megszűnt Paylike korszerű utódja.

---

*Forrás: az ostinato.hu rendszerjelzései és a telepített bővítmények listája, 2026. június 10.*
