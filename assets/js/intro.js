/* =========================================================
   Intro: vídeo controlado pelo scroll (sequência de quadros)
   ========================================================= */
(function () {
  'use strict';

  var VERSION = 'v3';      // pasta dos quadros: troque ao trocar o vídeo
  var FRAMES = 145;        // quadros exportados do vídeo
  var FPS = 24;            // taxa original do vídeo
  var VIDEO_END = 0.9;     // fração do scroll em que o vídeo termina
  var VEIL_FROM = 0.84;    // início do fade para o site
  var VEIL_TO = 0.95;

  var section = document.getElementById('topo');
  var canvas = document.getElementById('introCanvas');
  if (!section || !canvas) return;
  var ctx = canvas.getContext('2d');

  var veil = document.getElementById('introVeil');
  var hint = document.getElementById('introHint');
  var bar = document.getElementById('introBar');
  var time = document.getElementById('introTime');
  var loadLabel = document.getElementById('introLoad');
  var copies = Array.prototype.slice.call(section.querySelectorAll('.intro__copy'));

  var portrait = window.matchMedia('(max-aspect-ratio: 1/1)');
  var set = portrait.matches ? 'mobile' : 'desktop';
  var images = [];
  var loaded = 0;
  var generation = 0;

  var target = 0;
  var current = 0;
  var drawn = -1;
  var progress = 0;
  var ticking = false;

  function src(i) {
    return 'assets/frames/' + VERSION + '/' + set + '/f' + String(i + 1).padStart(3, '0') + '.webp';
  }

  /* Ordem de carregamento progressiva: primeiro quadros espaçados,
     depois os intermediários, para o scroll funcionar logo de cara. */
  function loadOrder() {
    var order = [];
    var seen = {};
    [32, 16, 8, 4, 2, 1].forEach(function (step) {
      for (var i = 0; i < FRAMES; i += step) {
        if (!seen[i]) { seen[i] = 1; order.push(i); }
      }
    });
    if (!seen[FRAMES - 1]) order.push(FRAMES - 1);
    return order;
  }

  function loadFrames() {
    var gen = ++generation;
    images = new Array(FRAMES);
    loaded = 0;
    drawn = -1;
    var queue = loadOrder();
    var active = 0;
    var MAX = 6;

    function next() {
      if (gen !== generation) return;
      while (active < MAX && queue.length) {
        (function (i) {
          active++;
          var img = new Image();
          img.decoding = 'async';
          img.onload = function () {
            if (gen !== generation) return;
            images[i] = img;
            loaded++;
            active--;
            if (loadLabel) {
              loadLabel.textContent = loaded < FRAMES
                ? 'Carregando ' + Math.round((loaded / FRAMES) * 100) + '%'
                : 'Rua 26';
            }
            if (i === 0 || Math.abs(i - Math.round(current)) < 3) render(true);
            next();
          };
          img.onerror = function () { active--; next(); };
          img.src = src(i);
        })(queue.shift());
      }
    }
    next();
  }

  function nearest(i) {
    if (images[i]) return images[i];
    for (var d = 1; d < FRAMES; d++) {
      if (images[i - d]) return images[i - d];
      if (images[i + d]) return images[i + d];
    }
    return null;
  }

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = canvas.clientWidth;
    var h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    drawn = -1;
    render(true);
  }

  function drawFrame(i) {
    var img = nearest(i);
    if (!img) return;
    var cw = canvas.width;
    var ch = canvas.height;
    var s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    var w = img.naturalWidth * s;
    var h = img.naturalHeight * s;
    ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
  }

  function render(force) {
    var i = Math.max(0, Math.min(FRAMES - 1, Math.round(current)));
    if (i !== drawn || force) {
      drawFrame(i);
      drawn = i;
    }
  }

  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
  function smooth(a, b, v) { var t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); }

  function updateOverlays(p) {
    copies.forEach(function (el, idx) {
      var from = parseFloat(el.dataset.from);
      var to = parseFloat(el.dataset.to);
      var fade = 0.05;
      var o = idx === 0
        ? 1 - smooth(to - fade, to, p)
        : smooth(from, from + fade, p) * (1 - smooth(to - fade, to, p));
      el.style.opacity = o.toFixed(3);
      el.style.transform = 'translate3d(0,' + ((1 - o) * (p > to - 0.05 ? -24 : 24)).toFixed(1) + 'px,0)';
      el.style.visibility = o < 0.01 ? 'hidden' : 'visible';
    });

    if (hint) hint.style.opacity = (1 - smooth(0, 0.06, p)).toFixed(3);
    if (bar) bar.style.width = (clamp(p / VIDEO_END, 0, 1) * 100).toFixed(2) + '%';
    if (time) {
      var sec = Math.floor((clamp(p / VIDEO_END, 0, 1) * (FRAMES - 1)) / FPS);
      time.textContent = '00:0' + sec + ' / 00:0' + Math.round(FRAMES / FPS);
    }
    var v = smooth(VEIL_FROM, VEIL_TO, p);
    if (veil) veil.style.opacity = v.toFixed(3);

    var rect = section.getBoundingClientRect();
    var inIntro = rect.bottom > 1 && v < 0.5;
    document.body.classList.toggle('is-intro', inIntro);
  }

  function measure() {
    var rect = section.getBoundingClientRect();
    var total = section.offsetHeight - window.innerHeight;
    progress = clamp(-rect.top / total, 0, 1);
    target = clamp(progress / VIDEO_END, 0, 1) * (FRAMES - 1);
    updateOverlays(progress);
  }

  function loop() {
    var diff = target - current;
    current = Math.abs(diff) < 0.05 ? target : current + diff * 0.2;
    render(false);
    if (current !== target) {
      requestAnimationFrame(loop);
    } else {
      ticking = false;
    }
  }

  function onScroll() {
    measure();
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(loop);
    }
  }

  function onOrientation() {
    var next = portrait.matches ? 'mobile' : 'desktop';
    if (next !== set) {
      set = next;
      loadFrames();
    }
    resize();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onOrientation);

  resize();
  measure();
  current = target;
  loadFrames();
})();
