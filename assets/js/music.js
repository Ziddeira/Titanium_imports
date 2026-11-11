/* =========================================================
   Trilha sonora — playlist do Spotify com play/pausa
   ---------------------------------------------------------
   Navegadores não deixam nenhum site tocar som sozinho ao
   abrir. Por isso o site começa com a tela "Aumenta o som":
   o clique em "Entrar com som" libera o áudio e a playlist
   começa a tocar.
   ========================================================= */
(function () {
  'use strict';

  var MUSIC = {
    // ID da playlist (parte final do link open.spotify.com/playlist/XXXX)
    playlist: '0g9DQ9UB0Vr1y3KwgAXr1C',
    label: 'Trilha Titanium · Funk'
  };

  var gate = document.getElementById('gate');
  var dock = document.getElementById('dock');
  var playBtn = document.getElementById('dockPlay');
  var toggleBtn = document.getElementById('dockToggle');
  var label = document.getElementById('dockLabel');
  var embedHost = document.getElementById('spotifyEmbed');
  var footerLink = document.getElementById('spotifyLink');
  if (!gate || !dock) return;

  var controller = null;
  var wantPlay = false;
  var playing = false;
  var hintTimer;

  label.textContent = MUSIC.label;
  if (footerLink) footerLink.href = 'https://open.spotify.com/playlist/' + MUSIC.playlist;

  /* ---------- Spotify iFrame API ---------- */
  window.onSpotifyIframeApiReady = function (IFrameAPI) {
    IFrameAPI.createController(embedHost, {
      uri: 'spotify:playlist:' + MUSIC.playlist,
      width: '100%',
      height: 80
    }, function (c) {
      controller = c;
      c.addListener('playback_update', function (e) {
        if (!e || !e.data) return;
        setPlaying(!e.data.isPaused);
      });
      c.addListener('ready', function () {
        if (wantPlay) c.play();
      });
    });
  };

  var s = document.createElement('script');
  s.src = 'https://open.spotify.com/embed/iframe-api/v1';
  s.async = true;
  s.onerror = function () { label.textContent = 'Player indisponível'; };
  document.head.appendChild(s);

  /* ---------- Estado ---------- */
  function setPlaying(on) {
    playing = on;
    dock.classList.toggle('is-playing', on);
    playBtn.setAttribute('aria-label', on ? 'Pausar música' : 'Tocar música');
    if (on) {
      clearTimeout(hintTimer);
      label.textContent = MUSIC.label;
    }
  }

  function play() {
    wantPlay = true;
    if (controller) controller.play();
    // Se o navegador ou o Spotify bloquear, pede um toque no player
    clearTimeout(hintTimer);
    hintTimer = setTimeout(function () {
      if (!playing) {
        label.textContent = 'Toque no ▶ do Spotify';
        expand(true);
      }
    }, 3500);
  }

  function pause() {
    wantPlay = false;
    if (controller) controller.pause();
    setPlaying(false);
  }

  function expand(open) {
    dock.classList.toggle('is-min', !open);
    toggleBtn.setAttribute('aria-expanded', open);
    toggleBtn.setAttribute('aria-label', open ? 'Recolher player' : 'Mostrar player');
  }

  /* ---------- Tela de entrada ---------- */
  function enter(withSound) {
    gate.classList.add('out');
    document.body.classList.remove('lock');
    dock.hidden = false;
    try { sessionStorage.setItem('titanium_gate', withSound ? 'som' : 'mudo'); } catch (e) { /* sem armazenamento */ }
    expand(false);
    if (withSound) play();
    setTimeout(function () { gate.hidden = true; }, 700);
  }

  var seen = null;
  try { seen = sessionStorage.getItem('titanium_gate'); } catch (e) { /* sem armazenamento */ }

  if (seen) {
    // Já entrou nesta visita: não mostra a tela de novo (o som espera um toque no play)
    gate.hidden = true;
    dock.hidden = false;
    expand(false);
  } else {
    document.body.classList.add('lock');
    document.getElementById('gateSound').focus();
  }

  document.getElementById('gateSound').addEventListener('click', function () { enter(true); });
  document.getElementById('gateMute').addEventListener('click', function () { enter(false); });
  gate.addEventListener('keydown', function (e) { if (e.key === 'Escape') enter(false); });

  playBtn.addEventListener('click', function () {
    if (playing) pause(); else play();
  });
  toggleBtn.addEventListener('click', function () {
    expand(dock.classList.contains('is-min'));
  });
})();
