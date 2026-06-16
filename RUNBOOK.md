# Natalia's Psicotécnico App — Runbook

Quick-reference for **Cálculo Rápido**, the math/psicotécnico practice app for Natalia.
*Last verified: 2026-06-16.*

## What it is
- A single self-contained file: **`index.html`** (HTML + CSS + JS, no build, no dependencies).
- Generates random psicotécnico questions by family (porcentajes, fracciones, regla de 3, áreas, ofertas, comisiones, monedas, enteros, edades, media, …), times the answers, tracks streaks/records, and has a "chuleta de trucos" cheat-sheet.
- Source questions come from **FormaApp** ("tropa") screenshots Gerry sends over WhatsApp.

## Where it lives
| Thing | Location |
|-------|----------|
| Local repo | `/Users/gerry/calculo-rapido` |
| Source of truth | `index.html` (one file) |
| GitHub remote | `https://github.com/cambridgekids/calculo-rapido` (branch `main`) |
| **Live URL** | **https://cambridgekids.github.io/calculo-rapido/** (GitHub Pages, auto-deploys on push to `main`) |
| Validator | `validate.js` (`node validate.js`) |

## Standing workflow (the loop)
1. **Gerry** edits the app on the **desktop Claude app**, then **downloads** the result to `~/Downloads/calculo-rapido.html`.
2. **Claude Code** takes that file, drops it into the repo, validates, commits, and pushes — GitHub Pages then serves it live within ~1 min.

Deploy command (Claude Code runs this):
```bash
cp ~/Downloads/calculo-rapido.html ~/calculo-rapido/index.html
cd ~/calculo-rapido && node validate.js \
  && git add index.html && git commit -m "Update exercises" && git push origin main
```
> ⚠️ The Downloads file is named `calculo-rapido.html`; in the repo it must be `index.html` (GitHub Pages serves `index.html`).

## Adding new exercise types (from WhatsApp images)
Each exercise is **one generator function** returning an object. Steps:

1. **Read the screenshot**, work out the formula, and write a generator:
   ```js
   function gMiTipo(d){            // d = difficulty 1|2|3
     const x = R(2,9);            // R(a,b) = random int, pick(arr) = random element
     return { q:`Enunciado con ${fmt(x)} …?`, a: x*2, fam:'mi familia' };
   }
   ```
   - `fmt(n)` formats Spanish style (`1.234,5`). Answers are graded with a ±0.01 tolerance.
   - **Fraction answer** → add `frac:true` and `sol:'1/9'` (e.g. "parte del trabajo"). Accepts `1/9` or the decimal.
   - **Text answer** (e.g. a month) → add `expectText:true`.
2. **Register it** in three places near the bottom of the `<script>`:
   - `FAMILIES{}` — as its own chip, or fold into an existing family's `pick([...])`.
   - `POOL[]` — so it appears in "Todas / Mixta".
   - `TRICKS{}` — the one-line hint shown after answering (keyed by `fam`).
3. Add a matching `<h3>…</h3>` block in the **chuleta modal** (`id="modal"`).
4. **Validate**: `node validate.js` (runs 40 000 questions, flags NaN / `undefined` / bad fractions).

> Generators must always produce a **single, exactly-computable answer**. Pure diagram / multiple-choice items (e.g. "which figure has the smallest area") don't fit this typed-answer app — skip them.

## History
- **2026-06-15** — App created; first families. Hosted on GitHub Pages.
- **2026-06-16** — Added 12 types from FormaApp images: ofertas (3x2), comisiones (fija + %), cambio de monedas encadenado, % que falta por ahorrar, enteros con signo, operaciones con un número, ritmo relativo, parte del trabajo (fracción), suma/resta de fracciones, pesos fraccionados, edades, media aritmética. Added `validate.js` + this runbook.
