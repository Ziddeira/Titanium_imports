/*
 * Titanium Import's — logo desenhada 100% em JavaScript (Canvas 2D).
 *
 * Uso:
 *   const logo = TitaniumLogo.mount(document.querySelector('canvas'), { animate: true });
 *   logo.stop();                         // para a animação
 *   TitaniumLogo.toPNG(2048);            // retorna dataURL PNG em alta resolução
 *
 * Todas as medidas estão num sistema de coordenadas lógico de 1100 x 1100,
 * com origem no centro do círculo (raio 500).
 */
(function (global) {
  'use strict';

  var SIZE = 1100;
  var R = 500;
  var TAU = Math.PI * 2;

  var FONT_TITLE = '"Playfair Display", Georgia, "Times New Roman", serif';

  /* ------------------------------------------------------------------ */
  /* Utilidades                                                          */
  /* ------------------------------------------------------------------ */

  function makeCanvas(w, h) {
    var c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    return c;
  }

  function goldGradient(ctx, y0, y1) {
    var g = ctx.createLinearGradient(0, y0, 0, y1);
    g.addColorStop(0.0, '#fff7cf');
    g.addColorStop(0.22, '#f8db7c');
    g.addColorStop(0.45, '#e0ad3c');
    g.addColorStop(0.6, '#a86f1b');
    g.addColorStop(0.78, '#eac25a');
    g.addColorStop(1.0, '#8e5c15');
    return g;
  }

  function star(ctx, cx, cy, r) {
    ctx.beginPath();
    for (var i = 0; i < 10; i++) {
      var rad = i % 2 === 0 ? r : r * 0.4;
      var a = -Math.PI / 2 + (i * Math.PI) / 5;
      var x = cx + rad * Math.cos(a);
      var y = cy + rad * Math.sin(a);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  }

  /** Espiral que começa no raio externo (ângulo a0) e se enrola para dentro. */
  function spiralPath(ctx, cx, cy, r0, turns, a0, dir, moveFirst) {
    var steps = Math.ceil(turns * 64);
    for (var i = 0; i <= steps; i++) {
      var t = i / steps;
      var a = a0 + dir * t * turns * TAU;
      var r = r0 * (1 - 0.82 * t);
      var x = cx + r * Math.cos(a);
      var y = cy + r * Math.sin(a);
      if (i === 0 && moveFirst !== false) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
  }

  /** Traço dourado com contorno escuro (dá relevo e separa sobreposições). */
  function goldStroke(ctx, buildPath, width, y0, y1) {
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    buildPath(ctx);
    ctx.strokeStyle = '#2b1a05';
    ctx.lineWidth = width + 3;
    ctx.stroke();
    ctx.strokeStyle = goldGradient(ctx, y0, y1);
    ctx.lineWidth = width;
    ctx.stroke();
    ctx.restore();
  }

  function goldFill(ctx, buildPath, y0, y1) {
    ctx.save();
    ctx.beginPath();
    buildPath(ctx);
    ctx.fillStyle = goldGradient(ctx, y0, y1);
    ctx.fill();
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = 'rgba(60, 36, 6, 0.9)';
    ctx.stroke();
    ctx.restore();
  }

  /* ------------------------------------------------------------------ */
  /* Bandeiras                                                           */
  /* ------------------------------------------------------------------ */

  function makeFlag(w, h) {
    var c = makeCanvas(w, h);
    var x = c.getContext('2d');
    var sh = h / 13;
    for (var i = 0; i < 13; i++) {
      x.fillStyle = i % 2 ? '#ffffff' : '#c8202f';
      x.fillRect(0, Math.floor(i * sh), w, Math.ceil(sh) + 1);
    }
    var cw = w * 0.42;
    var ch = sh * 7;
    x.fillStyle = '#26306e';
    x.fillRect(0, 0, cw, ch);
    x.fillStyle = '#ffffff';
    for (var row = 0; row < 9; row++) {
      var n = row % 2 ? 5 : 6;
      for (var k = 0; k < n; k++) {
        var sx = (cw / 12) * (row % 2 ? 2 + 2 * k : 1 + 2 * k);
        var sy = (ch / 10) * (row + 1);
        star(x, sx, sy, (ch / 10) * 0.46);
      }
    }
    return c;
  }

  /**
   * Desenha a bandeira ondulando. A "tralha" (lado do mastro) fica em (hx, hy)
   * e a bandeira se estende na direção dir (+1 direita, -1 esquerda).
   */
  function drawFlag(ctx, flag, shaded, o, phase) {
    var N = 260;
    var fw = flag.width;
    var fh = flag.height;

    // 1) aplica sombreamento das dobras numa cópia da bandeira
    var s = shaded.getContext('2d');
    s.globalCompositeOperation = 'source-over';
    s.clearRect(0, 0, fw, fh);
    s.drawImage(flag, 0, 0);
    var g = s.createLinearGradient(0, 0, fw, 0);
    for (var j = 0; j <= 24; j++) {
      var u = j / 24;
      var env = Math.pow(u, 0.75);
      var slope = Math.cos(u * TAU * 1.25 - phase) * env;
      var c = slope > 0
        ? 'rgba(255,255,255,' + (0.22 * slope).toFixed(3) + ')'
        : 'rgba(0,0,0,' + (-0.5 * slope).toFixed(3) + ')';
      g.addColorStop(u, c);
    }
    s.globalCompositeOperation = 'source-atop';
    s.fillStyle = g;
    s.fillRect(0, 0, fw, fh);
    // leve escurecimento na ponta (profundidade)
    var g2 = s.createLinearGradient(0, 0, fw, 0);
    g2.addColorStop(0, 'rgba(0,0,0,0)');
    g2.addColorStop(1, 'rgba(0,0,0,0.25)');
    s.fillStyle = g2;
    s.fillRect(0, 0, fw, fh);

    // 2) desenha em fatias verticais deslocadas pela onda
    var sw = fw / N;
    var w = o.L / N;
    for (var i = 0; i < N; i++) {
      var um = (i + 0.5) / N;
      var e = Math.pow(um, 0.75);
      var yoff = o.drop * um + o.amp * e * Math.sin(um * TAU * 1.25 - phase);
      var h = o.H * (1 - 0.12 * um);
      var x0 = o.hx + o.dir * (i / N) * o.L;
      var dx = o.dir > 0 ? x0 : x0 - w;
      var top = o.hy + yoff + (o.H - h) * 0.5;
      ctx.drawImage(shaded, i * sw, 0, sw, fh, dx - 0.6, top, w + 1.2, h);
    }
  }

  /* ------------------------------------------------------------------ */
  /* Elementos dourados                                                  */
  /* ------------------------------------------------------------------ */

  function drawCrown(ctx) {
    var top = -245;
    var bottom = -58;

    goldFill(ctx, function (c) {
      // corpo da coroa
      c.moveTo(-112, -100);
      c.bezierCurveTo(-118, -150, -150, -175, -168, -206); // chifre esquerdo (lado externo)
      c.bezierCurveTo(-120, -205, -92, -185, -72, -158);   // desce até o vale esquerdo
      c.bezierCurveTo(-50, -180, -18, -200, 0, -232);      // sobe ao pico central
      c.bezierCurveTo(18, -200, 50, -180, 72, -158);       // vale direito
      c.bezierCurveTo(92, -185, 120, -205, 168, -206);     // chifre direito
      c.bezierCurveTo(150, -175, 118, -150, 112, -100);
      c.closePath();
    }, top, bottom);

    // faixa (base)
    goldFill(ctx, function (c) {
      c.moveTo(-124, -104);
      c.quadraticCurveTo(0, -116, 124, -104);
      c.lineTo(120, -66);
      c.quadraticCurveTo(0, -78, -120, -66);
      c.closePath();
    }, -116, -60);

    // friso fino da base
    goldFill(ctx, function (c) {
      c.moveTo(-118, -64);
      c.quadraticCurveTo(0, -76, 118, -64);
      c.lineTo(116, -54);
      c.quadraticCurveTo(0, -66, -116, -54);
      c.closePath();
    }, -76, -50);

    // aberturas circulares (como no original)
    ctx.save();
    ctx.fillStyle = '#050505';
    [[-74, -132], [74, -132]].forEach(function (p) {
      ctx.beginPath();
      ctx.arc(p[0], p[1], 12, 0, TAU);
      ctx.fill();
    });
    ctx.restore();

    // esferas nas pontas
    [[0, -240, 11], [-172, -210, 9], [172, -210, 9]].forEach(function (b) {
      goldFill(ctx, function (c) { c.arc(b[0], b[1], b[2], 0, TAU); }, b[1] - b[2], b[1] + b[2]);
    });

    // brilho central na faixa
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 245, 200, 0.55)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-110, -97);
    ctx.quadraticCurveTo(0, -108, 110, -97);
    ctx.stroke();
    ctx.restore();
  }

  function drawSideScroll(ctx) {
    var y0 = -50, y1 = 50;
    // haste principal
    goldStroke(ctx, function (c) {
      c.moveTo(-238, 26);
      c.bezierCurveTo(-292, 44, -330, 2, -372, 10);
      c.bezierCurveTo(-404, 16, -420, 22, -446, 18);
    }, 7, y0, y1);
    // voluta grande junto ao texto
    goldStroke(ctx, function (c) {
      spiralPath(c, -262, -4, 30, 1.35, Math.PI / 2, 1);
    }, 7, y0, y1);
    // voluta superior
    goldStroke(ctx, function (c) {
      spiralPath(c, -342, -20, 24, 1.3, Math.PI * 0.55, -1);
    }, 6, y0, y1);
    // voluta da ponta
    goldStroke(ctx, function (c) {
      spiralPath(c, -432, 1, 17, 1.3, Math.PI / 2, 1);
    }, 5, y0, y1);
    // voluta inferior
    goldStroke(ctx, function (c) {
      spiralPath(c, -306, 42, 14, 1.2, -Math.PI / 2, -1);
    }, 5, y0, y1);
    // pequenas folhas
    [[-388, -6, -0.6], [-292, -38, 0.5]].forEach(function (l) {
      ctx.save();
      ctx.translate(l[0], l[1]);
      ctx.rotate(l[2]);
      goldFill(ctx, function (c) {
        c.moveTo(-14, 0);
        c.quadraticCurveTo(0, -9, 14, 0);
        c.quadraticCurveTo(0, 9, -14, 0);
      }, -9, 9);
      ctx.restore();
    });
  }

  function drawTitle(ctx) {
    var text = 'TITANIUM';
    var fontSize = 136;
    var baseline = 48;
    var targetW = 452;
    ctx.save();
    ctx.font = '900 ' + fontSize + 'px ' + FONT_TITLE;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    var mw = ctx.measureText(text).width;
    var sx = targetW / mw;
    ctx.translate(0, baseline);
    ctx.scale(sx, 1);
    // sombra/relevo
    ctx.fillStyle = '#2b1904';
    ctx.fillText(text, 3, 4);
    // ouro
    ctx.fillStyle = goldGradient(ctx, -98, 2);
    ctx.fillText(text, 0, 0);
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'rgba(70, 42, 8, 0.95)';
    ctx.strokeText(text, 0, 0);
    ctx.restore();
  }

  function drawDivider(ctx) {
    var y = 64;
    // barra que afina nas pontas
    goldFill(ctx, function (c) {
      c.moveTo(-432, y);
      c.quadraticCurveTo(0, y - 9, 432, y);
      c.quadraticCurveTo(0, y + 9, -432, y);
      c.closePath();
    }, y - 6, y + 6);
    // pontas de lança
    [-1, 1].forEach(function (dir) {
      var x = dir * 428;
      goldFill(ctx, function (c) {
        c.moveTo(x + dir * 50, y);
        c.quadraticCurveTo(x + dir * 26, y - 6, x + dir * 14, y - 12);
        c.lineTo(x, y);
        c.lineTo(x + dir * 14, y + 12);
        c.quadraticCurveTo(x + dir * 26, y + 6, x + dir * 50, y);
        c.closePath();
      }, y - 12, y + 12);
      goldFill(ctx, function (c) { c.arc(x - dir * 8, y, 5, 0, TAU); }, y - 5, y + 5);
    });
  }

  function drawSubtitle(ctx) {
    var text = 'IMPORT’S';
    var fontSize = 90;
    var baseline = 160;
    var targetW = 440;
    var spacing = fontSize * 0.14;
    ctx.save();
    ctx.font = '700 ' + fontSize + 'px ' + FONT_TITLE;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    var chars = text.split('');
    var widths = chars.map(function (ch) { return ctx.measureText(ch).width; });
    var total = widths.reduce(function (a, b) { return a + b; }, 0) + spacing * (chars.length - 1);
    var sx = targetW / total;
    ctx.translate(-targetW / 2, baseline);
    ctx.scale(sx, 1);
    var grad = goldGradient(ctx, -66, 2);
    var pass = function (style, dx, dy, stroke) {
      var x = 0;
      for (var i = 0; i < chars.length; i++) {
        if (stroke) ctx.strokeText(chars[i], x + dx, dy);
        else ctx.fillText(chars[i], x + dx, dy);
        x += widths[i] + spacing;
      }
    };
    ctx.fillStyle = '#2b1904';
    pass(null, 3, 3, false);
    ctx.fillStyle = grad;
    pass(null, 0, 0, false);
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = 'rgba(70, 42, 8, 0.95)';
    pass(null, 0, 0, true);
    ctx.restore();

    // traços laterais "·—  IMPORT'S  —·"
    var y = 126;
    [-1, 1].forEach(function (dir) {
      goldFill(ctx, function (c) {
        c.moveTo(dir * 252, y);
        c.lineTo(dir * 290, y - 4);
        c.lineTo(dir * 326, y);
        c.lineTo(dir * 290, y + 4);
        c.closePath();
      }, y - 4, y + 4);
      goldFill(ctx, function (c) { c.arc(dir * 342, y, 5, 0, TAU); }, y - 5, y + 5);
    });
  }

  function drawBottomFlourish(ctx) {
    var y0 = 160, y1 = 265;
    // enfeite central (gota)
    goldFill(ctx, function (c) {
      c.moveTo(0, 204);
      c.bezierCurveTo(16, 222, 14, 240, 0, 262);
      c.bezierCurveTo(-14, 240, -16, 222, 0, 204);
      c.closePath();
    }, 204, 262);
    goldFill(ctx, function (c) { c.arc(0, 192, 8, 0, TAU); }, 184, 200);

    [1, -1].forEach(function (m) {
      ctx.save();
      ctx.scale(m, 1);
      goldStroke(ctx, function (c) {
        c.moveTo(-14, 214);
        c.bezierCurveTo(-60, 238, -112, 186, -160, 202);
        c.bezierCurveTo(-200, 214, -232, 190, -266, 180);
      }, 6, y0, y1);
      goldStroke(ctx, function (c) {
        spiralPath(c, -58, 196, 18, 1.3, Math.PI * 0.5, -1);
      }, 5, y0, y1);
      goldStroke(ctx, function (c) {
        spiralPath(c, -146, 224, 16, 1.3, -Math.PI * 0.5, 1);
      }, 5, y0, y1);
      goldStroke(ctx, function (c) {
        spiralPath(c, -214, 182, 14, 1.3, Math.PI * 0.5, -1);
      }, 4.5, y0, y1);
      goldStroke(ctx, function (c) {
        spiralPath(c, -270, 170, 10, 1.2, Math.PI * 0.5, 1);
      }, 4, y0, y1);
      // folhinha
      ctx.save();
      ctx.translate(-104, 220);
      ctx.rotate(0.35);
      goldFill(ctx, function (c) {
        c.moveTo(-11, 0);
        c.quadraticCurveTo(0, -7, 11, 0);
        c.quadraticCurveTo(0, 7, -11, 0);
      }, -7, 7);
      ctx.restore();
      ctx.restore();
    });
  }

  function drawGoldLayer(ctx) {
    drawCrown(ctx);
    drawSideScroll(ctx);
    ctx.save();
    ctx.scale(-1, 1);
    drawSideScroll(ctx);
    ctx.restore();
    drawTitle(ctx);
    drawDivider(ctx);
    drawSubtitle(ctx);
    drawBottomFlourish(ctx);
  }

  /* ------------------------------------------------------------------ */
  /* Renderizador                                                        */
  /* ------------------------------------------------------------------ */

  function Renderer(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.px = canvas.width;
    this.scale = this.px / SIZE;
    this.flag = makeFlag(840, 440);
    this.shaded = makeCanvas(840, 440);
    this.gold = makeCanvas(this.px, this.px);
    this.shine = makeCanvas(this.px, this.px);
    var g = this.gold.getContext('2d');
    this.applyTransform(g);
    drawGoldLayer(g);
  }

  Renderer.prototype.applyTransform = function (c) {
    c.setTransform(this.scale, 0, 0, this.scale, this.px / 2, this.px / 2);
  };

  Renderer.prototype.render = function (phase, shinePos) {
    var ctx = this.ctx;
    ctx.imageSmoothingQuality = 'high';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, this.px, this.px);
    this.applyTransform(ctx);

    // fundo circular preto
    ctx.save();
    ctx.beginPath();
    ctx.arc(0, 0, R, 0, TAU);
    var bg = ctx.createRadialGradient(0, -60, 20, 0, 0, R);
    bg.addColorStop(0, '#141414');
    bg.addColorStop(1, '#000000');
    ctx.fillStyle = bg;
    ctx.fill();
    ctx.clip();

    // bandeiras (atrás da coroa)
    var base = { hy: -250, L: 372, H: 158, drop: 82, amp: 15 };
    drawFlag(ctx, this.flag, this.shaded,
      { hx: -92, hy: base.hy, dir: -1, L: base.L, H: base.H, drop: base.drop, amp: base.amp }, phase);
    drawFlag(ctx, this.flag, this.shaded,
      { hx: 92, hy: base.hy, dir: 1, L: base.L, H: base.H, drop: base.drop, amp: base.amp }, phase + 0.4);

    // camada dourada com sombra sobre as bandeiras
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.shadowColor = 'rgba(0,0,0,0.75)';
    ctx.shadowBlur = 14 * this.scale;
    ctx.shadowOffsetY = 4 * this.scale;
    ctx.drawImage(this.gold, 0, 0);
    ctx.shadowColor = 'transparent';

    // brilho que percorre o dourado
    if (shinePos != null) {
      var s = this.shine.getContext('2d');
      s.setTransform(1, 0, 0, 1, 0, 0);
      s.globalCompositeOperation = 'source-over';
      s.clearRect(0, 0, this.px, this.px);
      s.drawImage(this.gold, 0, 0);
      s.globalCompositeOperation = 'source-atop';
      this.applyTransform(s);
      var g = s.createLinearGradient(shinePos - 140, -140, shinePos + 140, 140);
      g.addColorStop(0, 'rgba(255,255,235,0)');
      g.addColorStop(0.5, 'rgba(255,255,235,0.7)');
      g.addColorStop(1, 'rgba(255,255,235,0)');
      s.fillStyle = g;
      s.fillRect(-SIZE / 2, -SIZE / 2, SIZE, SIZE);
      ctx.drawImage(this.shine, 0, 0);
    }
    ctx.restore();
  };

  /* ------------------------------------------------------------------ */
  /* API pública                                                         */
  /* ------------------------------------------------------------------ */

  function fontsReady() {
    if (!document.fonts || !document.fonts.load) return Promise.resolve();
    var loads = Promise.all([
      document.fonts.load('900 136px "Playfair Display"'),
      document.fonts.load('700 90px "Playfair Display"')
    ]);
    var timeout = new Promise(function (res) { setTimeout(res, 2500); });
    return Promise.race([loads, timeout]).catch(function () {});
  }

  function sizeCanvas(canvas) {
    var dpr = global.devicePixelRatio || 1;
    var css = canvas.clientWidth || 512;
    var px = Math.round(css * dpr);
    canvas.width = px;
    canvas.height = px;
  }

  function mount(canvas, opts) {
    opts = opts || {};
    var reduce = global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var animate = opts.animate !== false && !reduce;
    var renderer = null;
    var raf = 0;
    var stopped = false;

    function build() {
      sizeCanvas(canvas);
      renderer = new Renderer(canvas);
    }

    function frame(t) {
      if (stopped) return;
      var sec = t / 1000;
      var cycle = (sec % 5) / 5; // brilho a cada 5 s
      var shine = cycle < 0.4 ? -900 + (cycle / 0.4) * 1800 : null;
      renderer.render(sec * 2.2, shine);
      raf = global.requestAnimationFrame(frame);
    }

    fontsReady().then(function () {
      build();
      if (animate) raf = global.requestAnimationFrame(frame);
      else renderer.render(0.6, null);
    });

    var onResize = function () {
      if (!renderer) return;
      build();
      if (!animate) renderer.render(0.6, null);
    };
    global.addEventListener('resize', onResize);

    return {
      stop: function () {
        stopped = true;
        global.cancelAnimationFrame(raf);
        global.removeEventListener('resize', onResize);
      }
    };
  }

  /** Renderiza uma imagem estática em alta resolução e devolve um dataURL PNG. */
  function toPNG(px) {
    var c = makeCanvas(px || 2048, px || 2048);
    new Renderer(c).render(0.6, null);
    return c.toDataURL('image/png');
  }

  global.TitaniumLogo = { mount: mount, toPNG: toPNG, fontsReady: fontsReady };
})(window);
