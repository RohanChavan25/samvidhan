// ── LANGUAGE LAYER ── (loaded after data.js, before app.js)
// HI maps each English display string to its Hindi version. English is the master; a missing Hindi string falls back to English.
// The choice is saved per viewer (localStorage) and applied on load, so every renderer works unchanged.
const LANG = (() => { try { return localStorage.getItem('sqp:lang') === 'hi' ? 'hi' : 'en'; } catch (e) { return 'en'; } })();
const T = s => (LANG === 'hi' && HI[s] != null) ? HI[s] : s;
function setLang(l) { try { localStorage.setItem('sqp:lang', l); } catch (e) {} location.reload(); }
(function () {
  if (LANG !== 'hi') return;
  document.documentElement.lang = 'hi';
  // keys that hold ids, file paths, links or teacher-only notes: never translated
  const SKIP = new Set(['id', 'src', 'url', 'img', 'pic', 'face', 'vig', 'art', 'scene', 'poster', 'person', 'people', 'groups', 'kind', 'type', 'ref',
    'link', 'aliases', 'memberPage', 'profileSrc', 'srcText', 'chair', 'topic', 'chapterArt', 'hero', 'frontis', 'coverSrc', 'fit', 'from', 'status', 'sort', 'lv']);
  const TOP_SKIP = new Set(['sources', 'images', 'meta', 'scenesAvailable', 'i18n']);
  const walk = o => {
    if (Array.isArray(o)) { o.forEach((v, i) => { if (typeof v === 'string') o[i] = T(v); else walk(v); }); return; }
    if (!o || typeof o !== 'object') return;
    for (const k of Object.keys(o)) {
      if (SKIP.has(k)) continue;
      const v = o[k];
      if (typeof v === 'string') o[k] = T(v); else walk(v);
    }
    // where a card shows a Hindi subtitle, show the English original instead (the quiz itself is in English)
    for (const k of ['title', 'name']) if (typeof o[k] === 'string' && typeof o.hi === 'string' && HI_REV[o[k]] !== undefined) { o.en = HI_REV[o[k]]; o.hi = HI_REV[o[k]]; break; }
  };
  const HI_REV = {}; for (const [e, h] of Object.entries(HI)) HI_REV[h] = e;
  for (const k of Object.keys(DB)) if (!TOP_SKIP.has(k)) walk(DB[k]);
})();
