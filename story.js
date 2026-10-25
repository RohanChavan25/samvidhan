// SAMVIDHAN QUIZ PREP — STORY LAYER v2
// Hand-drawn cover, illuminated front page, page turns, Constitution Hall doors, glimpse reels, life windows.
// Pictures are illustrations only; every word on screen comes from DB.

const RM = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const SCN = new Set(DB.scenesAvailable || []);
const sceneOf = f => (f.scene && SCN.has(f.scene)) ? `scene/${f.scene}.webp` : null;

// ── hand-drawn cover (after the original: black leather, embossed gold, an Ajanta-style lotus) ──
function petals(n, r1, r2, w, fill, stroke, rot = 0) {
  let out = '';
  for (let k = 0; k < n; k++) {
    const a = rot + k * 360 / n;
    out += `<path d="M0 ${-r1} C ${w} ${-(r1 + r2) / 2}, ${w * .55} ${-r2 + 4}, 0 ${-r2} C ${-w * .55} ${-r2 + 4}, ${-w} ${-(r1 + r2) / 2}, 0 ${-r1}Z" transform="rotate(${a})" fill="${fill}" stroke="${stroke}" stroke-width="1.1"/>`;
  }
  return out;
}
function coverSVG() {
  const B = DB.book.cover;
  const corner = `<g class="cn">${petals(5, 3, 20, 7, 'url(#sf)', 'url(#gd)', -72)}<circle r="4" fill="url(#gd)"/></g>`;
  return `<svg class="cv-svg" viewBox="0 0 300 400" role="img" aria-label="${esc(B.title)}, ${esc(B.hi)}">
  <defs>
    <linearGradient id="gd" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F8E29A"/><stop offset=".45" stop-color="#D4A23C"/><stop offset=".7" stop-color="#F3D27A"/><stop offset="1" stop-color="#B98326"/></linearGradient>
    <linearGradient id="sf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6A15C"/><stop offset="1" stop-color="#C9581A"/></linearGradient>
    <linearGradient id="lf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4FA04A"/><stop offset="1" stop-color="#11690A"/></linearGradient>
    <radialGradient id="lt" cx=".45" cy=".35" r=".9"><stop offset="0" stop-color="#2A2F42"/><stop offset=".7" stop-color="#171A26"/><stop offset="1" stop-color="#0D0F17"/></radialGradient>
    <filter id="hand" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="4"/><feDisplacementMap in="SourceGraphic" scale="2.4"/></filter>
    <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="9"/><feColorMatrix values="0 0 0 0 .6  0 0 0 0 .55  0 0 0 0 .5  0 0 0 .09 0"/></filter>
  </defs>
  <rect width="300" height="400" rx="10" fill="url(#lt)"/>
  <rect width="300" height="400" rx="10" filter="url(#grain)"/>
  <rect x="2" y="2" width="12" height="396" rx="6" fill="#0B0D14" opacity=".55"/>
  <g filter="url(#hand)" fill="none" stroke="url(#gd)">
    <rect x="18" y="16" width="266" height="368" rx="6" stroke-width="2.6"/>
    <rect x="26" y="24" width="250" height="352" rx="4" stroke-width="1"/>
    <rect x="31" y="29" width="240" height="342" rx="3" stroke-width="1.2" stroke-dasharray="1 5" stroke-linecap="round"/>
  </g>
  <g filter="url(#hand)">
    <g transform="translate(30 28)">${corner}</g><g transform="translate(272 28) scale(-1 1)">${corner}</g>
    <g transform="translate(30 372) scale(1 -1)">${corner}</g><g transform="translate(272 372) scale(-1 -1)">${corner}</g>
    <text x="150" y="76" text-anchor="middle" class="cv-t1">CONSTITUTION</text>
    <text x="150" y="98" text-anchor="middle" class="cv-t2">OF INDIA</text>
    <g transform="translate(150 200)">
      <path d="M-74 46 C -60 18, -34 6, -10 26 C -30 34, -54 44, -74 46Z" fill="url(#lf)" stroke="url(#gd)" stroke-width="1"/>
      <path d="M74 46 C 60 18, 34 6, 10 26 C 30 34, 54 44, 74 46Z" fill="url(#lf)" stroke="url(#gd)" stroke-width="1"/>
      <circle r="62" fill="none" stroke="url(#gd)" stroke-width="2.2"/>
      <circle r="56" fill="none" stroke="url(#gd)" stroke-width=".9" stroke-dasharray="2 4"/>
      ${petals(16, 16, 50, 9, 'url(#sf)', 'url(#gd)', 11.25)}
      ${petals(8, 12, 36, 10, '#FBF1D8', 'url(#gd)')}
      <circle r="13" fill="url(#gd)"/><circle r="8.5" fill="#E8792B" stroke="#F8E29A" stroke-width=".8"/>
      ${Array.from({ length: 10 }, (_, k) => `<circle cx="${(10.5 * Math.cos(k * .628)).toFixed(1)}" cy="${(10.5 * Math.sin(k * .628)).toFixed(1)}" r="1.2" fill="#FBF1D8"/>`).join('')}
    </g>
    <text x="150" y="304" text-anchor="middle" class="cv-hi" lang="hi">${esc(B.hi)}</text>
    <path d="M70 324 H230" stroke="url(#gd)" stroke-width="1"/>
    <g transform="translate(150 324)">${petals(6, 2, 9, 4, 'url(#gd)', 'none', 0)}</g>
  </g>
</svg>`;
}

// ── 1. The opening book ──
window.showOpening = function () {
  const L = DB.opening.lenses, B = DB.book, N = L.length;
  const run = `<span class="runhead">${esc(B.cover.title)}</span>`;
  const note = srcs => { const h = srcLine(srcs); return h ? `<div class="pg-notes">${h}</div>` : ''; };
  // frontispiece: title page; the note about the cover drawing sits at its foot, like a printer's note
  const front = `<div class="leaf page frontis" style="z-index:${N + 2}"><img class="fr-art" src="${esc(B.frontis)}" alt="">
      <div class="fr-in"><span lang="hi" class="fr-hi">${esc(B.cover.hi)}</span><b>${esc(B.cover.title)}</b><small>${esc(B.cover.sub)}</small><span class="fr-tap">${T('Tap to turn the page')}</span>
      <a class="fr-note" href="${esc(B.coverSrc)}" target="_blank" rel="noopener">${esc(B.coverNote)}</a></div></div>`;
  // story pages: running head, picture, heading, text in a reading size; sources as footnotes at the foot; page number
  const pages = L.map((l, i) => `<div class="leaf page" style="z-index:${N - i + 1}"><div class="pg">${run}
      <figure class="pg-fig"><img src="${esc(l.art)}" alt=""></figure>
      ${l.label ? `<h2>${esc(l.label)}</h2>` : ''}<p class="pg-body${l.label ? '' : ' big'}">${esc(l.body)}</p>
      ${note(l.src)}<span class="folio">${i + 1}</span></div></div>`).join('');
  const contents = `<div class="leaf page last" style="z-index:1"><div class="pg toc-pg">${run}
      <h2 class="toc-h">${T('Contents')}</h2>
      <ol class="toc">${DB.modules.map((m, i) => `<li><button data-chapter="${m.id}"><span class="toc-n">${i + 1}</span><span class="toc-t"><b>${esc(m.title)}</b>${hiTxt(m.hi)}</span></button></li>`).join('')}</ol>
      <span class="folio">${N + 1}</span></div></div>`;
  $('#open').innerHTML = `<div class="stage">
    <div class="book closed" id="book"><div class="leftpage" aria-hidden="true"><img alt=""></div><div class="leaf cover" style="z-index:${N + 3}">${coverSVG()}</div>${front}${pages}${contents}</div>
    <div class="bookctl"><button class="btn s" data-turn>${T('Open the book')}</button><button class="btn ghost" data-skipbook>${T('Skip to contents')}</button>${langBtn()}</div></div>`;
  $('#open').hidden = false; book.i = 0;
};
const book = { i: 0, x: null };
function setTurnBtn(leaves) {
  const b = $('[data-turn]'), k = $('[data-skipbook]'); if (!b) return;
  const last = book.i >= leaves.length - 1;
  b.textContent = T(last ? 'Start learning' : book.i === 0 ? 'Open the book' : 'Turn the page →');
  if (last) { b.dataset.done = '1'; if (k) k.hidden = true; }
}
// On wide screens the open book shows two pages: the picture on the left page, the words on the right.
function syncSpread() {
  const b = document.getElementById('book'); if (!b) return;
  const L = DB.opening.lenses, i = book.i, img = b.querySelector('.leftpage img');
  b.classList.toggle('closed', i === 0);
  const src = i === 1 ? DB.book.frontis : i >= 2 && i < L.length + 2 ? L[i - 2].art : 'scene/book-2.webp';
  if (img && img.getAttribute('src') !== src) img.src = src;
  b.querySelector('.leftpage').classList.toggle('endpaper', i === 1);
}
function turnPage() {
  const leaves = [...document.querySelectorAll('#book .leaf')];
  if (book.i >= leaves.length - 1) return;
  leaves[book.i].classList.add('turned'); book.i++; setTurnBtn(leaves); syncSpread();
}
function skipBook() { const leaves = [...document.querySelectorAll('#book .leaf')]; leaves.slice(0, -1).forEach(l => l.classList.add('turned')); book.i = leaves.length - 1; setTurnBtn(leaves); syncSpread(); }
function goChapter(id) { enter(); location.hash = id; }

// ── 2. Home = the contents page ──
window.viewHome = function () {
  const days = Math.max(0, Math.ceil((PRELIM - new Date()) / 864e5));
  const prog = store.get('prog', {}), misses = store.get('misses', []);
  return `${LANG === 'hi' ? header('विषय-सूची', 'Contents', false) : header('Contents', 'विषय-सूची', false)}<main class="wrap">
    <section class="panel count"><b>${days}</b><span>${T('days to the prelim')}<br>${T('26 November · 11:00 am, online')}</span><button class="btn ghost" data-facts style="margin-left:auto">${T('Open the book')}</button></section>
    <div class="cta"><a class="btn s" href="#practice-m8">${T('Mixed practice · 10 questions')}</a>${misses.length ? `<a class="btn ghost" href="#practice-misses">${T('Revise my misses')} (${misses.length})</a>` : ''}<a class="btn ghost" href="#cards">${T('Who am I? cards')}</a></div>
    <nav class="chapters">${DB.modules.map((m, i) => { const p = prog[m.id];
      return `<a class="panel chap" href="#${m.id}"><img class="blot" src="${esc(DB.book.chapterArt[m.id])}" alt="" loading="lazy"><span class="chap-t"><small>${T('Chapter')} ${i + 1}</small><strong>${esc(m.title)}</strong>${hiTxt(m.hi)}<em>${esc(m.span)}</em></span><span class="score${p ? '' : ' no'}">${p ? `${T('Best')} ${p.best}/${p.of}` : T('Not tried')}</span></a>`; }).join('')}</nav>
    <p class="foot">${T('For students of every age. Every fact is checked against the Constituent Assembly Debates, the Constitution’s text or official records, and names its source.')} ${LANG === 'hi' ? T('Hindi translation: names of books, direct quotes and quiz key terms stay in English, with the Hindi meaning in brackets. Numbers and dates are the same in both languages.') + ' ' : ''}Database v${esc(DB.meta.version)}.</p></main>`;
};

// ── 3. Preamble pages drawn natively (no pasted posters) ──
window.posterCard = function (c, notesTopic) {
  if (c.id === 'P02') {
    const L = c.lines.slice(3, -1), note = c.lines[c.lines.length - 1];
    const mark = s => esc(s).replace(/SOCIALIST SECULAR/, '<mark>SOCIALIST SECULAR</mark>').replace(/and integrity/, '<mark>and integrity</mark>').replace(/समाजवादी पंथनिरपेक्ष/, '<mark>समाजवादी पंथनिरपेक्ष</mark>').replace(/और अखंडता/, '<mark>और अखंडता</mark>');
    return `<article class="ms" id="P02"><div class="ms-in"><p class="eyebrow">${esc(c.title)} · <span lang="hi">${esc(c.hi)}</span></p>${L.map(l => `<p>${mark(l)}</p>`).join('')}<p class="ms-note"><mark>&nbsp;&nbsp;</mark> ${esc(note)}</p><p class="src"><b>${T('Source')}</b>${esc(c.srcText)}</p></div></article>`;
  }
  if (c.id === 'P16') {
    const L = c.lines.slice(3).filter(l => ![T('Supreme Court'), T('Change to the text')].includes(l)); const items = [];
    for (let k = 0; k < L.length - 1; k += 2) items.push(`<li class="${/Amendment|संशोधन/.test(L[k + 1]) ? 'chg' : ''}"><span class="date">${esc(L[k])}</span><p>${esc(L[k + 1])}</p></li>`);
    const extra = notesTopic ? `<div class="mithu"><p><b style="color:var(--navy-ink)">${esc(notesTopic.title)}</b></p><ul class="rows">${notesTopic.lines.map(l => `<li>${esc(l)}</li>`).join('')}</ul></div>${srcLine(notesTopic.src)}` : '';
    return `<article class="panel card${notesTopic && notesTopic.pic ? ' haspic' : ''}" id="P16">${notesTopic && notesTopic.pic ? `<img class="illus head" src="${esc(notesTopic.pic)}" alt="">` : ''}<h3>${esc(c.title)}</h3>${hiTxt(c.hi)}<ol class="mtl wide">${items.join('')}</ol>${c.srcText ? `<p class="src"><b>${T('Source')}</b>${esc(c.srcText)}</p>` : ''}${extra}</article>`;
  }
  return '';
};

// ── 4. Reels ("glimpses"), with Constitution Hall doors ──
const reels = {};
function frameHtml(f, k) {
  const sc = sceneOf(f);
  if (sc) return `<img class="kb k${k % 3}" src="${esc(sc)}" alt="">`;
  if (f.bubble) return `<img class="kb k${k % 3} sketch" src="scene/hall-debate.webp" alt=""><div class="bubble"><b>${esc(f.title)}</b><small>${esc(f.date)}</small></div>`;
  if (f.img) return `<img class="kb k${k % 3} sketch${f.fit === 'contain' ? ' contain' : ''}" src="${esc(f.img)}" alt="">`;
  return '';
}
function renderReel(id) {
  const r = DB.reels[id]; reels[id] = reels[id] || { i: 0, playing: false, t: null };
  const st = reels[id];
  const doors = id === 'hall' && !st.opened ? `<div class="doors" id="doors-${id}"><img class="hall-bg" src="scene/hall-first-day.webp" alt=""><div class="door l"></div><div class="door r"></div>
      <div class="doors-cap"><b>${T('Constitution Hall, New Delhi')}</b><span>${T('9 December 1946')}</span><button class="btn s" data-doors="${id}">${T('Push the doors open')}</button></div></div>` : '';
  return `<section class="reel" id="reel-${id}"><header><span class="chip">${T('Glimpses')}</span><h2 class="sec" style="margin:6px 0 0">${esc(r.title)}</h2>${hiTxt(r.hi)}<p class="lede">${esc(r.lede)}</p></header>
    <div class="viewer"><div class="screen">${doors}<div class="film" id="film-${id}"></div>
      <div class="bars">${r.frames.map((_, k) => `<button class="barx" data-reelgo="${id}:${k}" aria-label="Glimpse ${k + 1}"><i></i></button>`).join('')}</div>
      <div class="rctl"><button class="iconbtn" data-reelstep="${id}:-1" aria-label="Previous">‹</button><button class="iconbtn play" data-reelplay="${id}">${T('▶ Play')}</button><button class="iconbtn" data-reelstep="${id}:1" aria-label="Next">›</button></div></div>
    <div class="cap" id="cap-${id}"></div></div></section>`;
}
function showFrame(id) {
  const r = DB.reels[id], st = reels[id], f = r.frames[st.i]; const film = document.getElementById('film-' + id); if (!film) { clearInterval(st.t); return; }
  film.innerHTML = frameHtml(f, st.i);
  const topicMod = l => (DB.modules.find(m => m.sections.some(s => s.type === 'topics' && s.ref.includes(l))) || {}).id;
  const act = f.person ? `<button class="btn s" data-person="${f.person}">${LANG === 'hi' ? `${esc(P[f.person].name)} की जीवन-कथा खोलो` : `Open ${esc(P[f.person].name)}’s life story`}</button>`
    : f.link && EV[f.link] ? `<a class="btn ghost" href="#${EV_MOD[f.link]}" data-scroll="${f.link}">${T('Read it in the timeline')}</a>`
    : f.link && TO[f.link] && topicMod(f.link) ? `<a class="btn ghost" href="#${topicMod(f.link)}" data-scroll="${f.link}">${T('Read the full card')}</a>` : '';
  // If the frame's full story is already on this page (timeline or card), the caption only points to it.
  const here = (location.hash || '#home').slice(1), onPage = f.link && ((EV[f.link] && EV_MOD[f.link] === here) || (TO[f.link] && topicMod(f.link) === here));
  const jump = onPage ? `<a class="btn ghost" href="#${here}" data-scroll="${f.link}">${esc(f.title)} ↓</a>` : act;
  document.getElementById('cap-' + id).innerHTML = onPage
    ? `<div class="capin short"><div class="caprow">${f.date ? `<span class="date">${esc(f.date)}</span>` : '<span></span>'}<span class="count2">${st.i + 1} / ${r.frames.length}</span></div><div class="cta">${jump}</div></div>`
    : `<div class="capin"><div class="caprow">${f.date ? `<span class="date">${esc(f.date)}</span>` : '<span></span>'}<span class="count2">${st.i + 1} / ${r.frames.length}</span></div><h3>${esc(f.title)}</h3><p>${esc(f.text)}</p><div class="cta">${act}</div>${srcLine(f.src)}</div>`;
  document.querySelectorAll(`#reel-${id} .barx`).forEach((b, k) => { b.classList.toggle('done', k < st.i); b.classList.toggle('on', k === st.i); b.classList.toggle('run', k === st.i && st.playing); });
  const pb = document.querySelector(`[data-reelplay="${id}"]`); if (pb) pb.textContent = T(st.playing ? '❚❚ Pause' : '▶ Play');
}
function stepReel(id, d) { const st = reels[id], n = DB.reels[id].frames.length; st.i = (st.i + d + n) % n; showFrame(id); }
function playReel(id, on) {
  const st = reels[id]; st.playing = on ?? !st.playing; clearInterval(st.t);
  if (st.playing) st.t = setInterval(() => { if (!document.getElementById('film-' + id)) { clearInterval(st.t); return; } if (st.i >= DB.reels[id].frames.length - 1) { playReel(id, false); return; } stepReel(id, 1); }, 7000);
  showFrame(id);
}
function openDoors(id) {
  const d = document.getElementById('doors-' + id); reels[id].opened = true;
  if (!d) return; d.classList.add('open'); setTimeout(() => { d.remove(); if (!RM()) playReel(id, true); }, RM() ? 0 : 1300);
}
const _renderSection = window.renderSection;
window.renderSection = function (s) { return s.type === 'reel' ? renderReel(s.ref) : _renderSection(s); };

// ── 5. Life windows ──
const _openPerson = window.openPerson;
window.openPerson = function (id) {
  _openPerson(id);
  const p = P[id]; if (!p || p.kind !== 'profile') return;
  const ms = p.profile.milestones.map(m => { const k = m.match(/^([^:]{2,24}):\s(.*)$/); return k ? `<li><span class="date">${esc(k[1])}</span><p>${esc(k[2].charAt(0).toUpperCase() + k[2].slice(1))}</p></li>` : `<li><p>${esc(m)}</p></li>`; }).join('');
  const glimpse = DB.reels.freedom.frames.filter(f => f.person === id && sceneOf(f));
  const scene = glimpse.length ? `<figure class="life-scene"><img class="illus" src="${esc(sceneOf(glimpse[0]))}" alt="A scene from ${esc(glimpse[0].date)}"></figure>` : '';
  $('#sheet-body .sheet-head').insertAdjacentHTML('afterend', `<section class="life">${scene}<div class="life-in"><b>${T('Glimpses of a life')}</b><ol class="mtl">${ms}</ol></div></section>`);
  const mrow = [...document.querySelectorAll('#sheet-body .frow')].find(r => r.querySelector('b').textContent === T('Milestones before 1947')); if (mrow) mrow.remove();
};

// ── 6. page-turn between chapters ──
let lastHash = location.hash;
window.addEventListener('hashchange', () => {
  const h = location.hash.slice(1), prev = lastHash.slice(1); lastHash = location.hash;
  const isCh = x => DB.modules.some(m => m.id === x) || x === 'home' || x === '';
  if (RM() || !isCh(h) || !isCh(prev) || h === prev) return;
  const f = document.createElement('div'); f.className = 'flipov' + (DB.modules.findIndex(m => m.id === h) < DB.modules.findIndex(m => m.id === prev) ? ' back' : '');
  document.body.appendChild(f); setTimeout(() => f.remove(), 750);
});

// ── 7. events ──
document.addEventListener('click', e => {
  const t = e.target.closest('[data-turn],[data-skipbook],[data-chapter],[data-reelgo],[data-reelstep],[data-reelplay],[data-doors],#book .leaf');
  if (!t) return;
  if ('turn' in t.dataset) { if (t.dataset.done) enter(); else turnPage(); return; }
  if ('skipbook' in t.dataset) return skipBook();
  if (t.dataset.chapter) return goChapter(t.dataset.chapter);
  if (t.dataset.reelgo) { const [id, k] = t.dataset.reelgo.split(':'); reels[id].i = +k; playReel(id, false); return; }
  if (t.dataset.reelstep) { const [id, d] = t.dataset.reelstep.split(':'); playReel(id, false); stepReel(id, +d); return; }
  if (t.dataset.reelplay) return playReel(t.dataset.reelplay);
  if (t.dataset.doors) return openDoors(t.dataset.doors);
  if (t.classList.contains('leaf') && !e.target.closest('a,button')) turnPage();
});
document.addEventListener('pointerdown', e => { if (e.target.closest('#book')) book.x = e.clientX; });
document.addEventListener('pointerup', e => { if (book.x !== null && e.clientX - book.x < -40) turnPage(); book.x = null; });
new MutationObserver(() => { for (const id in DB.reels) { const f = document.getElementById('film-' + id); if (f && !f.childElementCount) { reels[id] = reels[id] || { i: 0, playing: false }; showFrame(id); } } })
  .observe(document.getElementById('app'), { childList: true });

// first render and the opening screens happen in levels.js
