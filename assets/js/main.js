/* =========================================================
   Titanium Import's — interações do site
   ========================================================= */
(function () {
  'use strict';

  /* ------------------------------------------------------------
   * CONFIGURAÇÃO DA LOJA — edite aqui
   * ------------------------------------------------------------ */
  var CONFIG = {
    // Número do WhatsApp com DDI + DDD, só dígitos. Ex.: '5511999998888'
    whatsapp: '',
    // Links das redes sociais
    tiktok: '',
    instagram: '',
    // Horário de atendimento exibido no rodapé (deixe '' para esconder)
    hours: '',
    // Máximo de parcelas exibido nos produtos e na sacola
    installments: 6
  };

  /* ------------------------------------------------------------
   * Ilustrações vetoriais das peças (cor controlada por --c)
   * ------------------------------------------------------------ */
  var LINE = 'fill="none" stroke="rgba(0,0,0,.38)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
  var LIGHT = 'fill="none" stroke="rgba(255,255,255,.22)" stroke-width="1.6" stroke-linecap="round"';
  var STITCH = 'fill="none" stroke="rgba(227,181,74,.65)" stroke-width="1.3" stroke-dasharray="3 3" stroke-linecap="round"';

  function fillPath(d, extra) {
    return '<path d="' + d + '" style="fill:var(--c)" stroke="rgba(0,0,0,.45)" stroke-width="1.5" stroke-linejoin="round"/>' +
      '<path d="' + d + '" fill="url(#shade)"/>' + (extra || '');
  }
  function crown(cx, cy, s) {
    s = s || 1;
    var pts = [[-12, 8], [-14, -6], [-6, -1], [0, -11], [6, -1], [14, -6], [12, 8]];
    var d = 'M' + pts.map(function (p) { return (cx + p[0] * s).toFixed(1) + ' ' + (cy + p[1] * s).toFixed(1); }).join(' L') + ' Z';
    return '<path d="' + d + '" fill="url(#goldGrad)" stroke="rgba(80,50,10,.6)" stroke-width=".8"/>';
  }
  function starPath(cx, cy, r) {
    var d = '';
    for (var i = 0; i < 10; i++) {
      var rad = i % 2 ? r * 0.42 : r;
      var a = -Math.PI / 2 + i * Math.PI / 5;
      d += (i ? 'L' : 'M') + (cx + rad * Math.cos(a)).toFixed(1) + ' ' + (cy + rad * Math.sin(a)).toFixed(1);
    }
    return '<path d="' + d + 'Z" fill="url(#goldGrad)"/>';
  }

  var GARMENTS = {
    tshirt: function () {
      var body = 'M72 28 L44 38 L14 66 L34 92 L50 82 L50 178 Q100 184 150 178 L150 82 L166 92 L186 66 L156 38 L128 28 Q100 52 72 28 Z';
      return fillPath(body) +
        '<path d="M72 28 Q100 42 128 28 Q100 52 72 28 Z" fill="rgba(0,0,0,.4)"/>' +
        '<path d="M70 29 Q100 58 130 29" ' + LINE + ' stroke-width="4"/>' +
        '<path d="M34 92 L50 82 M166 92 L150 82 M52 172 Q100 178 148 172" ' + LINE + '/>' +
        '<path d="M60 60 Q64 120 58 170" ' + LIGHT + '/>' +
        crown(100, 96, 1.1);
    },
    polo: function () {
      var body = 'M74 28 L44 38 L14 66 L34 92 L50 82 L50 178 Q100 184 150 178 L150 82 L166 92 L186 66 L156 38 L126 28 Q100 36 74 28 Z';
      return fillPath(body) +
        '<rect x="95" y="36" width="10" height="44" rx="2" ' + LINE + '/>' +
        '<circle cx="100" cy="50" r="2.4" fill="rgba(255,255,255,.75)"/><circle cx="100" cy="66" r="2.4" fill="rgba(255,255,255,.75)"/>' +
        fillPath('M70 27 L100 37 L90 60 L64 40 Z') +
        fillPath('M130 27 L100 37 L110 60 L136 40 Z') +
        '<path d="M30 86 L47 76 M170 86 L153 76" ' + LINE + '/>' +
        '<path d="M60 60 Q64 120 58 170" ' + LIGHT + '/>' +
        crown(130, 86, 0.6);
    },
    shirt: function () {
      var body = 'M74 26 L46 36 Q28 44 24 72 L14 168 L36 172 L50 96 L50 180 Q100 186 150 180 L150 96 L164 172 L186 168 L176 72 Q172 44 154 36 L126 26 Q100 34 74 26 Z';
      var btns = [62, 88, 114, 140, 166].map(function (y) {
        return '<circle cx="100" cy="' + y + '" r="2.3" fill="rgba(255,255,255,.8)" stroke="rgba(0,0,0,.3)" stroke-width=".6"/>';
      }).join('');
      return fillPath(body) +
        '<path d="M100 36 V183 M16 156 L37 160 M184 156 L163 160 M118 70 h20 v20 q-10 4 -20 0 z" ' + LINE + '/>' +
        btns +
        fillPath('M74 26 L100 36 L88 56 L66 36 Z') +
        fillPath('M126 26 L100 36 L112 56 L134 36 Z') +
        '<path d="M58 60 Q62 120 56 172" ' + LIGHT + '/>';
    },
    hoodie: function () {
      var body = 'M74 30 L46 40 Q28 48 24 76 L14 168 L36 172 L50 100 L50 178 Q100 184 150 178 L150 100 L164 172 L186 168 L176 76 Q172 48 154 40 L126 30 Q100 50 74 30 Z';
      return '<path d="M64 36 Q62 4 100 4 Q138 4 136 36 Z" style="fill:var(--c)" stroke="rgba(0,0,0,.45)" stroke-width="1.5"/>' +
        '<path d="M64 36 Q62 4 100 4 Q138 4 136 36 Z" fill="rgba(0,0,0,.28)"/>' +
        fillPath(body) +
        '<path d="M74 30 Q100 60 126 30 Q100 40 74 30 Z" fill="rgba(0,0,0,.5)"/>' +
        '<path d="M92 48 L90 82 M108 48 L110 82" fill="none" stroke="rgba(255,255,255,.8)" stroke-width="2.4" stroke-linecap="round"/>' +
        '<path d="M66 128 Q100 122 134 128 L142 166 Q100 170 58 166 Z M52 170 Q100 176 148 170 M16 156 L37 160 M184 156 L163 160" ' + LINE + '/>' +
        crown(100, 106, 1.1);
    },
    jeans: function () {
      var body = 'M58 22 H142 L154 182 H110 L100 84 L90 182 H46 Z';
      return fillPath(body) +
        '<path d="M58 34 H142 M100 34 V84 M72 22 V36 M128 22 V36 M60 38 Q68 58 86 36 M140 38 Q132 58 114 36" ' + LINE + '/>' +
        '<path d="M100 36 Q108 60 101 78 M62 42 L52 176 M138 42 L148 176 M48 172 H90 M110 172 H152" ' + STITCH + '/>' +
        '<circle cx="100" cy="28" r="3.2" fill="url(#goldGrad)"/>' +
        '<path d="M70 50 Q72 120 64 176" ' + LIGHT + '/>';
    },
    shorts: function () {
      var body = 'M56 40 H144 L156 146 H108 L100 96 L92 146 H44 Z';
      return fillPath(body) +
        '<path d="M56 52 H144 M100 52 V96 M58 56 Q66 74 82 54 M142 56 Q134 74 118 54 M70 40 V54 M130 40 V54" ' + LINE + '/>' +
        '<path d="M46 136 H91 M109 136 H154 M100 54 Q107 74 101 90" ' + STITCH + '/>' +
        '<circle cx="100" cy="46" r="3.2" fill="url(#goldGrad)"/>';
    },
    cap: function () {
      return fillPath('M44 120 Q44 52 100 50 Q156 52 156 120 Z') +
        '<path d="M100 52 V118 M74 58 Q64 88 68 118 M126 58 Q136 88 132 118" ' + LINE + '/>' +
        fillPath('M34 118 Q100 104 166 118 L174 136 Q100 154 26 136 Z') +
        '<path d="M34 118 Q100 104 166 118 L174 136 Q100 154 26 136 Z" fill="rgba(0,0,0,.22)"/>' +
        '<path d="M38 128 Q100 114 162 128" ' + STITCH + '/>' +
        '<circle cx="100" cy="50" r="5" style="fill:var(--c)" stroke="rgba(0,0,0,.45)"/>' +
        crown(100, 88, 1.5);
    },
    sneaker: function () {
      var upper = 'M18 140 Q16 122 34 118 L76 110 Q92 106 102 94 L114 80 Q126 72 142 76 L164 82 Q174 86 176 100 L180 122 Q186 132 186 142 Z';
      return fillPath(upper) +
        '<path d="M114 80 Q138 92 164 82 Q150 74 142 76 Q126 72 114 80 Z" fill="rgba(0,0,0,.55)"/>' +
        '<path d="M18 132 Q22 120 44 118 M150 96 Q166 112 182 126 M92 108 Q130 120 172 112" ' + LINE + '/>' +
        '<path d="M88 104 L98 112 M96 96 L106 105 M104 88 L114 97 M112 81 L121 90" fill="none" stroke="rgba(255,255,255,.9)" stroke-width="3" stroke-linecap="round"/>' +
        '<path d="M88 104 L98 112 M96 96 L106 105 M104 88 L114 97 M112 81 L121 90" fill="none" stroke="rgba(0,0,0,.25)" stroke-width="1" stroke-linecap="round"/>' +
        '<path d="M12 140 H190 Q192 156 180 160 H24 Q10 158 12 140 Z" fill="#ece7dc" stroke="rgba(0,0,0,.35)" stroke-width="1.5"/>' +
        '<path d="M14 149 H189" fill="none" stroke="rgba(0,0,0,.18)" stroke-width="1.5"/>' +
        starPath(138, 120, 9);
    }
  };

  function garmentSVG(type, color, label) {
    var aria = label ? ' role="img" aria-label="' + label + '"' : ' aria-hidden="true"';
    return '<svg viewBox="0 0 200 200" style="--c:' + color + '"' + aria + '>' + GARMENTS[type]() + '</svg>';
  }

  /* ------------------------------------------------------------
   * Catálogo (preços e nomes de exemplo — ajuste à sua loja)
   * ------------------------------------------------------------ */
  var CATEGORIES = [
    { id: 'camisetas', name: 'Camisetas', garment: 'tshirt', color: '#151515' },
    { id: 'polos', name: 'Polos', garment: 'polo', color: '#1d2a5a' },
    { id: 'camisas', name: 'Camisas', garment: 'shirt', color: '#f1eee8' },
    { id: 'moletons', name: 'Moletons', garment: 'hoodie', color: '#2b2b2e' },
    { id: 'calcas', name: 'Calças', garment: 'jeans', color: '#2a3d66' },
    { id: 'bermudas', name: 'Bermudas', garment: 'shorts', color: '#c2ab82' },
    { id: 'bones', name: 'Bonés', garment: 'cap', color: '#8f1d24' },
    { id: 'tenis', name: 'Tênis', garment: 'sneaker', color: '#f4f2ee' }
  ];

  var TOPS = ['P', 'M', 'G', 'GG'];
  var BOTTOMS = ['38', '40', '42', '44', '46'];

  var PRODUCTS = [
    { id: 'p1', cat: 'camisetas', name: 'Camiseta Crown Premium', price: 129.9, old: 159.9, tag: 'Mais vendido', sizes: TOPS,
      colors: [['Preto', '#151515'], ['Branco', '#f4f2ee'], ['Marinho', '#1d2a5a']] },
    { id: 'p2', cat: 'camisetas', name: 'Camiseta Liberty Basic', price: 99.9, tag: 'Novo', sizes: TOPS,
      colors: [['Vinho', '#8f1d24'], ['Oliva', '#6b6f5a'], ['Areia', '#c9c3b6']] },
    { id: 'p3', cat: 'polos', name: 'Polo Piquet Classic', price: 189.9, sizes: TOPS,
      colors: [['Marinho', '#1d2a5a'], ['Branco', '#f4f2ee'], ['Vermelho', '#b3202d']] },
    { id: 'p4', cat: 'polos', name: 'Polo Sport Dry', price: 169.9, sizes: TOPS,
      colors: [['Preto', '#151515'], ['Grafite', '#3f4a5c'], ['Azul', '#2c5d8f']] },
    { id: 'p5', cat: 'camisas', name: 'Camisa Oxford Slim', price: 229.9, sizes: TOPS,
      colors: [['Azul claro', '#a9c4e3'], ['Branco', '#f4f2ee'], ['Rosé', '#e7c9cf']] },
    { id: 'p6', cat: 'camisas', name: 'Camisa Linho Summer', price: 249.9, tag: 'Novo', sizes: TOPS,
      colors: [['Bege', '#d8cdb8'], ['Branco', '#f4f2ee'], ['Verde', '#5f7a64']] },
    { id: 'p7', cat: 'moletons', name: 'Moletom Hoodie Titanium', price: 299.9, old: 349.9, tag: 'Oferta', red: true, sizes: TOPS,
      colors: [['Chumbo', '#2b2b2e'], ['Preto', '#151515'], ['Oliva', '#5a5f3e']] },
    { id: 'p8', cat: 'calcas', name: 'Calça Jeans Slim Indigo', price: 279.9, sizes: BOTTOMS,
      colors: [['Indigo', '#2a3d66'], ['Black', '#1c1c1f'], ['Delavê', '#5d7699']] },
    { id: 'p9', cat: 'bermudas', name: 'Bermuda Chino Comfort', price: 159.9, sizes: BOTTOMS,
      colors: [['Cáqui', '#c2ab82'], ['Marinho', '#1d2a5a'], ['Militar', '#4d5a3c']] },
    { id: 'p10', cat: 'bones', name: 'Boné Dad Hat Crown', price: 99.9, sizes: ['Único'],
      colors: [['Preto', '#151515'], ['Marinho', '#1d2a5a'], ['Bege', '#d8cdb8']] },
    { id: 'p11', cat: 'bones', name: 'Boné Trucker USA', price: 119.9, sizes: ['Único'],
      colors: [['Vermelho', '#8f1d24'], ['Preto', '#151515'], ['Branco', '#f4f2ee']] },
    { id: 'p12', cat: 'tenis', name: 'Tênis Court Low', price: 449.9, tag: 'Lançamento', sizes: ['39', '40', '41', '42', '43'],
      colors: [['Branco', '#f4f2ee'], ['Preto', '#1c1c1f'], ['Marinho', '#1d2a5a']] }
  ];

  var catById = {};
  CATEGORIES.forEach(function (c) { catById[c.id] = c; });
  var productById = {};
  PRODUCTS.forEach(function (p) { productById[p.id] = p; });

  /* ------------------------------------------------------------
   * Utilidades
   * ------------------------------------------------------------ */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var brl = function (v) { return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); };
  var installmentText = function (v) {
    var n = CONFIG.installments;
    return n > 1 ? 'ou ' + n + 'x de ' + brl(v / n) + ' no cartão' : '';
  };

  var toastTimer;
  function toast(msg) {
    var t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2600);
  }

  function whatsappURL(text) {
    var base = CONFIG.whatsapp ? 'https://wa.me/' + CONFIG.whatsapp : 'https://wa.me/';
    return base + '?text=' + encodeURIComponent(text);
  }

  /* ------------------------------------------------------------
   * Logos (canvas)
   * ------------------------------------------------------------ */
  function mountLogos() {
    if (!window.TitaniumLogo) return;
    TitaniumLogo.mount($('#logoHero'), { animate: true });
    TitaniumLogo.mount($('#logoSmall'), { animate: false });
    TitaniumLogo.mount($('#logoAbout'), { animate: true });
    TitaniumLogo.mount($('#logoFooter'), { animate: false });
  }

  /* ------------------------------------------------------------
   * Categorias, filtros e produtos
   * ------------------------------------------------------------ */
  var currentFilter = 'todos';

  function renderCategories() {
    $('#categories').innerHTML = CATEGORIES.map(function (c) {
      var count = PRODUCTS.filter(function (p) { return p.cat === c.id; }).length;
      return '<button class="category reveal" data-cat="' + c.id + '">' +
        '<div class="category__art">' + garmentSVG(c.garment, c.color) + '</div>' +
        '<h3>' + c.name + '</h3>' +
        '<span>' + count + (count === 1 ? ' peça' : ' peças') + ' · Ver</span>' +
        '</button>';
    }).join('');

    $$('.category').forEach(function (el) {
      el.addEventListener('click', function () {
        setFilter(el.dataset.cat);
        $('#produtos').scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  function renderFilters() {
    var items = [{ id: 'todos', name: 'Todos' }].concat(CATEGORIES);
    $('#filters').innerHTML = items.map(function (c) {
      return '<button class="filter' + (c.id === currentFilter ? ' active' : '') + '" role="tab" aria-selected="' +
        (c.id === currentFilter) + '" data-filter="' + c.id + '">' + c.name + '</button>';
    }).join('');
    $$('.filter').forEach(function (b) {
      b.addEventListener('click', function () { setFilter(b.dataset.filter); });
    });
  }

  function setFilter(id) {
    currentFilter = id;
    $$('.filter').forEach(function (b) {
      var on = b.dataset.filter === id;
      b.classList.toggle('active', on);
      b.setAttribute('aria-selected', on);
    });
    renderProducts();
  }

  function productCard(p, i) {
    var cat = catById[p.cat];
    var c0 = p.colors[0];
    var single = p.sizes.length === 1;
    return '<article class="product" data-id="' + p.id + '" data-color="0" data-size="' + (single ? p.sizes[0] : '') + '" style="animation-delay:' + (i * 60) + 'ms">' +
      '<div class="product__media">' +
        (p.tag ? '<span class="product__tag' + (p.red ? ' product__tag--red' : '') + '">' + p.tag + '</span>' : '') +
        garmentSVG(cat.garment, c0[1], p.name + ' — ' + c0[0]) +
      '</div>' +
      '<div class="product__body">' +
        '<span class="product__cat">' + cat.name + '</span>' +
        '<h3 class="product__name">' + p.name + '</h3>' +
        '<div class="product__price"><strong>' + brl(p.price) + '</strong>' + (p.old ? '<s>' + brl(p.old) + '</s>' : '') + '</div>' +
        '<p class="product__inst">' + installmentText(p.price) + '</p>' +
        '<div class="opt-row" aria-label="Cores">' +
          p.colors.map(function (c, k) {
            return '<button class="swatch' + (k === 0 ? ' active' : '') + '" style="--c:' + c[1] + '" data-k="' + k + '" title="' + c[0] + '" aria-label="Cor ' + c[0] + '"></button>';
          }).join('') +
        '</div>' +
        '<div class="opt-row sizes" aria-label="Tamanhos">' +
          p.sizes.map(function (s) {
            return '<button class="size' + (single ? ' active' : '') + '" data-s="' + s + '">' + s + '</button>';
          }).join('') +
        '</div>' +
        '<button class="btn btn--gold add">Adicionar à sacola</button>' +
      '</div>' +
    '</article>';
  }

  function renderProducts() {
    var list = currentFilter === 'todos' ? PRODUCTS : PRODUCTS.filter(function (p) { return p.cat === currentFilter; });
    var wrap = $('#products');
    wrap.innerHTML = list.length ? list.map(productCard).join('') : '<p class="empty">Nenhuma peça nesta categoria por enquanto.</p>';

    $$('.product', wrap).forEach(function (card) {
      var p = productById[card.dataset.id];
      var svg = function () { return $('.product__media svg', card); };

      $$('.swatch', card).forEach(function (sw) {
        sw.addEventListener('click', function () {
          var k = +sw.dataset.k;
          card.dataset.color = k;
          $$('.swatch', card).forEach(function (s) { s.classList.toggle('active', s === sw); });
          svg().style.setProperty('--c', p.colors[k][1]);
          svg().setAttribute('aria-label', p.name + ' — ' + p.colors[k][0]);
        });
      });

      $$('.size', card).forEach(function (b) {
        b.addEventListener('click', function () {
          card.dataset.size = b.dataset.s;
          $$('.size', card).forEach(function (s) { s.classList.toggle('active', s === b); });
        });
      });

      $('.add', card).addEventListener('click', function () {
        var size = card.dataset.size;
        if (!size) {
          toast('Escolha um tamanho para continuar');
          var row = $('.sizes', card);
          row.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }], { duration: 300 });
          return;
        }
        addToCart(p.id, +card.dataset.color, size);
      });
    });
  }

  /* ------------------------------------------------------------
   * Sacola
   * ------------------------------------------------------------ */
  var STORAGE_KEY = 'titanium_cart_v1';
  var cart = [];

  function loadCart() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var data = raw ? JSON.parse(raw) : [];
      cart = Array.isArray(data) ? data.filter(function (i) { return productById[i.id]; }) : [];
    } catch (e) { cart = []; }
  }
  function saveCart() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch (e) { /* sem armazenamento */ }
  }

  function addToCart(id, color, size) {
    var found = cart.find(function (i) { return i.id === id && i.color === color && i.size === size; });
    if (found) found.qty += 1;
    else cart.push({ id: id, color: color, size: size, qty: 1 });
    saveCart();
    renderCart();
    var badge = $('#cartCount');
    badge.classList.remove('bump');
    void badge.offsetWidth;
    badge.classList.add('bump');
    toast('✓ ' + productById[id].name + ' adicionada à sacola');
  }

  function cartTotal() {
    return cart.reduce(function (s, i) { return s + productById[i.id].price * i.qty; }, 0);
  }

  function renderCart() {
    var count = cart.reduce(function (s, i) { return s + i.qty; }, 0);
    var badge = $('#cartCount');
    badge.textContent = count;
    badge.classList.toggle('show', count > 0);

    var box = $('#cartItems');
    if (!cart.length) {
      box.innerHTML = '<div class="cart__empty">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="#e3b54a" stroke-width="1.2"><path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>' +
        '<p>Sua sacola está vazia.</p><a href="#produtos" class="btn btn--ghost js-close-cart">Ver produtos</a></div>';
    } else {
      box.innerHTML = cart.map(function (i, idx) {
        var p = productById[i.id];
        var c = p.colors[i.color] || p.colors[0];
        return '<div class="cart-item">' +
          '<div class="cart-item__img">' + garmentSVG(catById[p.cat].garment, c[1]) + '</div>' +
          '<div><h4>' + p.name + '</h4><small>' + c[0] + ' · Tam. ' + i.size + '</small>' +
          '<div class="cart-item__price">' + brl(p.price * i.qty) + '</div>' +
          '<button class="cart-item__remove" data-idx="' + idx + '">Remover</button></div>' +
          '<div class="qty"><button data-idx="' + idx + '" data-d="-1" aria-label="Diminuir">−</button><span>' + i.qty + '</span>' +
          '<button data-idx="' + idx + '" data-d="1" aria-label="Aumentar">+</button></div>' +
          '</div>';
      }).join('');
    }

    var total = cartTotal();
    $('#cartTotal').textContent = brl(total);
    $('#cartInstallments').textContent = total ? installmentText(total) : '';
    $('#checkout').disabled = !cart.length;
    $('#checkout').style.opacity = cart.length ? 1 : 0.5;
    $('#cartClear').style.display = cart.length ? '' : 'none';

    $$('.qty button', box).forEach(function (b) {
      b.addEventListener('click', function () {
        var it = cart[+b.dataset.idx];
        it.qty += +b.dataset.d;
        if (it.qty <= 0) cart.splice(+b.dataset.idx, 1);
        saveCart();
        renderCart();
      });
    });
    $$('.cart-item__remove', box).forEach(function (b) {
      b.addEventListener('click', function () {
        cart.splice(+b.dataset.idx, 1);
        saveCart();
        renderCart();
      });
    });
    $$('.js-close-cart', box).forEach(function (a) { a.addEventListener('click', closeCart); });
  }

  function openCart() {
    var ov = $('#overlay');
    ov.hidden = false;
    requestAnimationFrame(function () { ov.classList.add('show'); });
    $('#cart').classList.add('open');
    $('#cart').setAttribute('aria-hidden', 'false');
    document.body.classList.add('lock');
    $('#cartClose').focus();
  }
  function closeCart() {
    var ov = $('#overlay');
    ov.classList.remove('show');
    setTimeout(function () { ov.hidden = true; }, 300);
    $('#cart').classList.remove('open');
    $('#cart').setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lock');
  }

  function checkout() {
    if (!cart.length) return;
    var lines = cart.map(function (i) {
      var p = productById[i.id];
      var c = p.colors[i.color] || p.colors[0];
      return '• ' + i.qty + 'x ' + p.name + ' — ' + c[0] + ' / Tam. ' + i.size + ' — ' + brl(p.price * i.qty);
    });
    var msg = 'Olá! Quero fazer este pedido na Titanium Import\'s:\n\n' + lines.join('\n') +
      '\n\nSubtotal: ' + brl(cartTotal()) + '\n\nComo fica o frete para o meu CEP?';
    window.open(whatsappURL(msg), '_blank', 'noopener');
  }

  /* ------------------------------------------------------------
   * Navegação, animações e links
   * ------------------------------------------------------------ */
  function setupNav() {
    var header = $('#header');
    var onScroll = function () { header.classList.toggle('scrolled', window.scrollY > 10); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    var btn = $('#menuBtn');
    var nav = $('#nav');
    btn.addEventListener('click', function () {
      var open = !nav.classList.contains('open');
      nav.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', open);
    });
    $$('a', nav).forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      });
    });

    if ('IntersectionObserver' in window) {
      var links = {};
      $$('a', nav).forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && links[e.target.id]) {
            $$('a', nav).forEach(function (a) { a.classList.remove('active'); });
            links[e.target.id].classList.add('active');
          }
        });
      }, { rootMargin: '-45% 0px -50% 0px' });
      Object.keys(links).forEach(function (id) { var s = document.getElementById(id); if (s) spy.observe(s); });
    }
  }

  function setupReveal() {
    var els = $$('.reveal');
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    els.forEach(function (e, i) {
      e.style.transitionDelay = (e.classList.contains('category') ? (i % 4) * 90 : 0) + 'ms';
      io.observe(e);
    });
  }

  function setupLinks() {
    $$('.js-whatsapp').forEach(function (a) {
      a.href = whatsappURL(a.dataset.msg || 'Olá!');
      a.target = '_blank';
      a.rel = 'noopener';
    });
    $$('.js-social').forEach(function (a) {
      var url = CONFIG[a.dataset.network];
      if (url) {
        a.href = url;
        a.target = '_blank';
        a.rel = 'noopener';
      } else {
        a.addEventListener('click', function (e) { e.preventDefault(); toast('Em breve!'); });
      }
    });
    var hours = $('#hours');
    if (CONFIG.hours) hours.textContent = CONFIG.hours;
    else hours.parentElement.remove();
    $('#year').textContent = new Date().getFullYear();

    $$('.banner__item').forEach(function (el) {
      el.innerHTML = garmentSVG(el.dataset.garment, el.style.getPropertyValue('--c'));
    });
  }

  /* ------------------------------------------------------------
   * Início
   * ------------------------------------------------------------ */
  document.addEventListener('DOMContentLoaded', function () {
    mountLogos();
    renderCategories();
    renderFilters();
    renderProducts();
    loadCart();
    renderCart();
    setupLinks();
    setupNav();
    setupReveal();

    $('#cartOpen').addEventListener('click', openCart);
    $('#cartClose').addEventListener('click', closeCart);
    $('#overlay').addEventListener('click', closeCart);
    $('#checkout').addEventListener('click', checkout);
    $('#cartClear').addEventListener('click', function () { cart = []; saveCart(); renderCart(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && $('#cart').classList.contains('open')) closeCart();
    });
  });
})();
