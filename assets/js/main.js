/* =========================================================
   Titanium Import's — loja
   ========================================================= */
(function () {
  'use strict';

  /* ------------------------------------------------------------
   * CONFIGURAÇÃO DA LOJA — edite aqui
   * ------------------------------------------------------------ */
  var CONFIG = {
    whatsapp: '',        // DDI + DDD + número, só dígitos. Ex.: '5511999998888'
    instagram: '',       // URL completa do perfil
    tiktok: '',          // URL completa do perfil
    hours: '',           // Ex.: 'Seg. a sáb., 9h às 19h' ('' esconde)
    installments: 6      // máximo de parcelas exibido
  };

  /* ------------------------------------------------------------
   * Catálogo — troque nomes, preços, cores e fotos pelos reais.
   * Cada cor é ['Nome', '#hex', 'foto-opcional.webp']. Se a cor tiver
   * foto própria, a imagem do produto troca ao selecionar a cor.
   * ------------------------------------------------------------ */
  var TOPS = ['P', 'M', 'G', 'GG'];
  var BOTTOMS = ['38', '40', '42', '44', '46'];

  var CATEGORIES = [
    { id: 'casacos', name: 'Casacos' },
    { id: 'moletons', name: 'Moletons' },
    { id: 'camisetas', name: 'Camisetas' },
    { id: 'polos', name: 'Polos' },
    { id: 'camisas', name: 'Camisas' },
    { id: 'calcas', name: 'Calças' },
    { id: 'acessorios', name: 'Acessórios' },
    { id: 'calcados', name: 'Calçados' }
  ];

  // Categorias em destaque (com foto)
  var FEATURED = [
    { id: 'casacos', img: 'assets/img/produto-1.webp' },
    { id: 'moletons', img: 'assets/img/produto-2.webp' },
    { id: 'camisas', img: 'assets/img/produto-5.webp' },
    { id: 'calcados', img: 'assets/img/produto-8.webp' }
  ];

  var PRODUCTS = [
    { id: 'p1', cat: 'casacos', name: 'Jaqueta Puffer Alpine', price: 599.9, tag: 'Novo', img: 'assets/img/produto-1.webp', sizes: TOPS,
      colors: [['Preto', '#161616'], ['Verde-oliva', '#4f5139'], ['Areia', '#cbbfa8']] },
    { id: 'p2', cat: 'moletons', name: 'Moletom Canguru Heavy', price: 299.9, old: 349.9, img: 'assets/img/produto-2.webp', sizes: TOPS,
      colors: [['Chumbo', '#4a4a4c'], ['Preto', '#161616'], ['Off-white', '#ece7dc']] },
    { id: 'p3', cat: 'camisetas', name: 'Camiseta Heavyweight', price: 139.9, img: 'assets/img/produto-3.webp', sizes: TOPS,
      colors: [['Off-white', '#ece7dc'], ['Preto', '#161616'], ['Cinza mescla', '#9a9a98']] },
    { id: 'p4', cat: 'polos', name: 'Polo Piquet', price: 189.9, img: 'assets/img/produto-4.webp', sizes: TOPS,
      colors: [['Marinho', '#1c2540'], ['Branco', '#f4f2ee'], ['Preto', '#161616']] },
    { id: 'p5', cat: 'camisas', name: 'Camisa Oxford Button-Down', price: 229.9, img: 'assets/img/produto-5.webp', sizes: TOPS,
      colors: [['Azul', '#a9c1df'], ['Branco', '#f4f2ee'], ['Rosa', '#e8cfd2']] },
    { id: 'p6', cat: 'calcas', name: 'Calça Jeans Slim Indigo', price: 279.9, img: 'assets/img/produto-6.webp', sizes: BOTTOMS,
      colors: [['Indigo', '#1f2a44'], ['Preto', '#161616']] },
    { id: 'p7', cat: 'acessorios', name: 'Boné Six-Panel', price: 109.9, img: 'assets/img/produto-7.webp', sizes: ['Único'],
      colors: [['Preto', '#161616'], ['Marinho', '#1c2540'], ['Bege', '#d8cdb8']] },
    { id: 'p8', cat: 'calcados', name: 'Tênis Court Couro', price: 449.9, tag: 'Novo', img: 'assets/img/produto-8.webp', sizes: ['39', '40', '41', '42', '43'],
      colors: [['Branco', '#f4f2ee']] }
  ];

  /* ------------------------------------------------------------ */

  var byId = {};
  PRODUCTS.forEach(function (p) { byId[p.id] = p; });
  var catName = {};
  CATEGORIES.forEach(function (c) { catName[c.id] = c.name; });

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var brl = function (v) { return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  var toastTimer;
  function toast(msg) {
    var t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2600);
  }

  function waURL(text) {
    return (CONFIG.whatsapp ? 'https://wa.me/' + CONFIG.whatsapp : 'https://wa.me/') + '?text=' + encodeURIComponent(text);
  }

  /* ---------- Categorias ---------- */
  function renderCats() {
    $('#cats').innerHTML = FEATURED.map(function (f) {
      var n = PRODUCTS.filter(function (p) { return p.cat === f.id; }).length;
      return '<button class="cat rv" data-cat="' + f.id + '">' +
        '<div class="cat__img"><img src="' + f.img + '" alt="" loading="lazy" width="880" height="1100"></div>' +
        '<div class="cat__label">' + catName[f.id] + '<small>' + n + (n === 1 ? ' peça' : ' peças') + '</small></div>' +
        '</button>';
    }).join('');
    $$('.cat').forEach(function (b) {
      b.addEventListener('click', function () {
        setFilter(b.dataset.cat);
        $('#novidades').scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  /* ---------- Filtros e grade ---------- */
  var filter = 'todos';

  function renderTabs() {
    var used = CATEGORIES.filter(function (c) { return PRODUCTS.some(function (p) { return p.cat === c.id; }); });
    var tabs = [{ id: 'todos', name: 'Todos' }].concat(used);
    $('#tabs').innerHTML = tabs.map(function (c) {
      return '<button class="tab" role="tab" data-f="' + c.id + '" aria-selected="' + (c.id === filter) + '">' + c.name + '</button>';
    }).join('');
    $$('.tab').forEach(function (t) { t.addEventListener('click', function () { setFilter(t.dataset.f); }); });
  }

  function setFilter(f) {
    filter = f;
    $$('.tab').forEach(function (t) { t.setAttribute('aria-selected', t.dataset.f === f); });
    renderGrid();
  }

  function card(p, i) {
    var c0 = p.colors[0];
    return '<article class="card" data-id="' + p.id + '" data-color="0" style="animation-delay:' + i * 50 + 'ms">' +
      '<div class="card__media">' +
        '<img src="' + p.img + '" alt="' + esc(p.name) + '" loading="lazy" width="880" height="1100">' +
        (p.tag ? '<span class="card__tag">' + p.tag + '</span>' : '') +
        '<div class="card__quick"><p>Adicionar à sacola</p><div class="sizes">' +
          p.sizes.map(function (s) { return '<button class="size" data-s="' + s + '" aria-label="Adicionar tamanho ' + s + '">' + s + '</button>'; }).join('') +
        '</div></div>' +
      '</div>' +
      '<div class="card__info">' +
        '<div class="card__row"><h3 class="card__name">' + p.name + '</h3>' +
          '<span class="card__price">' + (p.old ? '<s>' + brl(p.old) + '</s>' : '') + brl(p.price) + '</span></div>' +
        '<div class="card__row"><span class="card__sub card__color">' + c0[0] + '</span>' +
          (p.colors.length > 1 ? '<div class="dots">' + p.colors.map(function (c, k) {
            return '<button class="dot" style="--c:' + c[1] + '" data-k="' + k + '" aria-label="Cor ' + c[0] + '" aria-pressed="' + (k === 0) + '"></button>';
          }).join('') + '</div>' : '') +
        '</div>' +
      '</div>' +
    '</article>';
  }

  function renderGrid() {
    var list = filter === 'todos' ? PRODUCTS : PRODUCTS.filter(function (p) { return p.cat === filter; });
    $('#grid').innerHTML = list.map(card).join('');
    $('#shopCount').textContent = list.length + (list.length === 1 ? ' produto' : ' produtos');

    $$('.card').forEach(function (el) {
      var p = byId[el.dataset.id];
      $$('.dot', el).forEach(function (d) {
        d.addEventListener('click', function () {
          el.dataset.color = d.dataset.k;
          $$('.dot', el).forEach(function (x) { x.setAttribute('aria-pressed', x === d); });
          var c = p.colors[+d.dataset.k];
          $('.card__color', el).textContent = c[0];
          $('.card__media img', el).src = c[2] || p.img;
        });
      });
      $$('.size', el).forEach(function (b) {
        b.addEventListener('click', function () { add(p.id, +el.dataset.color, b.dataset.s); });
      });
    });
  }

  /* ---------- Sacola ---------- */
  var KEY = 'titanium_bag_v2';
  var bag = [];

  function load() {
    try {
      var d = JSON.parse(localStorage.getItem(KEY) || '[]');
      bag = Array.isArray(d) ? d.filter(function (i) { return byId[i.id]; }) : [];
    } catch (e) { bag = []; }
  }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(bag)); } catch (e) { /* sem armazenamento */ } }

  function add(id, color, size) {
    var hit = bag.find(function (i) { return i.id === id && i.color === color && i.size === size; });
    if (hit) hit.qty++;
    else bag.push({ id: id, color: color, size: size, qty: 1 });
    save();
    renderBag();
    var b = $('#bagOpen');
    b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump');
    var p = byId[id];
    toast(p.name + ' · ' + p.colors[color][0] + ' · ' + size + ' adicionado');
  }

  function total() { return bag.reduce(function (s, i) { return s + byId[i.id].price * i.qty; }, 0); }

  function renderBag() {
    var count = bag.reduce(function (s, i) { return s + i.qty; }, 0);
    $('#bagCount').textContent = count;
    $('#bagHeadCount').textContent = count ? '(' + count + ')' : '';

    var box = $('#bagItems');
    if (!bag.length) {
      box.innerHTML = '<div class="bag__empty"><p>Sua sacola está vazia.</p><a href="#novidades" class="link-arrow js-close">Ver novidades</a></div>';
    } else {
      box.innerHTML = bag.map(function (i, idx) {
        var p = byId[i.id];
        var c = p.colors[i.color] || p.colors[0];
        return '<div class="line">' +
          '<div class="line__img"><img src="' + (c[2] || p.img) + '" alt=""></div>' +
          '<div><div class="line__top"><span>' + p.name + '</span><span>' + brl(p.price * i.qty) + '</span></div>' +
          '<p class="line__meta">' + c[0] + ' · Tam. ' + i.size + '</p>' +
          '<div class="line__ctrl"><div class="qty">' +
            '<button data-i="' + idx + '" data-d="-1" aria-label="Diminuir quantidade">−</button><span>' + i.qty + '</span>' +
            '<button data-i="' + idx + '" data-d="1" aria-label="Aumentar quantidade">+</button></div>' +
          '<button class="line__rm" data-i="' + idx + '">Remover</button></div></div>' +
          '</div>';
      }).join('');
    }
    var t = total();
    $('#bagTotal').textContent = brl(t);
    $('#bagNote').textContent = t && CONFIG.installments > 1
      ? 'Em até ' + CONFIG.installments + 'x de ' + brl(t / CONFIG.installments) + ' no cartão. Frete calculado no atendimento.'
      : 'Frete calculado no atendimento.';
    $('#checkout').disabled = !bag.length;

    $$('.qty button', box).forEach(function (b) {
      b.addEventListener('click', function () {
        var it = bag[+b.dataset.i];
        it.qty += +b.dataset.d;
        if (it.qty < 1) bag.splice(+b.dataset.i, 1);
        save(); renderBag();
      });
    });
    $$('.line__rm', box).forEach(function (b) {
      b.addEventListener('click', function () { bag.splice(+b.dataset.i, 1); save(); renderBag(); });
    });
    $$('.js-close', box).forEach(function (a) { a.addEventListener('click', closeBag); });
  }

  var lastFocus;
  function openBag() {
    lastFocus = document.activeElement;
    var s = $('#scrim');
    s.hidden = false;
    requestAnimationFrame(function () { s.classList.add('show'); });
    $('#bag').classList.add('open');
    $('#bag').setAttribute('aria-hidden', 'false');
    document.body.classList.add('lock');
    $('#bagClose').focus();
  }
  function closeBag() {
    var s = $('#scrim');
    s.classList.remove('show');
    setTimeout(function () { s.hidden = true; }, 350);
    $('#bag').classList.remove('open');
    $('#bag').setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lock');
    if (lastFocus) lastFocus.focus();
  }

  function checkout() {
    if (!bag.length) return;
    var lines = bag.map(function (i) {
      var p = byId[i.id];
      var c = p.colors[i.color] || p.colors[0];
      return '- ' + i.qty + 'x ' + p.name + ' (' + c[0] + ', ' + i.size + ') — ' + brl(p.price * i.qty);
    });
    var msg = 'Olá! Gostaria de fazer este pedido:\n\n' + lines.join('\n') +
      '\n\nSubtotal: ' + brl(total()) + '\n\nMeu CEP para o frete: ';
    window.open(waURL(msg), '_blank', 'noopener');
  }

  /* ---------- Menu, links e animações ---------- */
  function setupMenu() {
    var btn = $('#menuOpen');
    var nav = $('#mnav');
    function set(open) {
      nav.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open);
      document.body.classList.toggle('menu-open', open);
    }
    btn.addEventListener('click', function () { set(!nav.classList.contains('open')); });
    $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { set(false); }); });
  }

  function setupLinks() {
    $$('.js-wa').forEach(function (a) {
      a.href = waURL(a.dataset.msg || 'Olá!');
      a.target = '_blank';
      a.rel = 'noopener';
    });
    $$('.js-social').forEach(function (a) {
      var url = CONFIG[a.dataset.network];
      if (url) { a.href = url; a.target = '_blank'; a.rel = 'noopener'; }
      else a.addEventListener('click', function (e) { e.preventDefault(); toast('Em breve'); });
    });
    var h = $('#hours');
    if (CONFIG.hours) h.textContent = CONFIG.hours; else h.remove();
    $('#year').textContent = new Date().getFullYear();
  }

  function setupReveal() {
    var targets = $$('.lead .h-xl, .lead__text, .sec-head, .edit__card, .service__item, .split__img, .split__text').concat($$('.rv'));
    targets.forEach(function (el) { el.classList.add('rv'); });
    if (!('IntersectionObserver' in window)) { targets.forEach(function (el) { el.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    targets.forEach(function (el, i) {
      if (el.classList.contains('cat') || el.classList.contains('service__item')) {
        el.style.transitionDelay = (i % 4) * 80 + 'ms';
      }
      io.observe(el);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderCats();
    renderTabs();
    renderGrid();
    load();
    renderBag();
    setupLinks();
    setupMenu();
    setupReveal();

    $('#bagOpen').addEventListener('click', openBag);
    $('#bagClose').addEventListener('click', closeBag);
    $('#scrim').addEventListener('click', closeBag);
    $('#checkout').addEventListener('click', checkout);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && $('#bag').classList.contains('open')) closeBag();
    });
  });
})();
