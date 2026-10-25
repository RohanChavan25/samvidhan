# Samvidhan: the Constitution of India, for every student

A free, fact-checked learning website about how India's Constitution was made, what the Preamble promises, our Fundamental Rights and the people behind them.

- **Three age levels**, chosen on the first screen: Below 10 (picture stories and a picture quiz), 10 to 14 (the full illustrated course) and 14 and above (everything, plus big ideas, questions to think about and where sources disagree).
- **English and हिंदी**, switched with one button. Numbers, dates and direct quotes are identical in both.
- **Works on phone, tablet and laptop.** No app, no login, no internet needed once the files are on your device (fonts load from Google if online).
- **Every fact names its source**: the Constituent Assembly Debates, the official text of the Constitution, Lok Sabha, PIB and other official records. Secondary sources are marked.

---

## 1. Open it on your own computer (no setup)

1. Download this repository: green **Code** button → **Download ZIP**.
2. Unzip it.
3. Double-click **`index.html`**. It opens in your browser.

That is all. It works offline because every file it needs is in the folder.

On a phone, copy the unzipped folder to the phone and open `index.html` in Chrome, or use the web link from step 2 below, which is easier.

## 2. Put it on the internet for free with GitHub Pages

1. Sign in at [github.com](https://github.com) (create a free account if needed).
2. Click **+** (top right) → **New repository**. Name it, for example, `samvidhan`. Choose **Public**. Click **Create repository**.
3. On the new repository page click **uploading an existing file**. Drag in **everything inside** the unzipped folder (the files *and* the folders `art`, `face`, `pic`, `scene`, `scene-s`, `data`, `tools`, `docs`). Click **Commit changes**.
   GitHub's web upload accepts up to 100 files at a time. If it complains, upload the folders in two or three rounds.
4. Go to **Settings** → **Pages**. Under *Build and deployment*, set **Source: Deploy from a branch**, **Branch: main**, folder **/ (root)**. Click **Save**.
5. Wait one or two minutes and refresh the Pages screen. It shows your link, like
   `https://your-username.github.io/samvidhan/`
6. Open that link on any phone, tablet or laptop and share it with students.

To update the site later, upload the changed files again (same names). The link stays the same.

## 3. Change or add content

All words live in two files. Never edit `data.js` or `i18n.js` by hand: they are generated.

| What | Where |
|---|---|
| All content (English, the master) | `data/db.json` |
| Hindi for every line, and button text | `data/db_hi.json` |

After editing, rebuild (needs [Python 3](https://www.python.org/downloads/)):

```
python tools/build.py
```

It regenerates `data.js` and `i18n.js`, checks that every picture exists and that every Hindi line keeps the English numbers. "Problems: 0" means it is ready to upload.

If you change an English line, its Hindi stops matching and the site shows English for that line until you add the new Hindi in `data/db_hi.json`. Nothing wrong is ever shown.

Rules we follow for content:
1. Every fact carries a source key (`src`) that points to `sources` in `db.json`.
2. A fact with only secondary sources is marked; a claim we could not confirm goes in `onHold`, not on the page.
3. Text for under-10s only restates facts already in the database, and carries the same source.

## 4. What is in the folder

```
index.html     the page (layout and styles)
data.js        content, generated from data/db.json
i18n.js        Hindi, generated from data/db_hi.json
app.js         chapters, timelines, cards, profiles, practice
story.js       the book opening, page turns, picture reels
levels.js      the age chooser and the three levels
animals.js     Mithu the parrot and friends: pop-ups, parades, cheers
art/ face/ pic/ scene/ scene-s/   the illustrations
data/          the database (English and Hindi)
tools/         build.py and the language logic it packs
docs/          how it was built, the fact review, Hindi review sheet, picture list
```

## 5. Good to know

- The site remembers the language, age group and quiz scores **on each device** (browser storage). Nothing is sent anywhere.
- Animations switch off automatically if the device is set to "reduce motion".
- The Hindi follows the official Hindi text of the Constitution (उद्देशिका, समता, बंधुता …). A native-speaker review sheet is in `docs/Hindi_Review.csv`.
