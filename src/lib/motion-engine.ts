/**
 * The brand motion engine, as plain JavaScript inlined in <head>.
 *
 * Why inline and not a React component: it has to start before any JS bundle
 * arrives (on a slow 3G connection the bundles take seconds), and the switch
 * transitions must survive the root layout remounting when the language
 * changes. So it lives on `window.__ifMotion` and only touches:
 *   - #preloader, server-rendered as the first thing in <body>;
 *   - one overlay element it creates itself for the switch transitions.
 *
 * Paths and timing follow the design system (Motion): i → f → crossbar,
 * writing 1.2s, a sky nib on the pen tip, the clay dot lands and pulses once,
 * erasing runs the same path backwards.
 *
 * Events on window:
 *   "if:reveal" → the cover starts opening; entrance animations may start.
 *   "if:done"   → the cover is gone.
 * window.__ifBusy is true while a cover is on screen.
 */
const engine = String.raw`
(function () {
  if (window.__ifMotion) return;
  var doc = document, root = doc.documentElement;
  var reduce = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  var STROKES = [
    { d: 'M28 78 V46', t: 170 },
    { d: 'M80 18 Q62 18 62 36 V82 Q62 96 48 96 H36', t: 360 },
    { d: 'M46 48 H78', t: 160 }
  ];
  var SVG = '<svg viewBox="0 0 100 106" class="if-mark" aria-hidden="true">' +
    '<g fill="none" stroke-width="11" stroke-linecap="round" stroke-linejoin="round">' +
    STROKES.map(function (s) { return '<path data-stroke pathLength="1" stroke-dasharray="1" d="' + s.d + '"/>'; }).join('') +
    '</g><circle data-nib r="3.2" cx="28" cy="78"/><circle data-dot cx="28" cy="27" r="7.5"/></svg>';

  function inOut(t) { return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
  function outCubic(t) { return 1 - Math.pow(1 - t, 3); }
  function inCubic(t) { return t * t * t; }
  function tween(ms, fn, ease) {
    ease = ease || inOut;
    return new Promise(function (done) {
      if (ms <= 0) { fn(1); done(); return; }
      var start = performance.now();
      function frame(now) {
        var p = Math.min(1, (now - start) / ms);
        fn(ease(p));
        if (p < 1) requestAnimationFrame(frame); else done();
      }
      requestAnimationFrame(frame);
    });
  }
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function emit(name) { try { window.dispatchEvent(new Event(name)); } catch (e) {} }

  function Mark(svg) {
    this.paths = [].slice.call(svg.querySelectorAll('[data-stroke]'));
    this.nib = svg.querySelector('[data-nib]');
    this.dot = svg.querySelector('[data-dot]');
    this.len = this.paths.map(function (p) { return p.getTotalLength(); });
  }
  Mark.prototype.setDot = function (scale, y) {
    // transform-box: fill-box + origin center (CSS) keep the dot on the i.
    this.dot.style.transform = 'translate(0px,' + y + 'px) scale(' + scale + ')';
  };
  Mark.prototype.reset = function () {
    this.paths.forEach(function (p) { p.style.strokeDashoffset = '1'; });
    this.nib.style.opacity = '0';
    this.setDot(0, -18);
  };
  Mark.prototype.full = function () {
    this.paths.forEach(function (p) { p.style.strokeDashoffset = '0'; });
    this.nib.style.opacity = '0';
    this.setDot(1, 0);
  };
  Mark.prototype.write = function () {
    var self = this, chain = Promise.resolve();
    self.paths.forEach(function (p, i) {
      chain = chain.then(function () {
        self.nib.style.opacity = '1';
        return tween(STROKES[i].t, function (v) {
          p.style.strokeDashoffset = String(1 - v);
          var pt = p.getPointAtLength(self.len[i] * v);
          self.nib.setAttribute('cx', pt.x);
          self.nib.setAttribute('cy', pt.y);
        });
      });
    });
    return chain.then(function () { self.nib.style.opacity = '0'; return self.drop(); });
  };
  // The dot drops onto the i, lands a little big, settles, pulses once.
  Mark.prototype.drop = function () {
    var self = this;
    return tween(140, function (v) { self.setDot(1.2 * v, -18 * (1 - v)); }, inCubic)
      .then(function () { return tween(90, function (v) { self.setDot(1.2 - 0.2 * v, 0); }); })
      .then(function () { return wait(40); })
      .then(function () { return tween(110, function (v) { self.setDot(1 + 0.26 * v, 0); }); })
      .then(function () { return tween(130, function (v) { self.setDot(1.26 - 0.26 * v, 0); }); });
  };
  // While the page is still loading: the dot keeps hopping on the i, so the
  // visitor sees it's alive. Resolves after the hop that ends past ready().
  Mark.prototype.idle = function (ready) {
    var self = this;
    function hop() {
      if (ready()) return Promise.resolve();
      return tween(280, function (v) { self.setDot(1, -9 * v); }, outCubic)
        .then(function () { return tween(260, function (v) { self.setDot(1, -9 * (1 - v)); }, inCubic); })
        .then(function () { return tween(90, function (v) { self.setDot(1 + 0.14 * v, 0); }); })
        .then(function () { return tween(110, function (v) { self.setDot(1.14 - 0.14 * v, 0); }); })
        .then(function () { return wait(120); })
        .then(hop);
    }
    return hop();
  };
  // Erase backwards: dot first, then crossbar, f, i.
  Mark.prototype.erase = function (ms) {
    var self = this, share = [0.3, 0.5, 0.2];
    var chain = tween(ms * 0.25, function (v) { self.setDot(1 - v, 0); });
    [2, 1, 0].forEach(function (i) {
      chain = chain.then(function () {
        return tween(ms * share[i], function (v) { self.paths[i].style.strokeDashoffset = String(v); }, inCubic);
      });
    });
    return chain;
  };

  function clip(el, x, y, r) {
    var v = 'circle(' + Math.max(0, r) + 'px at ' + x + 'px ' + y + 'px)';
    el.style.clipPath = v; el.style.webkitClipPath = v;
  }
  function cover(x, y) {
    var w = innerWidth, h = innerHeight;
    return Math.ceil(Math.max(Math.hypot(x, y), Math.hypot(w - x, y), Math.hypot(x, h - y), Math.hypot(w - x, h - y))) + 4;
  }

  // ---------------------------------------------------------------- preloader
  function preload() {
    var el = doc.getElementById('preloader');
    if (!el || el.__started) return;
    el.__started = true;
    var mark = new Mark(el.querySelector('svg'));
    var loaded = doc.readyState === 'complete';
    var started = Date.now();
    window.addEventListener('load', function () { loaded = true; });
    function whenLoaded() {
      return loaded ? Promise.resolve() : new Promise(function (r) { window.addEventListener('load', r, { once: true }); setTimeout(r, 15000); });
    }
    function finish() {
      el.style.display = 'none';
      root.classList.remove('pl-active');
      window.__ifBusy = false;
      emit('if:done');
      // A later remount of the layout (language switch) must not show it again.
      var s = doc.createElement('style'); s.textContent = '#preloader{display:none!important}'; doc.head.appendChild(s);
    }
    if (reduce) {
      mark.full();
      return whenLoaded().then(function () {
        emit('if:reveal');
        return tween(250, function (v) { el.style.opacity = String(1 - v); });
      }).then(finish);
    }
    mark.reset();
    // Write once; if the page isn't ready yet, keep the dot alive instead of
    // writing again.
    function cycle() {
      return mark.write()
        .then(function () { return mark.idle(function () { return loaded || Date.now() - started > 15000; }); })
        .then(exit);
    }
    // Close the screen into the dot.
    function exit() {
      var r = mark.dot.getBoundingClientRect();
      var x = r.left + r.width / 2, y = r.top + r.height / 2, R = cover(x, y);
      return wait(60).then(function () { return mark.erase(220); })
        .then(function () { emit('if:reveal'); return tween(480, function (v) { clip(el, x, y, R * (1 - v)); }, inCubic); })
        .then(finish);
    }
    cycle();
  }

  // ---------------------------------------------------------------- switch transition
  var overlay;
  function getOverlay() {
    if (overlay && overlay.isConnected) return overlay;
    overlay = doc.createElement('div');
    overlay.className = 'if-cover';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = SVG;
    doc.body.appendChild(overlay);
    return overlay;
  }
  /**
   * o = { x, y, colors: { bg, ink, clay, sky }, run: () => Promise }
   * The circle grows from (x, y), the mark is written while run() switches
   * the page underneath, then the circle closes back into (x, y).
   */
  function transition(o) {
    if (window.__ifBusy) return Promise.resolve(false);
    if (reduce) return Promise.resolve(o.run()).then(function () { return true; });
    window.__ifBusy = true;
    var el = getOverlay(), c = o.colors || {};
    el.style.setProperty('--c-bg', c.bg || 'var(--bg)');
    el.style.setProperty('--c-ink', c.ink || 'var(--ink)');
    el.style.setProperty('--c-clay', c.clay || 'var(--clay)');
    el.style.setProperty('--c-sky', c.sky || 'var(--sky)');
    var mark = new Mark(el.querySelector('svg'));
    mark.reset();
    var x = o.x, y = o.y, R = cover(x, y);
    clip(el, x, y, 0);
    el.style.display = 'flex';
    return tween(420, function (v) { clip(el, x, y, R * v); })
      .then(function () {
        var switched = Promise.resolve().then(o.run).catch(function () {});
        return Promise.all([switched, mark.write()]);
      })
      .then(function () { return wait(60); })
      .then(function () { return mark.erase(220); })
      .then(function () { emit('if:reveal'); return tween(420, function (v) { clip(el, x, y, R * (1 - v)); }); })
      .then(function () {
        el.style.display = 'none';
        window.__ifBusy = false;
        emit('if:done');
        return true;
      });
  }

  // ---------------------------------------------------------------- theme
  // The saved choice ("light" | "dark" | "system") lives in localStorage
  // under "theme"; the resolved value is the data-theme attribute on <html>.
  var media = window.matchMedia ? matchMedia('(prefers-color-scheme: dark)') : null;
  function resolve(t) { return t === 'dark' || (t !== 'light' && media && media.matches) ? 'dark' : 'light'; }
  function savedTheme() { try { return localStorage.getItem('theme') || 'system'; } catch (e) { return 'system'; } }
  function applyTheme() { root.setAttribute('data-theme', resolve(savedTheme())); }
  function setTheme(t) { try { localStorage.setItem('theme', t); } catch (e) {} applyTheme(); }
  applyTheme();
  if (media && media.addEventListener) media.addEventListener('change', function () { if (savedTheme() === 'system') applyTheme(); });
  // Keep the attribute if React re-renders <html> (it doesn't own it).
  new MutationObserver(function () {
    if (!root.getAttribute('data-theme')) applyTheme();
  }).observe(root, { attributes: true, attributeFilter: ['data-theme'] });

  window.__ifMotion = { preload: preload, transition: transition, reduce: reduce, setTheme: setTheme };

  // Start the preloader the moment its markup is parsed.
  if (doc.getElementById('preloader')) preload();
  else {
    var watch = new MutationObserver(function () {
      if (doc.getElementById('preloader')) { watch.disconnect(); preload(); }
    });
    watch.observe(root, { childList: true, subtree: true });
  }
  // A preloader runs on every page load; until it ends, entrances wait.
  window.__ifBusy = true;
  root.classList.add('pl-active');
  // Safety net: if the preloader never starts, don't keep the page waiting.
  setTimeout(function () {
    var el = doc.getElementById('preloader');
    if (!el || !el.__started) {
      if (el) el.style.display = 'none';
      window.__ifBusy = false; root.classList.remove('pl-active');
      emit('if:reveal'); emit('if:done');
    }
  }, 4000);
})();
`;

/** Minimal whitespace trim; the code is small and readable as is. */
export const MOTION_ENGINE_SCRIPT = engine.replace(/\n\s*/g, "\n").trim();

