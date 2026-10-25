// SAMVIDHAN — AGE LEVELS (loaded last)
// Level 1: under 10 (picture stories + picture quiz). Level 2: 10 to 14 (the full illustrated course).
// Level 3: 14 and above (everything, plus big ideas, questions to think about, and where sources disagree).
// The choice is saved per device; no content lives here.

let LEVEL = (() => { try { return Number(localStorage.getItem('sqp:level')) || 0; } catch (e) { return 0; } })();
const LV = id => DB.levels.find(l => l.id === id) || DB.levels[1];
const lvShort = id => ({ 1: '<10', 2: '10–14', 3: '14+' })[id] || '';
function setLevel(n) { LEVEL = n; try { localStorage.setItem('sqp:level', String(n)); } catch (e) {} document.body.dataset.lv = n; run = null; }

// ── header: language and age chips replace the old "Facts" button ──
window.header = function (title, hi, back = true) {
  return `<header class="bar"><div class="bar-in">${back ? `<a class="iconbtn" href="#home" aria-label="${T('Contents')}">←</a>` : ''}
    <div class="bar-t"><small>${T('Samvidhan · for every student')}</small><strong>${title}</strong>${hi ? hiTxt(hi) : ''}</div>
    <div class="bar-chips"><button class="iconbtn lvl" data-chooser aria-label="${T('Change age group')}"><small>${T('Age')}</small>${lvShort(LEVEL)}</button>${langBtn()}</div></div></header>`;
};

// ── 1. The first screen: who is reading? ──
function showChooser(first) {
  const ART = { 1: 'pic/P01.webp', 2: 'scene/hall-first-day.webp', 3: 'pic/t108.webp' };
  const cards = DB.levels.map(l => `<button class="lvcard${l.id === LEVEL ? ' on' : ''}" data-setlevel="${l.id}">
      <img class="lv-art illus" src="${ART[l.id]}" alt=""><span class="lv-age">${esc(l.ages)}</span><span class="lv-blurb">${esc(l.blurb)}</span>
      <span class="btn s lv-go">${l.id === LEVEL ? T('Continue') : T('Start')}</span></button>`).join('');
  $('#open').innerHTML = `<div class="chooser" data-first="${first ? 1 : 0}"><div class="ch-in">
    <div class="ch-top"><div><p class="eyebrow">${T('Samvidhan · for every student')}</p><h1>${T('How old are you?')}</h1>
    <p class="lede">${T('You can change this any time.')}</p></div>${langBtn()}</div>
    <div class="lvgrid">${cards}</div>
    ${first ? '' : `<button class="btn ghost" data-closechooser>${T('Close')}</button>`}</div></div>`;
  $('#open').hidden = false; $('#open').scrollTop = 0;
}

// ── 2. The book opening, per level (little learners get picture pages) ──
const _showOpening = window.showOpening;
window.showOpening = function () {
  if (LEVEL !== 1) return _showOpening();
  const keep = DB.opening.lenses;
  DB.opening.lenses = DB.kids.m1.map(k => ({ label: '', body: k.text, art: k.img, src: k.src }));
  _showOpening(); DB.opening.lenses = keep;
};

// ── 3. Home ──
const _viewHome = window.viewHome;
window.viewHome = function () {
  if (LEVEL !== 1) return _viewHome().replace(T('days to the prelim'), T('days to the #ReclaimConstitution Quiz prelim'));
  const prog = store.get('prog', {});
  return `${LANG === 'hi' ? header('विषय-सूची', 'Contents', false) : header('Contents', 'विषय-सूची', false)}<main class="wrap">
    <section class="panel kidhello"><img class="blot" src="scene-s/hall-first-day.webp" alt=""><div><b>${T('Hello! Let’s learn about our Constitution.')}</b><span>${T('Tap a chapter to see its picture story.')}</span></div>
    <a class="btn s" href="#practice-kids">${T('Play the picture quiz')}</a></section>
    <nav class="chapters kchap">${DB.modules.map((m, i) => { const p = prog['kids-' + m.id];
      return `<a class="panel chap" href="#${m.id}"><img class="illus" src="${esc(((DB.kids[m.id] || []).find(k => !/^face\//.test(k.img)) || {}).img || DB.book.hero[m.id])}" alt="" loading="lazy"><span class="chap-t"><small>${T('Chapter')} ${i + 1}</small><strong>${esc(m.title)}</strong>${hiTxt(m.hi)}</span>${p ? `<span class="score">${T('Best')} ${p.best}/${p.of}</span>` : ''}</a>`; }).join('')}</nav>
    <p class="foot">${T('Every fact is checked against the Constituent Assembly Debates, the Constitution’s text or official records, and names its source.')}</p></main>`;
};

// ── 4. Chapters ──
const _viewModule = window.viewModule;
function kidCard(k) {
  const person = P[k.ref] && P[k.ref].kind === 'profile';
  const inner = `<img class="${/^face\//.test(k.img) ? 'kc-face' : 'kc-pic illus'}" src="${esc(k.img)}" alt="" loading="lazy"><p>${esc(k.text)}</p>`;
  return `<li class="panel kcard">${person ? `<button class="kc-btn" data-person="${k.ref}">${inner}<span class="kc-more">${T('Tap to read more')}</span></button>` : inner}${srcLine(k.src)}</li>`;
}
function deepBlock(id) {
  const d = DB.deep[id] || {};
  let h = '';
  if (d.ideas) h += `<h2 class="sec">${T('Big ideas')}</h2>` + d.ideas.map(x => `<aside class="panel card concept deep"><span class="chip">${T('14+')}</span><h3>${esc(x.title)}</h3><p style="margin:0">${esc(x.text)}</p>${srcLine(x.src)}</aside>`).join('');
  if (d.think) h += `<section class="panel card think"><h3>${T('Think deeper')}</h3><p class="lede">${T('There is no single right answer. Use facts from this chapter to argue your view.')}</p><ol>${d.think.map(x => `<li>${esc(x)}</li>`).join('')}</ol></section>`;
  if (id === 'm8') {
    h += `<h2 class="sec">${T('Where sources disagree')}</h2><p class="lede">${T('Two sources can say different things. Here is what each says, and which one this site follows.')}</p><div class="dgrid">${DB.disputes.map(x => `<div class="panel dcard"><b>${esc(x.question)}</b><span><i>${T('Conflict')}:</i> ${esc(x.conflict)}</span><span class="use"><i>${T('We use')}:</i> ${esc(x.use)}</span></div>`).join('')}</div>`;
    h += `<h2 class="sec">${T('Not confirmed yet')}</h2><p class="lede">${T('You may read these claims elsewhere. We could not confirm them in a reliable source, so they are not used anywhere else on this site.')}</p><div class="dgrid">${DB.onHold.map(x => `<div class="panel dcard hold"><b>${esc(x.claim)}</b><span>${esc(x.why.replace(/\s*\((from Module \d|मॉड्यूल \d से)\)/, ''))}</span></div>`).join('')}</div>`;
  }
  return h;
}
window.viewModule = function (id) {
  if (LEVEL !== 1 && LEVEL !== 3) return _viewModule(id);
  if (LEVEL === 3) { const html = _viewModule(id); const k = html.lastIndexOf('<section class="endcard">'); return html.slice(0, k) + deepBlock(id) + html.slice(k); }
  const m = DB.modules.find(x => x.id === id), i = DB.modules.indexOf(m), next = DB.modules[i + 1], art = DB.book.hero[id];
  return `${header(`${i + 1}. ${esc(m.title)}`, m.hi)}<main class="wrap kids">${art ? `<figure class="hero"><img src="${esc(art)}" alt=""><figcaption><small>${T('Chapter')} ${i + 1}</small><b>${esc(m.title)}</b>${hiTxt(m.hi)}</figcaption></figure>` : ''}
    <ol class="kgrid">${(DB.kids[id] || []).map(kidCard).join('')}</ol>
    <section class="endcard"><div class="in"><h2>${T('Picture quiz')}</h2><p>${T('Three choices. Tap the right one!')}</p>
    <div class="cta"><a class="btn s" href="#practice-kids-${id}">${T('Play')}</a>${next ? `<a class="btn ghost" href="#${next.id}">${LANG === 'hi' ? 'अगला' : 'Next'}: ${esc(next.title)} →</a>` : ''}</div></div></section></main>`;
};
// Court-ruling notes under the Preamble timeline are for 14 and above
const _posterCard = window.posterCard;
window.posterCard = function (c, notes) { return _posterCard(c, c.id === 'P16' && LEVEL < 3 ? null : notes); };

// ── 5. Picture quiz (three choices) for little learners ──
function kidsBank(mid) {
  const mods = mid ? [mid] : Object.keys(DB.kids);
  const qs = [];
  mods.forEach(m => (DB.kids[m] || []).forEach((k, i) => { if (k.q) qs.push({ id: `kq-${m}-${i}`, q: k.q.q, opts: k.q.opts, a: k.q.opts[k.q.a], img: k.img, src: k.src }); }));
  if (!mid || mid === 'm7' || mid === 'm8') {
    const faces = Object.values(P).filter(p => p.kind === 'profile' && p.face && (DB.kids.m7 || []).some(k => k.ref === p.id));
    faces.forEach(p => { const others = shuffle(faces.filter(x => x.id !== p.id)).slice(0, 2).map(x => x.name);
      qs.push({ id: 'kf-' + p.id, q: T('Who is this?'), opts: [p.name, ...others], a: p.name, img: p.face, face: true, src: p.profileSrc }); });
  }
  return qs;
}
const _startPractice = window.startPractice;
window.startPractice = function (key) {
  if (!key.startsWith('kids')) return _startPractice(key);
  const mid = key === 'kids' ? null : key.slice(5);
  run = { key, mid, qs: shuffle(kidsBank(mid)).slice(0, mid ? 6 : 8).map(q => ({ ...q, opts: shuffle(q.opts) })), i: 0, right: 0, picked: null };
};
const _viewPractice = window.viewPractice;
window.viewPractice = function () {
  if (!run.key.startsWith('kids')) return _viewPractice();
  const title = T('Picture quiz');
  if (run.i >= run.qs.length) {
    const pk = 'kids-' + (run.mid || 'all'), prog = store.get('prog', {}); if (!prog[pk] || run.right > prog[pk].best) { prog[pk] = { best: run.right, of: run.qs.length }; store.set('prog', prog); }
    return `${header(title)}<main class="wrap narrow"><section class="panel done"><b>${run.right}/${run.qs.length}</b><p>${run.right === run.qs.length ? T('Full marks.') : T('Well done! Play again to get them all right.')}</p><div class="cta"><button class="btn s" data-again>${T('Another round')}</button><a class="btn ghost" href="#home">${T('Home')}</a></div></section></main>`;
  }
  const q = run.qs[run.i], done = run.picked !== null;
  return `${header(title)}<main class="wrap narrow"><div class="panel qcard kq"><p class="qn">${LANG === 'hi' ? `सवाल ${run.i + 1} / ${run.qs.length}` : `Question ${run.i + 1} of ${run.qs.length}`}</p>
    ${q.img ? `<img class="${q.face ? 'kq-face' : 'kq-pic illus'}" src="${esc(q.img)}" alt="">` : ''}<h2 class="q">${esc(q.q)}</h2>
    <div class="opts">${q.opts.map((o, k) => `<button class="opt${done ? (o === q.a ? ' right' : k === run.picked ? ' wrong' : '') : ''}" data-pick="${k}"${done ? ' disabled' : ''}>${esc(o)}</button>`).join('')}</div>
    ${done ? `<p class="kq-msg">${q.opts[run.picked] === q.a ? T('Yes! That is right.') : `${T('The answer is')}: <b>${esc(q.a)}</b>`}</p>${srcLine(q.src)}<button class="btn s" data-nextq style="width:100%">${T('Next →')}</button>` : ''}</div></main>`;
};

// ── 6. Profile sheet: simple for little learners ──
const _openPerson2 = window.openPerson;
window.openPerson = function (id) {
  if (LEVEL !== 1) return _openPerson2(id);
  const p = P[id]; if (!p) return;
  const kid = Object.values(DB.kids).flat().find(k => k.ref === id);
  const text = (p.story && p.story.text) || (p.profile && p.profile.knownFor) || p.text || (kid && kid.text) || '';
  $('#sheet-body').innerHTML = `<div class="sheet-head${p.face ? ' port' : ' plain'}">${p.vig ? `<img class="sh-bg" src="${esc(p.vig)}" alt="">` : ''}${p.face ? `<img class="sh-face" src="${esc(p.face)}" alt="">` : ''}<div class="sh-name"><h2 id="sheet-title">${esc(p.name)}</h2>${hiTxt(p.hi)}</div></div>
    <div class="sheet-body"><div class="mithu kidtext"><p>${esc(text)}</p>${p.story && p.story.tagline ? `<b>${MITHU}${esc(p.story.tagline)}</b>` : ''}</div>${srcLine(p.profileSrc || p.src)}</div>`;
  $('#sheet').hidden = false; $('#sheet .x').focus();
};

// ── 7. events ──
document.addEventListener('click', e => {
  const t = e.target.closest('[data-setlevel],[data-chooser],[data-closechooser],[data-pick],[data-nextq]');
  if (!t) return;
  if (t.dataset.setlevel) {
    const first = !LEVEL || $('.chooser').dataset.first === '1';
    setLevel(Number(t.dataset.setlevel)); $('#open').hidden = true; render();
    let entered = false; try { entered = sessionStorage.getItem('sqp:entered') === '1'; } catch (err) {}
    if (first && !entered) showOpening();
    return;
  }
  if ('chooser' in t.dataset) return showChooser(false);
  if ('closechooser' in t.dataset) { $('#open').hidden = true; return; }
  if (t.dataset.pick !== undefined && run && run.picked === null) { run.picked = Number(t.dataset.pick); if (run.qs[run.i].opts[run.picked] === run.qs[run.i].a) run.right++; $('#app').innerHTML = viewPractice(); return; }
  if ('nextq' in t.dataset) { run.i++; run.picked = null; $('#app').innerHTML = viewPractice(); window.scrollTo(0, 0); }
});

// ── boot ──
document.body.dataset.lv = LEVEL || 2;
render();
(function () {
  let entered = false; try { entered = sessionStorage.getItem('sqp:entered') === '1'; } catch (e) {}
  if (!LEVEL) showChooser(true);
  else if (!entered && (!location.hash || location.hash === '#home')) showOpening();
})();
