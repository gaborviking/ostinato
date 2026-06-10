# ostinato

Az **ostinato.hu** (Ördög Kata online zongoraiskolája) állapotfelmérése és újraépítési javaslata, valamint a kapcsolódó anyagok.

🔗 **Élő prezentáció:** https://gaborviking.github.io/ostinato/

## Tartalom

| Fájl | Mi ez |
|---|---|
| [`index.html`](index.html) | A designolt ügyfél-prezentáció — ez a kezdőlap (PDF-be nyomtatható) |
| [`ostinato-allapotfelmeres-es-javaslat.md`](ostinato-allapotfelmeres-es-javaslat.md) | Ugyanaz a tartalom Markdownban (forrás) |
| `ostinato-allapotfelmeres-es-javaslat.docx` | Word-változat az oldal arculatával |
| `build-docx.js` | A `.docx`-et generáló szkript (`node build-docx.js`) |
| [`prototipus.html`](prototipus.html) | Modern facelift prototípus az oldalhoz |
| `server.js` | Egyszerű statikus szerver az előnézethez (port 8731) |

## Előnézet

```bash
node server.js
# majd: http://localhost:8731/
```

## Word generálása

```bash
npm install docx
node build-docx.js
```
