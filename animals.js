// SAMVIDHAN — ANIMAL FRIENDS (loaded after levels.js)
// Original hand-drawn style SVG animals: Mithu the parrot (guide), an elephant, a lion, a peacock, a tortoise and an owl.
// They pop up with tips, walk across between chapters and cheer quiz answers. No facts live here; tips come from DB.
// Everything respects "reduce motion".

const INK = '#2B2118';
const OUT = `stroke="${INK}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round"`;
const ANIMALS = {
  parrot: () => `<svg viewBox="0 0 120 124" class="ani parrot" aria-hidden="true"><g ${OUT}>
    <rect x="22" y="106" width="76" height="8" rx="4" fill="#8A5A2B"/>
    <g class="a-tail"><path d="M44 92 L20 120 L33 117 L30 124 L50 100Z" fill="#2E8B3A"/></g>
    <ellipse cx="56" cy="74" rx="22" ry="27" fill="#4CB050"/>
    <ellipse cx="61" cy="84" rx="11" ry="14" fill="#8ED07A" stroke="none"/>
    <g class="a-wing"><path d="M40 62 Q30 88 50 102 Q62 86 58 64Z" fill="#2E8B3A"/></g>
    <path d="M50 101 l-4 8 M57 102 v8 M64 101 l4 8" fill="none" stroke="#7A6A5A"/>
    <circle cx="68" cy="43" r="19" fill="#5CC062"/>
    <path d="M51 52 Q68 66 85 53" fill="none" stroke="#C62828" stroke-width="3.4"/>
    <path d="M82 36 Q101 38 95 56 Q90 49 82 49Z" fill="#E8592B"/>
    <path d="M82 49 Q89 51 90 56 Q84 58 81 53Z" fill="#B53C17"/>
    <circle cx="74" cy="38" r="5.8" fill="#fff"/></g>
    <g class="a-eye"><circle cx="75.5" cy="38.3" r="3.1" fill="${INK}"/><circle cx="76.6" cy="37.2" r="1" fill="#fff"/></g></svg>`,

  elephant: () => `<svg viewBox="0 0 150 124" class="ani elephant" aria-hidden="true"><g ${OUT}>
    <path class="a-tail" d="M24 62 Q14 72 19 84" fill="none"/>
    <g class="a-legs"><rect x="32" y="80" width="15" height="32" rx="6" fill="#98A2AE"/><rect x="50" y="82" width="15" height="30" rx="6" fill="#8D97A3"/>
    <rect x="76" y="82" width="15" height="30" rx="6" fill="#8D97A3"/><rect x="92" y="80" width="15" height="32" rx="6" fill="#98A2AE"/></g>
    <ellipse cx="66" cy="66" rx="42" ry="31" fill="#A7B0BC"/>
    <path d="M42 41 Q66 33 88 41 L84 74 Q66 81 46 74Z" fill="#E8792B"/>
    <path d="M45 70 Q66 77 85 70" fill="none" stroke="#F3C34A" stroke-width="4"/>
    <circle cx="56" cy="57" r="3" fill="#F3C34A" stroke="none"/><circle cx="66" cy="54" r="3" fill="#F3C34A" stroke="none"/><circle cx="76" cy="57" r="3" fill="#F3C34A" stroke="none"/>
    <circle cx="106" cy="52" r="25" fill="#A7B0BC"/>
    <g class="a-trunk"><path d="M121 60 Q136 72 132 96 Q130 104 123 101 Q125 90 120 77 Q116 70 110 68Z" fill="#A7B0BC"/></g>
    <path d="M118 71 Q125 80 118 85 Q116 79 113 74Z" fill="#FFF8E7"/>
    <g class="a-ear"><ellipse cx="92" cy="56" rx="13" ry="19" fill="#BCC4CF"/></g>
    <path d="M104 27 q4 -8 8 0 q-4 6 -8 0Z" fill="#E8792B"/>
    <circle cx="112" cy="46" r="3.3" fill="${INK}" stroke="none"/><circle cx="116" cy="56" r="4" fill="#F4A7A0" stroke="none"/></g></svg>`,

  lion: () => {
    const pts = Array.from({ length: 28 }, (_, k) => { const a = k * Math.PI / 14, r = k % 2 ? 36 : 45; return `${(60 + r * Math.cos(a)).toFixed(1)},${(52 + r * Math.sin(a)).toFixed(1)}`; }).join(' ');
    return `<svg viewBox="0 0 120 124" class="ani lion" aria-hidden="true"><g ${OUT}>
    <ellipse cx="60" cy="102" rx="30" ry="18" fill="#F2B544"/>
    <ellipse cx="44" cy="114" rx="9" ry="6" fill="#F7C866"/><ellipse cx="76" cy="114" rx="9" ry="6" fill="#F7C866"/>
    <g class="a-mane"><polygon points="${pts}" fill="#C9681E"/></g>
    <circle cx="41" cy="32" r="8" fill="#F2B544"/><circle cx="79" cy="32" r="8" fill="#F2B544"/>
    <circle cx="60" cy="55" r="27" fill="#F2B544"/>
    <ellipse cx="60" cy="66" rx="13" ry="10" fill="#FBE3A8"/>
    <path d="M55 59 h10 l-5 6Z" fill="#6B3A1A"/>
    <path class="a-mouth" d="M52 70 Q60 78 68 70" fill="#8E2C1C"/></g>
    <g class="a-eye"><circle cx="50" cy="50" r="3.6" fill="${INK}"/><circle cx="70" cy="50" r="3.6" fill="${INK}"/><circle cx="51" cy="49" r="1.1" fill="#fff"/><circle cx="71" cy="49" r="1.1" fill="#fff"/></g>
    <circle cx="44" cy="61" r="4" fill="#F49A7C"/><circle cx="76" cy="61" r="4" fill="#F49A7C"/></svg>`;
  },

  peacock: () => {
    const fan = Array.from({ length: 9 }, (_, k) => { const a = (-160 + k * 17.5) * Math.PI / 180, x = 70 + 56 * Math.cos(a), y = 92 + 56 * Math.sin(a);
      return `<path d="M70 92 L${x.toFixed(1)} ${y.toFixed(1)}" stroke="#3F9B4A" stroke-width="3"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="10" fill="#2E8B57" ${OUT}/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="6" fill="#1E88E5"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.8" fill="#0D2A6B"/>`; }).join('');
    return `<svg viewBox="0 0 140 124" class="ani peacock" aria-hidden="true"><g class="a-fan">${fan}</g><g ${OUT}>
    <path d="M62 116 l-3 6 M76 116 l3 6" fill="none"/>
    <path d="M70 70 Q90 84 82 112 Q70 120 58 112 Q50 84 70 70Z" fill="#1565C0"/>
    <path d="M70 76 Q76 60 74 44" fill="none" stroke="#1976D2" stroke-width="9"/>
    <circle cx="76" cy="40" r="9" fill="#1976D2"/>
    <path d="M84 40 l8 2 -8 3Z" fill="#E8792B"/>
    <path d="M73 31 l-3 -9 M77 31 v-10 M81 32 l3 -9" fill="none" stroke-width="2"/></g>
    <circle cx="70" cy="22" r="2.6" fill="#1E88E5"/><circle cx="77" cy="20" r="2.6" fill="#1E88E5"/><circle cx="84" cy="23" r="2.6" fill="#1E88E5"/>
    <ellipse cx="78" cy="38" rx="3.5" ry="2.5" fill="#fff"/><circle cx="78.6" cy="38" r="1.6" fill="${INK}"/></svg>`;
  },

  tortoise: () => `<svg viewBox="0 0 130 96" class="ani tortoise" aria-hidden="true"><g ${OUT}>
    <g class="a-legs"><ellipse cx="34" cy="74" rx="9" ry="7" fill="#A8D27A"/><ellipse cx="86" cy="74" rx="9" ry="7" fill="#A8D27A"/></g>
    <path d="M14 62 l-8 3" fill="none"/>
    <g class="a-head"><circle cx="110" cy="56" r="12" fill="#A8D27A"/><path d="M107 62 Q112 65 116 61" fill="none" stroke-width="2"/></g>
    <path d="M18 64 Q20 20 60 17 Q100 20 102 64Z" fill="#5E9C3A"/>
    <path d="M40 30 l10 -6 h20 l10 6 v14 l-10 8 h-20 l-10 -8Z M30 50 l10 -6 M90 50 l-10 -6 M60 52 v12" fill="none" stroke="#3F7A24" stroke-width="2.2"/>
    <rect x="12" y="60" width="96" height="10" rx="5" fill="#8DBF5A"/></g>
    <circle cx="113" cy="52" r="2.4" fill="${INK}"/></svg>`,

  owl: () => `<svg viewBox="0 0 110 124" class="ani owl" aria-hidden="true"><g ${OUT}>
    <rect x="10" y="110" width="90" height="8" rx="4" fill="#8A5A2B"/>
    <path d="M28 30 L34 12 L44 26Z M82 30 L76 12 L66 26Z" fill="#7A4F2A"/>
    <ellipse cx="55" cy="68" rx="32" ry="40" fill="#9C6B3F"/>
    <g class="a-wing"><path d="M24 62 Q10 84 28 100 Q30 80 30 64Z" fill="#7A4F2A"/><path d="M86 62 Q100 84 82 100 Q80 80 80 64Z" fill="#7A4F2A"/></g>
    <ellipse cx="55" cy="82" rx="19" ry="22" fill="#E8D3B0"/>
    <path d="M46 76 l4 4 4 -4 4 4 4 -4 M46 88 l4 4 4 -4 4 4 4 -4" fill="none" stroke="#B8946A" stroke-width="2"/>
    <circle cx="42" cy="52" r="13" fill="#FFF4D6"/><circle cx="68" cy="52" r="13" fill="#FFF4D6"/>
    <path d="M55 58 l-5 2 5 8 5 -8Z" fill="#E8792B"/>
    <path d="M44 107 v6 M50 107 v6 M60 107 v6 M66 107 v6" fill="none" stroke="#E8792B" stroke-width="3"/>
    <path d="M30 22 L55 10 L80 22 L55 32Z" fill="#16295F"/><path d="M80 22 v12" fill="none" stroke="#F3C34A" stroke-width="2.4"/><circle cx="80" cy="36" r="3" fill="#F3C34A"/></g>
    <g class="a-eye"><circle cx="43" cy="53" r="6" fill="${INK}"/><circle cx="67" cy="53" r="6" fill="${INK}"/><circle cx="45" cy="51" r="2" fill="#fff"/><circle cx="69" cy="51" r="2" fill="#fff"/></g></svg>`,
};
const RMo = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
const pick = a => a[Math.floor(Math.random() * a.length)];

// Mithu the parrot sits beside every "Mithu says" note
document.documentElement.style.setProperty('--parrot', `url("data:image/svg+xml;utf8,${encodeURIComponent(ANIMALS.parrot().replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" '))}")`);

// ── pop-up friend ──
let petTimer = null;
function petPop(kind, html, ms = 4800) {
  let el = document.getElementById('pet');
  if (!el) { el = document.createElement('div'); el.id = 'pet'; el.setAttribute('role', 'status'); el.setAttribute('aria-live', 'polite'); document.body.appendChild(el); }
  el.className = 'pet ' + kind; el.innerHTML = `<div class="pet-bub">${html}<button class="pet-x" aria-label="${T('Close')}">×</button></div>${ANIMALS[kind]()}`;
  requestAnimationFrame(() => el.classList.add('on'));
  clearTimeout(petTimer); petTimer = setTimeout(() => el.classList.remove('on'), ms);
}
document.addEventListener('click', e => { if (e.target.closest('.pet-x')) document.getElementById('pet').classList.remove('on'); });

// ── things that appear as you scroll, a tip half-way down, a cheer at the end ──
const DYK = () => DB.opening.trivia;
let dykI = Math.floor(Math.random() * 50), pageFlags = {};
const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(x => {
  if (!x.isIntersecting) return; const el = x.target;
  if (el.classList.contains('rv')) { el.classList.add('in'); io.unobserve(el); }
  if (el.classList.contains('endcard') && !pageFlags.end && LEVEL !== 3) {
    pageFlags.end = true; const m = DB.modules.findIndex(m => m.id === location.hash.slice(1));
    if (m > -1) petPop(LEVEL === 1 ? 'parrot' : 'elephant', `<b>${LANG === 'hi' ? `शाबाश! तुमने अध्याय ${m + 1} पूरा किया।` : `Well done! You finished Chapter ${m + 1}.`}</b> ${LEVEL === 1 ? T('Now play the picture quiz!') : T('Test yourself before you move on.')}`);
  }
  if (el.classList.contains('tipmark') && !pageFlags.tip && LEVEL === 2) {
    pageFlags.tip = true; const t = DYK()[dykI++ % DYK().length];
    petPop(pick(['peacock', 'owl', 'elephant']), `<b>${T('Did you know?')}</b> ${esc(t.text)}`, 7000);
  }
}), { threshold: .25 }) : null;
function decorate() {
  pageFlags = {};
  if (!io) return;
  const kids = [...document.querySelectorAll('#app .wrap > *, #app .kgrid > li, #app .pgrid > *, #app .tl > li, #app .chapters > *')];
  kids.forEach((el, i) => { if (!RMo() && el.getBoundingClientRect().top > innerHeight * .9) { el.classList.add('rv'); el.style.setProperty('--d', `${(i % 3) * 70}ms`); io.observe(el); } });
  const top = [...document.querySelectorAll('#app .wrap > *')]; if (top.length > 6) { const mid = top[Math.floor(top.length / 2)]; mid.classList.add('tipmark'); io.observe(mid); }
  const end = document.querySelector('#app .endcard'); if (end) io.observe(end);
}
new MutationObserver(decorate).observe(document.getElementById('app'), { childList: true });

// ── quiz cheers ──
document.addEventListener('click', e => {
  const t = e.target.closest('[data-mark],[data-pick]'); if (!t) return;
  setTimeout(() => {
    const right = t.dataset.mark !== undefined ? t.dataset.mark === '1' : (run && run.qs[run.i] && run.qs[run.i].opts[run.picked] === run.qs[run.i].a);
    petPop(right ? 'lion' : 'tortoise', right ? `<b>${T('Roar-some!')}</b> ${T('That’s right.')}` : `<b>${T('Slow and steady!')}</b> ${T('You will get the next one.')}`, 2400);
  }, 60);
});
function confetti() {
  const c = document.createElement('div'); c.className = 'confetti';
  c.innerHTML = Array.from({ length: 22 }, (_, k) => `<i style="--x:${Math.random() * 100}vw;--r:${Math.random() * 360}deg;--d:${Math.random() * .4}s;background:${['#E8792B', '#138808', '#1E3A8A', '#F3C34A'][k % 4]}"></i>`).join('');
  document.body.appendChild(c); setTimeout(() => c.remove(), 1800);
}

// full marks: a short burst of tricolour confetti with the lion
new MutationObserver(() => { const d = document.querySelector('#app .done b'); if (d && !d.dataset.cheered) { d.dataset.cheered = 1; const [a, b] = d.textContent.split('/').map(Number);
  if (a === b && b > 0) { if (!RMo()) confetti(); petPop('lion', `<b>${T('Roar-some!')}</b> ${T('Full marks.')}`, 3500); } } }).observe(document.getElementById('app'), { childList: true });
decorate();
