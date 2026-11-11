# Titanium Import's — Site

Site da loja de moda masculina importada **Titanium Import's**. HTML, CSS e JavaScript puro, sem build nem dependências.

## Como abrir

Abra `index.html` no navegador. Para publicar, envie a pasta inteira para qualquer hospedagem estática (GitHub Pages, Netlify, Vercel...).

## Estrutura

```
index.html                Página
assets/css/style.css      Estilos
assets/js/intro.js        Abertura: vídeo que avança conforme o scroll
assets/js/music.js        Tela "Aumenta o som" e player da playlist do Spotify
assets/js/main.js         Catálogo, filtros, sacola e configurações da loja
assets/frames/desktop/    193 quadros do vídeo (1280x720, WebP)
assets/frames/mobile/     Mesmos quadros recortados para celular (640x720)
assets/img/               Fotos dos produtos, imagens editoriais e logo
logo/                     Logo desenhada em Canvas
```

## Personalizar

No topo de `assets/js/main.js`:

- **`CONFIG`**: WhatsApp (só dígitos, com 55 + DDD), Instagram, TikTok, horário de atendimento e parcelas.
- **`PRODUCTS`**: nome, categoria, preço, preço antigo (`old`), selo (`tag`), foto (`img`), tamanhos e cores.
  Cada cor aceita uma foto própria: `['Branco', '#f4f2ee', 'assets/img/camisa-branca.webp']`.
- **`FEATURED`**: as quatro categorias com foto.

## Música (Spotify)

No topo de `assets/js/music.js`, troque `playlist` pelo ID da sua playlist (a parte final do link
`open.spotify.com/playlist/XXXX`) e `label` pelo nome que aparece no player.

Nenhum navegador deixa um site tocar som sozinho. Por isso o site abre com a tela "Aumenta o som":
o clique em "Entrar com som" libera o áudio. Quem não está logado no Spotify ouve trechos de 30 s;
quem está logado ouve as faixas completas.

## Trocar o vídeo da abertura

Gere os quadros a partir de um MP4 (16:9) com o ffmpeg:

```bash
ffmpeg -i video.mp4 -vf "scale=1280:720" -c:v libwebp -quality 66 assets/frames/desktop/f%03d.webp
ffmpeg -i video.mp4 -vf "crop=640:720:320:0" -c:v libwebp -quality 66 assets/frames/mobile/f%03d.webp
```

Se o número de quadros mudar, ajuste `FRAMES` em `assets/js/intro.js`.
