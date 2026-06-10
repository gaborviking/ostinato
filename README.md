# ostinato

Az **ostinato.hu** (Ördög Kata online zongoraiskolája) állapotfelmérése és újraépítési javaslata, valamint a kapcsolódó anyagok.

## Tartalom

| Fájl | Mi ez |
|---|---|
| [`ostinato-allapotfelmeres.html`](ostinato-allapotfelmeres.html) | Designolt, böngészőben prezentálható ügyfél-anyag (PDF-be nyomtatható) |
| [`ostinato-allapotfelmeres-es-javaslat.md`](ostinato-allapotfelmeres-es-javaslat.md) | Ugyanaz a tartalom Markdownban (forrás) |
| `ostinato-allapotfelmeres-es-javaslat.docx` | Word-változat az oldal arculatával |
| `build-docx.js` | A `.docx`-et generáló szkript (`node build-docx.js`) |
| `index.html` | Modern facelift prototípus az oldalhoz |
| `server.js` | Egyszerű statikus szerver az előnézethez (port 8731) |

## Előnézet

```bash
node server.js
# majd: http://localhost:8731/ostinato-allapotfelmeres.html
```

## Word generálása

```bash
npm install docx
node build-docx.js
```
