// SAMVIDHAN QUIZ PREP — APPLICATION LOGIC
// Rule: no content here. Reads DB (data.js) and renders. Content change = edit data.js only.
// Poster artwork is used once, as illustration; every word on screen comes from DB, so nothing is shown twice.

const PRELIM = new Date('2026-11-26T11:00:00+05:30');
const P = DB.people;
const EV = Object.fromEntries(DB.events.map(e => [e.id, e]));
const CO = Object.fromEntries(DB.concepts.map(c => [c.id, c]));
const TO = Object.fromEntries(DB.topics.map(t => [t.id, t]));
const PRE = Object.fromEntries(DB.preamble.map(c => [c.id, c]));
const EV_MOD = {};
DB.modules.forEach(m => m.sections.forEach(s => { if (s.type === 'events') s.ref.forEach(id => EV_MOD[id] = m.id); }));

const MOD_TOPICS = { m1: ['road'], m2: ['assembly', 'symbols'], m3: ['writing'], m4: ['preamble'], m5: ['rights'], m6: ['book', 'numbers'], m7: ['people'], m8: null };
const MOD_ART = DB.book.hero;
const GROUP_LABEL = { big4: T('The big four'), makers10: T('The 10 Makers'), women15: T('The 15 women members'), officers: T('Officers, advisers and other leaders') };
const FIELDS = ([['born', 'Born', ''], ['died', 'Died', ''], ['education', 'Education / profession', ''], ['entry', 'Entry into the freedom struggle / public life', ''],
  ['milestones', 'Milestones before 1947', ''], ['knownFor', 'Known for', 'known'], ['assembly', 'In the Constituent Assembly', ''],
  ['contribution', 'Contribution to the Constitution', 'contrib'], ['after', 'After independence', ''], ['quizClue', 'Quiz clue', 'clue']]).map(([k, l, c]) => [k, T(l), c]);
const PAGE_SHOWN = new Set();
const PRE_LABELS = new Set(['Meaning', 'Example', 'Like in school', 'Promise kept in', 'In Hindi', 'Why it matters', 'Did you know?', 'Adopt', 'Enact', 'Give to ourselves'].map(T));
const MITHU = T('Mithu says: ');

const store = {
  get(k, d) { try { const v = localStorage.getItem('sqp:' + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('sqp:' + k, JSON.stringify(v)); } catch (e) {} },
};
const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const hiTxt = s => s ? `<span class="hi" lang="${/[ऀ-ॿ]/.test(s) ? 'hi' : 'en'}">${esc(s)}</span>` : '';
const langBtn = () => `<button class="iconbtn lang" data-lang="${LANG === 'hi' ? 'en' : 'hi'}" aria-label="${LANG === 'hi' ? 'Switch to English' : 'हिंदी में पढ़ें'}">${LANG === 'hi' ? 'English' : 'हिंदी'}</button>`;
const pname = id => P[id] ? P[id].name : id;
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function srcLine(keys) {
  const parts = (keys || []).map(k => {
    const s = DB.sources[k]; if (!s) return '';
    const t = esc(s.short || s.title) + (s.type === 'secondary' ? T(' (secondary)') : '');
    return s.url && /^https?:/.test(s.url) ? `<a href="${esc(s.url)}" target="_blank" rel="noopener">${t}</a>` : t;
  }).filter(Boolean);
  return parts.length ? `<p class="src"><b>${T('Source')}</b>${parts.join(' · ')}</p>` : '';
}

// ── question bank ──
function bank() {
  const qs = DB.quiz.map(q => ({ ...q }));
  for (const [id, mid] of Object.entries(EV_MOD)) {
    const e = EV[id];
    qs.push({ id: 'ev-' + id, q: LANG === 'hi' ? `${e.date} को क्या हुआ?` : `What happened ${/^\d/.test(e.date) ? 'on' : 'in'} ${e.date}?`, a: e.title, why: e.text, topic: 'ev-' + mid, src: e.src });
  }
  for (const p of Object.values(P)) if (p.kind === 'profile')
    qs.push({ id: 'who-' + p.id, q: `${LANG === 'hi' ? 'मैं कौन हूँ?' : 'Who am I?'} ${p.profile.quizClue}`, a: p.name, why: p.profile.knownFor, topic: 'people', src: p.profileSrc });
  for (const n of DB.numbers) qs.push({ id: 'num-' + n.value, q: LANG === 'hi' ? `यह संख्या किस बात की है: ${n.value}?` : `What does this number stand for: ${n.value}?`, a: n.meaning, why: '', topic: 'numbers', src: n.src });
  return qs;
}
const BANK = bank();
const questionsFor = mid => MOD_TOPICS[mid] === null ? BANK : BANK.filter(q => MOD_TOPICS[mid].includes(q.topic) || q.topic === 'ev-' + mid);

// ── opening screen (as on the Critical Minerals platform) ──
const op = { i: 0, timer: null };
function showOpening() {
  const L = DB.opening.lenses;
  $('#open').innerHTML = `<div class="open-in">
    <div class="stripe" aria-hidden="true"></div>
    <p class="eyebrow">${T('Samvidhan · for every student')}</p>
    <div class="lens fade" id="lens"></div>
    <div class="dots" role="tablist" aria-label="Facts">${L.map((_, i) => `<button class="dot" data-lens="${i}" aria-label="Fact ${i + 1}"></button>`).join('')}</div>
    <div class="open-actions">
      <button class="btn s" data-enter>${T('Start learning')}</button>
      <button class="btn ghost" data-nextlens>${T('Next fact →')}</button>
      <div class="dyk"><b>${T('Did you know?')}</b><span id="dyk"></span></div>
    </div></div>`;
  $('#open').hidden = false;
  renderLens(false); restartLens();
}
function renderLens(animate) {
  const L = DB.opening.lenses, l = L[op.i], T = DB.opening.trivia;
  const html = `<img class="lens-art${/head/.test(l.art) ? '' : ' round'}" src="${esc(l.art)}" alt=""><div><h1>${esc(l.label)}</h1><p>${esc(l.body)}</p>${srcLine(l.src)}</div>`;
  const box = $('#lens');
  const put = () => { box.innerHTML = html; box.style.opacity = 1; $('#dyk').textContent = T[op.i % T.length].text; };
  if (animate && !matchMedia('(prefers-reduced-motion: reduce)').matches) { box.style.opacity = 0; setTimeout(put, 220); } else put();
  document.querySelectorAll('.dot').forEach((d, i) => d.classList.toggle('on', i === op.i));
  op.trivia = (op.trivia ?? 0);
}
function nextLens() { op.i = (op.i + 1) % DB.opening.lenses.length; DB.opening.trivia.push(DB.opening.trivia.shift()); renderLens(true); restartLens(); }
function restartLens() { clearInterval(op.timer); op.timer = setInterval(nextLens, 9000); }
function enter() { clearInterval(op.timer); $('#open').hidden = true; try { sessionStorage.setItem('sqp:entered', '1'); } catch (e) {} }

// ── shared bits ──
function header(title, hi, back = true) {
  return `<header class="bar"><div class="bar-in">${back ? '<a class="iconbtn" href="#home" aria-label="All modules">←</a>' : ''}
    <div class="bar-t"><small>${T('Samvidhan Quiz Prep')}</small><strong>${title}</strong>${hi ? hiTxt(hi) : ''}</div>
    ${langBtn()}<button class="iconbtn" data-facts aria-label="Show the opening facts">${T('Facts')}</button></div></header>`;
}
// Names inside a sentence become the link to that person's profile, so a name is not printed twice (text + button).
function linkNames(text, ids) {
  let parts = [esc(text)]; const left = [];
  (ids || []).filter(id => P[id]).forEach(id => {
    const p = P[id], last = s => (s || '').split(' ').slice(-1)[0];
    const cands = [p.name, p.en, ...(p.aliases || []), last(p.name), last(p.en)].filter(c => c && c.length >= 4).map(esc);
    let done = false;
    parts = parts.flatMap(seg => {
      if (done || seg.startsWith('<button')) return [seg];
      const c = cands.find(c => seg.includes(c)); if (!c) return [seg];
      const k = seg.indexOf(c); done = true;
      return [seg.slice(0, k), `<button class="linkbtn" data-person="${id}">${c}</button>`, seg.slice(k + c.length)];
    });
    if (!done) left.push(id);
  });
  return [parts.join(''), left];
}
function renderEvent(e) {
  const [body, left] = linkNames(e.text, e.people);
  const ppl = left.map(id => `<button class="person" data-person="${id}">${esc(pname(id))}</button>`).join('');
  const story = e.story && e.story.tagline ? `<p class="tag">${esc(e.story.tagline)}</p>` : '';
  const pin = e.scene ? `<img class="ev-art blot" src="scene-s/${esc(e.scene)}.webp" alt="" loading="lazy">` : e.art ? `<img class="ev-art blot sketch" src="${esc(e.art)}" alt="" loading="lazy">` : '<span class="ev-dot" aria-hidden="true"></span>';
  return `<li class="ev" id="${e.id}">${pin}<div class="ev-b"><span class="date">${esc(e.date)}</span><h3>${esc(e.title)}</h3><p>${body}</p>${story}${ppl ? `<div class="people">${ppl}</div>` : ''}${srcLine(e.src)}</div></li>`;
}
function renderTopic(t) {
  return `<article class="panel card${t.pic ? ' haspic' : ''}" id="${t.id}">${t.pic ? `<img class="illus head" src="${esc(t.pic)}" alt="" loading="lazy">` : ''}<h3>${esc(t.title)}</h3>${hiTxt(t.hi)}
    <ul class="rows">${t.lines.map(l => `<li>${esc(l)}</li>`).join('')}</ul>
    ${t.story ? `<div class="mithu"><p>${esc(t.story)}</p>${t.tagline ? `<b>${MITHU}${esc(t.tagline)}</b>` : ''}</div>` : ''}${srcLine(t.src)}</article>`;
}
function personCard(id, role) {
  const p = P[id];
  const pic = p.face ? `<img class="face" src="${esc(p.face)}" alt="" loading="lazy">` : `<span class="ini" aria-hidden="true">${esc((p.en || p.name).replace(/^(Dr|Sir|Sardar|Maulana|Begum|Rajkumari) /, '').charAt(0))}</span>`;
  return `<button class="panel pc" data-person="${id}">${pic}<span><strong>${esc(p.name)}</strong>${hiTxt(p.hi)}${role ? `<em class="role">${esc(role)}</em>` : ''}<small>${esc(p.profile.quizClue)}</small></span></button>`;
}

// ── Preamble: header art from the poster + the card's words, once ──
function preambleCard(c) {
  const L = c.lines, kind = L[0];
  const chipCls = kind === T('WHAT INDIA IS') ? 'g' : kind === T('WHAT INDIA PROMISES') ? '' : 'b';
  const head = `${c.pic ? `<img class="illus head" src="${esc(c.pic)}" alt="" loading="lazy">` : ''}<div class="ptitle"><h3>${esc(c.title)}</h3>${hiTxt(c.hi)}</div>`;
  let body = '';
  if (c.id === 'P01') {
    const go = { [T('WHO made it?')]: 'P03', [T('WHAT is India?')]: 'P04', [T('WHAT does India promise?')]: 'P09', [T('WHEN was it adopted?')]: 'P13' };
    const items = [];
    L.forEach((l, i) => { if (go[l]) items.push(`<a href="#m4" data-scroll="${go[l]}"><b>${esc(l)}</b><span>${esc(L[i + 1])}</span></a>`); });
    const LS = T('Like in school'), school = L.find(l => l.startsWith(LS));
    body = `<div class="index">${items.join('')}</div>${school ? `<div class="prow"><span class="chip b">${LS}</span><div>${esc(school.slice(LS.length).replace(/^:\s*/, ''))}</div></div>` : ''}`;
  } else if (c.id === 'P14') {
    const k = L.indexOf(T('Separate any one, and democracy fails'));
    const [quote, who, ...rest] = L.slice(k + 1);
    body = `<p class="quote">“${esc(quote)}”<small>${esc(who)}</small></p><ul class="rows">${rest.map(l => `<li>${esc(l)}</li>`).join('')}</ul>`;
  } else {
    let i = L.findIndex(l => PRE_LABELS.has(l)); const rows = []; let trap = ''; const QT = T('Quiz trap');
    while (i > -1 && i < L.length) {
      if (L[i].startsWith(QT)) { trap = L[i]; i++; continue; }
      if (PRE_LABELS.has(L[i])) {
        const lab = L[i]; const vals = []; i++;
        while (i < L.length && !PRE_LABELS.has(L[i]) && !L[i].startsWith(QT)) vals.push(L[i++]);
        rows.push(`<div class="prow"><span class="chip ${lab === T('Like in school') ? 'b' : chipCls}">${esc(lab)}</span>${vals.map(v => `<div${/[ऀ-ॿ]/.test(v) && !/[a-z]{3}/i.test(v) ? ' lang="hi"' : ''}>${esc(v)}</div>`).join('')}</div>`);
      } else i++;
    }
    body = rows.join('') + (trap ? `<div class="trap">${esc(trap)}</div>` : '');
  }
  return `<article class="panel pcard" id="${c.id}">${head}<div class="body">${body}${c.srcText ? `<p class="src"><b>${T('Source')}</b>${esc(c.srcText)}</p>` : ''}</div></article>`;
}
function posterCard(c, notesTopic) {
  const alt = c.title + '. ' + c.lines.filter(l => !/^\(/.test(l)).join(' ');
  const notes = notesTopic ? `<div class="mithu"><p><b style="color:var(--navy-ink)">${esc(notesTopic.title)}</b></p><ul class="rows" style="margin-top:6px">${notesTopic.lines.map(l => `<li>${esc(l)}</li>`).join('')}</ul></div>${srcLine(notesTopic.src)}` : '';
  return `<article class="panel card" id="${c.id}"><button class="zoomable" data-zoom="${esc(c.poster)}" aria-label="Open the poster at full size"><img src="${esc(c.poster)}" alt="${esc(alt)}" loading="lazy"></button>${notes}${c.srcText ? `<p class="src"><b>Source</b>${esc(c.srcText)}</p>` : ''}</article>`;
}
function preambleMaking() {
  const ids = ['e1946f', 'e1946h', 'e1947a', 'e1948a', 'e1948e', 'e1949c', 'e1949h', 'e1950b'];
  return `<article class="panel card"><h3>${T('How the Preamble was made')}</h3><p class="lede" style="margin-top:-4px">${T('These moments are told in full in Modules 2 and 3. Tap one to jump there.')}</p>
    <div class="index">${ids.map(id => `<a href="#${EV_MOD[id]}" data-scroll="${id}"><b>${esc(EV[id].date)}</b><span>${esc(EV[id].title)}</span></a>`).join('')}</div></article>`;
}

function renderSection(s) {
  const t = s.type, r = s.ref;
  if (t === 'events') return `<ol class="tl">${r.map(id => renderEvent(EV[id])).join('')}</ol>`;
  if (t === 'topics') return r.map(id => renderTopic(TO[id])).join('');
  if (t === 'concept') { const c = CO[r]; return `<aside class="panel card concept"><h3>${esc(c.title)}</h3><p style="margin:0">${esc(c.text)}</p>${srcLine(c.src)}</aside>`; }
  if (t === 'committees') return `<h2 class="sec">${T('Committees and their chairs')}</h2><div class="tablewrap"><table class="tbl"><thead><tr><th>${T('Committee')}</th><th>${T('Chair')}</th><th>${T('Its job')}</th></tr></thead><tbody>${DB.committees.map(c => `<tr><td>${esc(c.name)}</td><td>${c.chair.map(x => `<button class="linkbtn" data-person="${x}">${esc(pname(x))}</button>`).join(', ')}</td><td>${esc(c.purpose)}</td></tr>`).join('')}</tbody></table></div>`;
  if (t === 'midnight') return `<h2 class="sec">${T('The midnight session, minute by minute')}</h2><ol class="clock">${DB.midnight.map(m => `<li class="panel"><b>${esc(m.time)}</b><span>${esc(m.text)}</span></li>`).join('')}</ol>${srcLine(['cad-1947-08-14'])}`;
  if (t === 'numbers') return `<h2 class="sec">${T('Numbers to know')}</h2><div class="nums">${DB.numbers.map(n => `<div class="panel numc"><b>${esc(n.value)}</b><span>${esc(n.meaning)}</span></div>`).join('')}</div>`;
  if (t === 'preamble') {
    const order = ['P01', 'P02', 'P03', 'P04', 'P05', 'P06', 'P07', 'P08', 'P09', 'P10', 'P11', 'P12', 'P13', 'P14'];
    return order.map(id => PRE[id].poster ? posterCard(PRE[id]) : preambleCard(PRE[id])).join('') + preambleMaking() + posterCard(PRE.P16, TO.t108);
  }
  if (t === 'group') {
    const ps = Object.values(P).filter(p => p.kind === 'profile' && p.groups.includes(r));
    const fresh = ps.filter(p => !PAGE_SHOWN.has(p.id)), seen = ps.filter(p => PAGE_SHOWN.has(p.id)); fresh.forEach(p => PAGE_SHOWN.add(p.id));
    const role = id => ((DB.groupRoles || {})[r] || {})[id];
    const chips = seen.length ? `<div class="also"><span>${T('Also in this group, met above:')}</span>${seen.map(p => `<button class="chipp" data-person="${p.id}">${p.face ? `<img src="${esc(p.face)}" alt="">` : ''}<b>${esc(p.name)}</b>${role(p.id) ? `<small>${esc(role(p.id))}</small>` : ''}</button>`).join('')}</div>` : '';
    return `<h2 class="sec">${GROUP_LABEL[r]}</h2>${fresh.length ? `<div class="pgrid">${fresh.map(p => personCard(p.id, role(p.id))).join('')}</div>` : ''}${chips}`;
  }
  if (t === 'short') {
    const by = new Map(); Object.values(P).filter(p => p.kind === 'short').forEach(p => { if (!by.has(p.text)) by.set(p.text, []); by.get(p.text).push(p); });
    return `<h2 class="sec">${T('Supporting cast')}</h2><ul class="cast">${[...by].map(([txt, ps]) => `<li class="panel"><strong>${ps.map(p => `${esc(p.name)} ${hiTxt(p.hi)}`).join('<span class="amp"> · </span>')}</strong><span>${esc(txt)}</span></li>`).join('')}</ul>`;
  }
  if (t === 'firsts') return `<h2 class="sec">${T('Later “firsts”')}</h2><ul class="cast">${DB.firsts.map(f => `<li class="panel"><strong>${esc(f.title)}</strong><span><button class="linkbtn" data-person="${f.person}">${esc(pname(f.person))}</button>${f.detail ? ' · ' + esc(f.detail) : ''}</span></li>`).join('')}</ul>`;
  if (t === 'connects') return `<h2 class="sec">${T('Find the connection')}</h2><div class="conn">${DB.connects.map(c => `<details class="panel"><summary>${c.items.map(x => esc(P[x] ? pname(x) : x)).join(' · ')}</summary><p>${T('Link: ')}${esc(c.link)}</p></details>`).join('')}</div>`;
  if (t === 'traps') return `<h2 class="sec">${T('Quiz traps')}</h2><ul class="traps">${DB.traps.map(x => `<li>${esc(x)}</li>`).join('')}</ul>`;
  if (t === 'quiz') return `<div class="cta"><a class="btn s" href="#practice-m8">${T('Mixed practice · 10 questions')}</a><a class="btn ghost" href="#cards">${T('Who am I? cards')}</a></div>`;
  return '';
}

// ── views ──
function viewHome() {
  const days = Math.max(0, Math.ceil((PRELIM - new Date()) / 864e5));
  const prog = store.get('prog', {}), misses = store.get('misses', []);
  return `${header('Learn, then test yourself', 'संविधान क्विज़ की तैयारी', false)}<main class="wrap">
    <section class="panel count"><b>${days}</b><span>days to the prelim<br>26 November · 11:00 am, online</span></section>
    <div class="cta"><a class="btn s" href="#practice-m8">Mixed practice · 10 questions</a>${misses.length ? `<a class="btn ghost" href="#practice-misses">Revise my misses (${misses.length})</a>` : ''}<a class="btn ghost" href="#cards">Who am I? cards</a></div>
    <h2 class="sec">Modules</h2>
    <nav class="mods">${DB.modules.map((m, i) => { const p = prog[m.id];
      return `<a class="panel mod" href="#${m.id}"><span class="num">${i + 1}</span><span class="mod-t"><strong>${esc(m.title)}</strong>${hiTxt(m.hi)}<small>${esc(m.span)}</small></span><span class="score${p ? '' : ' no'}">${p ? `Best ${p.best}/${p.of}` : 'Not tried'}</span></a>`; }).join('')}</nav>
    <p class="foot">For students of every age. Every fact is checked against the Constituent Assembly Debates, the Constitution’s text or official records, and names its source. Database v${esc(DB.meta.version)}, ${esc(DB.meta.date)}.</p>
  </main>`;
}
function viewModule(id) {
  PAGE_SHOWN.clear();
  const m = DB.modules.find(x => x.id === id), i = DB.modules.indexOf(m), next = DB.modules[i + 1];
  const n = questionsFor(id).length, art = MOD_ART[id];
  const artHtml = '';
  return `${header(`${i + 1}. ${esc(m.title)}`, m.hi)}<main class="wrap">${art ? `<figure class="hero"><img src="${esc(art)}" alt=""><figcaption><small>${T('Chapter')} ${i + 1}</small><b>${esc(m.title)}</b>${hiTxt(m.hi)}<span>${esc(m.span)}</span></figcaption></figure>` : `<p class="lede">${esc(m.span)}</p>`}
    ${m.sections.map(renderSection).join('')}
    <section class="endcard">${artHtml}<div class="in"><h2>${T('Test yourself')}</h2><p>${LANG === 'hi' ? `इस मॉड्यूल के ${n} सवालों में से ${id === 'm8' ? '10' : '5'} सवाल। पहले उत्तर ज़ोर से बोलो, फिर जाँचो।` : `${id === 'm8' ? '10' : '5'} questions from ${n} in this module’s bank. Say the answer out loud first, then check.`}</p>
    <div class="cta"><a class="btn s" href="#practice-${id}">${T('Start practice')}</a>${next ? `<a class="btn ghost" href="#${next.id}">${LANG === 'hi' ? 'अगला' : 'Next'}: ${esc(next.title)} →</a>` : ''}</div></div></section></main>`;
}
let run = null;
function startPractice(key) {
  const pool = key === 'misses' ? BANK.filter(q => new Set(store.get('misses', [])).has(q.id)) : questionsFor(key);
  const n = key === 'm8' ? 10 : key === 'misses' ? Math.min(10, pool.length) : 5;
  run = { key, qs: shuffle(pool).slice(0, n), i: 0, right: 0, shown: false };
}
function viewPractice() {
  const m = DB.modules.find(x => x.id === run.key);
  const title = run.key === 'misses' ? T('Revise my misses') : m ? `${T('Practice')}: ${m.title}` : T('Practice');
  if (!run.qs.length) return `${header(title)}<main class="wrap"><p class="lede">${T('No questions here yet.')}</p></main>`;
  if (run.i >= run.qs.length) {
    if (m) { const prog = store.get('prog', {}); const p = prog[m.id]; if (!p || run.right > p.best) { prog[m.id] = { best: run.right, of: run.qs.length }; store.set('prog', prog); } }
    return `${header(title)}<main class="wrap"><section class="panel done"><b>${run.right}/${run.qs.length}</b><p>${run.right === run.qs.length ? T('Full marks.') : T('The ones you missed are saved in “Revise my misses” on the home page.')}</p><div class="cta"><button class="btn s" data-again>${T('Another round')}</button><a class="btn ghost" href="#home">${T('Home')}</a></div></section></main>`;
  }
  const q = run.qs[run.i];
  return `${header(title)}<main class="wrap"><div class="panel qcard"><p class="qn">${LANG === 'hi' ? `सवाल ${run.i + 1} / ${run.qs.length}` : `Question ${run.i + 1} of ${run.qs.length}`}</p><h2 class="q">${esc(q.q)}</h2>
    ${run.shown ? `<div class="ans"><span>${T('Answer')}</span><b>${esc(q.a)}</b>${q.why ? `<p>${esc(q.why)}</p>` : ''}${srcLine(q.src)}</div><div class="mark"><button class="btn ok" data-mark="1">${T('I got it')}</button><button class="btn miss" data-mark="0">${T('I missed it')}</button></div>`
      : `<button class="btn s" data-show style="width:100%">${T('Show answer')}</button>`}</div></main>`;
}
let deck = null;
function viewCards() {
  if (!deck) deck = { list: shuffle(Object.values(P).filter(p => p.kind === 'profile')), i: 0, flip: false };
  const p = deck.list[deck.i];
  return `${LANG === 'hi' ? header('मैं कौन हूँ? कार्ड', 'Who am I? cards') : header('Who am I? cards', 'मैं कौन हूँ?')}<main class="wrap"><p class="qn">${LANG === 'hi' ? `कार्ड ${deck.i + 1} / ${deck.list.length}` : `Card ${deck.i + 1} of ${deck.list.length}`}</p>
    <button class="flash${deck.flip ? ' flipped' : ''}" data-flip aria-label="Flip card">${deck.flip
      ? `${p.face ? `<img src="${esc(p.face)}" alt="">` : ''}<strong>${esc(p.name)}</strong>${hiTxt(p.hi)}<small>${esc(p.profile.knownFor)}</small>`
      : `<span class="badge">${T('Quiz clue')}</span><span class="clue">${esc(p.profile.quizClue)}</span><small>${T('Tap to see who')}</small>`}</button>
    <div class="cta"><button class="btn ghost" data-card="-1">${T('← Previous')}</button><button class="btn s" data-card="1">${T('Next →')}</button></div></main>`;
}
function openPerson(id) {
  const p = P[id]; if (!p) return;
  let html;
  if (p.kind === 'profile') {
    const head = `<div class="sheet-head${p.face ? ' port' : ' plain'}">${p.vig ? `<img class="sh-bg" src="${esc(p.vig)}" alt="">` : ''}${p.face ? `<img class="sh-face" src="${esc(p.face)}" alt="Portrait sketch of ${esc(p.name)}">` : ''}<div class="sh-name"><h2 id="sheet-title">${esc(p.name)}</h2>${hiTxt(p.hi)}<small>${esc(p.profile.knownFor)}</small></div></div>`;
    const rows = FIELDS.filter(([k]) => k !== 'knownFor' && p.profile[k] && !/^Not stated in the source|^स्रोत में नहीं दिया गया/.test(String(p.profile[k]))).map(([k, l, cls]) => { const v = p.profile[k]; return `<div class="frow ${cls}"><b>${l}</b><div>${Array.isArray(v) ? `<ul>${v.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : esc(v)}</div></div>`; }).join('');
    const extras = p.extras && p.extras.length ? `<div class="note"><b>${T('Also know:')}</b> ${p.extras.map(x => esc(x.text)).join(' ')}</div>` : '';
    const alias = LANG === 'en' && p.face && p.aliases && p.aliases.length && p.aliases.some(a => !p.name.includes(a)) ? `<div class="note">Also written as: ${esc(p.aliases.filter(a => !p.name.includes(a)).join(', '))}.</div>` : '';
    const story = p.story && p.story.tagline ? `<div class="mithu"><b>${MITHU}${esc(p.story.tagline)}</b></div>` : '';
    html = `${head}<div class="sheet-body">${rows}${story}${extras}${alias}${srcLine(p.profileSrc)}${p.memberPage ? `<p class="src"><a href="${esc(p.memberPage)}" target="_blank" rel="noopener">${T('Member page and photo on constitutionofindia.net')}</a></p>` : ''}</div>`;
  } else html = `<div class="sheet-head plain"><h2 id="sheet-title">${esc(p.name)}</h2>${hiTxt(p.hi)}</div><div class="sheet-body"><div class="frow"><div>${esc(p.text)}</div></div>${srcLine(p.src)}</div>`;
  $('#sheet-body').innerHTML = html; $('#sheet').hidden = false; $('#sheet .x').focus();
}

// ── router and events ──
let pendingScroll = null;
function render() {
  const h = (location.hash || '#home').slice(1);
  const app = $('#app'); $('#sheet').hidden = true;
  if (h.startsWith('practice-')) { const k = h.slice(9); if (!run || run.key !== k) startPractice(k); app.innerHTML = viewPractice(); }
  else if (h === 'cards') app.innerHTML = viewCards();
  else if (DB.modules.some(m => m.id === h)) { app.innerHTML = viewModule(h); run = null; }
  else { app.innerHTML = viewHome(); run = null; }
  if (pendingScroll && document.getElementById(pendingScroll)) { document.getElementById(pendingScroll).scrollIntoView({ block: 'start' }); window.scrollBy(0, -80); }
  else window.scrollTo(0, 0);
  pendingScroll = null;
}
document.addEventListener('click', e => {
  if (e.target.id === 'sheet') { $('#sheet').hidden = true; return; }
  const t = e.target.closest('[data-lang],[data-person],[data-zoom],[data-show],[data-mark],[data-again],[data-flip],[data-card],[data-scroll],[data-enter],[data-nextlens],[data-lens],[data-facts],.x,#zoom');
  if (!t) return;
  if (t.dataset.lang) return setLang(t.dataset.lang);
  if (t.dataset.scroll) { e.preventDefault(); const target = t.getAttribute('href').slice(1); pendingScroll = t.dataset.scroll; if (location.hash.slice(1) === target) render(); else location.hash = target; return; }
  if (t.dataset.person) return openPerson(t.dataset.person);
  if (t.dataset.zoom) { $('#zoom img').src = t.dataset.zoom; $('#zoom').hidden = false; return; }
  if (t.id === 'zoom') { $('#zoom').hidden = true; return; }
  if (t.classList.contains('x')) { $('#sheet').hidden = true; return; }
  if ('enter' in t.dataset) return enter();
  if ('nextlens' in t.dataset) return nextLens();
  if (t.dataset.lens) { op.i = Number(t.dataset.lens); renderLens(true); restartLens(); return; }
  if ('facts' in t.dataset) return showOpening();
  if ('show' in t.dataset) { run.shown = true; $('#app').innerHTML = viewPractice(); return; }
  if ('mark' in t.dataset) {
    const q = run.qs[run.i], misses = new Set(store.get('misses', []));
    if (t.dataset.mark === '1') { run.right++; misses.delete(q.id); } else misses.add(q.id);
    store.set('misses', [...misses]); run.i++; run.shown = false; $('#app').innerHTML = viewPractice(); window.scrollTo(0, 0); return;
  }
  if ('again' in t.dataset) { startPractice(run.key); $('#app').innerHTML = viewPractice(); return; }
  if ('flip' in t.dataset) { deck.flip = !deck.flip; $('#app').innerHTML = viewCards(); return; }
  if (t.dataset.card) { deck.i = (deck.i + Number(t.dataset.card) + deck.list.length) % deck.list.length; deck.flip = false; $('#app').innerHTML = viewCards(); }
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') { $('#sheet').hidden = true; $('#zoom').hidden = true; if (!$('#open').hidden) enter(); } });
window.addEventListener('hashchange', render);
// first render happens in story.js
