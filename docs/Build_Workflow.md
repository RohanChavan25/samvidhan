# Build workflow: Critical Minerals method → Constitution module

## Where this comes from
I reconstructed this from the published repo `rohanchavan25/Critical-Minerals-Platform`. That covers its 3 files, the rules written into the file headers, the data structure and the commit history of 13–17 June 2026.

**Not recovered:** any separate instruction sheet you wrote in the Critical Minerals chats. Those chats sit outside the Apni Shala Project, and chat search here only covers this Project. If that sheet exists, paste or attach it and I'll merge it in.

---

## 1. The architecture (what made Critical Minerals easy to update)

| File | Rule (from its header) | Size |
|---|---|---|
| `data.js` | "No HTML. No CSS. No JS logic. Content only." One object, `DB`. | 416 KB |
| `app.js` | "No content here. Reads from DB. Renders to DOM. Content change = edit data.js only." | 101 KB |
| `index.html` | Shell only: styles, header, tab bar, loads `data.js` then `app.js`. | 32 KB |

Verified: `data.js` contains zero HTML tags, so the rule was actually followed.

### Data conventions worth copying
- **Every visible string is bilingual:** `{ en: '…', mr: '…' }`, read by one helper, `t(obj)`. For us this becomes `{ en, hi }`.
- **Source registry:** `DB.sources.<key> = { title, url, year }`. Content cites keys, never raw URLs, and the app renders them as links.
- **UI labels live in data too** (`DB.ui`): button text, "Sources", "Did you know". Switching language never touches `app.js`.
- **Fact vs inference is tagged:** `factBox`, `implBox` and `inferenceBox` ("[Our inference]"). For a quiz this matters even more: a student must know which lines are checked facts.
- **Trivia items carry their own source key** (`{ en, mr, src }`).
- **Numbered tabs** (`01 · The Basics` … `09 · The Next Decade`) defined as data.
- **Language choice persists** in `localStorage` (`cmLang`).

### App patterns worth reusing
Tab router · language toggle · entry modal · "Did you know" rotator · filterable card grid with a detail panel (minerals) · source links under each section.

### Do NOT carry over
- **The live news panel.** `fetchNews()` calls `api.anthropic.com` straight from the browser with no API key. On GitHub Pages it can't authenticate, so that panel cannot work as published. It would also put unchecked text in front of students, which breaks the accuracy rule.
- **Three Google Font families** (DM Serif, DM Sans, IBM Plex Mono, plus Noto Devanagari). That is extra data on a prepaid phone. Use one family with Devanagari support, or system fonts.

---

## 2. Adapted design for the Constitution module

```
index.html   shell + styles (phone-first, light, one font)
app.js       renderer + quiz/flashcard engine + progress (localStorage)
data.js      DB = { meta, ui, sources, modules: [...] }
```

Each module in `data.js`:
```js
{
  id: 'm2-preamble', n: 2, verified: true,          // public build shows verified modules only
  title: { en, hi },
  learn:   [ { title:{en,hi}, body:{en,hi}, example:{en,hi}, src:['key'] } ],
  timeline:[ { date, title:{en,hi}, line:{en,hi}, src:['key'] } ],
  people:  [ { name:{en,hi}, fields:{ born, died, … quizClue }, src:['key'] } ],
  quiz:    [ { q:{en,hi}, options:[…], answer, why:{en,hi}, src:['key'] } ],
  traps:   [ { en, hi } ],        // "Preamble says 26 Nov 1949, not 26 Jan 1950"
  leftOut: [ { en, hi } ]         // unconfirmed claims, shown to teachers only
}
```
Every student screen follows the same loop: **Learn → 5-question recall → flashcards**, plus a "mixed revision" mode that pulls questions from all earlier modules (spaced recall).

Quiz terms stay in English even in Hindi mode (Preamble, Fundamental Rights, Article 32), with the Hindi beside them, because the quiz is most likely in English (not confirmed).

---

## 3. Workflow for every new module (5 → 9)
1. **Research and verify in the quiz-prep chat**, with primary sources first (Assembly debates, Constitution text, Lok/Rajya Sabha, member pages). Wikipedia is used only to find leads.
2. **Add one module block to `data.js`.** Nothing else changes. Set `verified: false`.
3. **Run the checker script** (to be built with v1). It fails if any item lacks `src`, any `en` lacks `hi`, any source key doesn't exist, any string contains HTML, or a quiz answer isn't among its options.
4. **Preview at phone width** (≈380 px) on a slow connection.
5. **You review**, then flip `verified: true`.
6. **Commit and push** to GitHub Pages, like Critical Minerals: one commit per change, dated message.

---

## 4. Open decisions before v1
- **Repo:** a new repo (e.g. `ReclaimConstitution-Prep`) or a folder in an existing one?
- **Images:** the 42 PNG cards are about 200 KB each, which is about 8.5 MB if loaded. Recommendation: text-first, with images behind a "show card" tap.
- **Hindi for Modules 3–4:** the story posters have Hindi titles only, and the profiles are English only. Full Hindi bodies are new translation work, and every line becomes a new error surface. Suggest Hindi for learn cards and quiz questions first, then profiles.

## Language layer (English + Hindi), added v5
- `db/db_hi.json` is the Hindi database: `strings` maps each English display string in db.json to Hindi; `ui` holds button and label text. English stays the master.
- `site/i18n.js` (generated by `db/builder/build_i18n.py`) loads after data.js. If the viewer chose Hindi, it swaps every translated string in DB before the app renders; anything untranslated falls back to English.
- The हिंदी / English button sits in every header and on the opening book. The choice is saved per device.
- When an English string in db.json changes, its Hindi stops matching and the site shows English for that line until the Hindi is updated. Re-run `hi/check.py` to catch missing translations and any number or quote that did not carry over.
- Conventions: same digits and dates as English; direct quotes stay in English with Hindi meaning in brackets; quiz key terms keep the English word in brackets; constitutional terms follow the official Hindi text.

## Age levels (v6)
- `db.json` now has `levels` (the three age groups and what each gets), `kids` (picture stories per chapter for under 10, each with a picture, one or two lines, its source and an optional three-choice question) and `deep` (14+ "Big ideas" and "Think deeper" questions per chapter). Records can carry `lv: 3` to show only at 14+.
- `site/levels.js` loads last. It shows the age chooser on the first visit, swaps in the picture-story chapters and picture quiz for under 10, and adds Big ideas, Think deeper, "Where sources disagree" and "Not confirmed yet" for 14+. The 10 to 14 view is the full illustrated course.
- New kid text must only restate facts already in the database, and carry the source of the record it comes from (`ref`).
