# Titanium Import's — Site

Site da loja de moda masculina importada **Titanium Import's**, feito em HTML, CSS e JavaScript puro, sem build nem dependências.

## Como abrir

Abra `index.html` no navegador. Para publicar, envie a pasta inteira para qualquer hospedagem estática (GitHub Pages, Netlify, Vercel, etc.).

## Estrutura

```
index.html               Página principal
assets/css/style.css     Estilos (paleta preto + dourado)
assets/js/main.js        Catálogo, filtros, sacola e configurações da loja
logo/titanium-logo.js    Logo desenhada em Canvas (animada)
logo/index.html          Página só da logo, com download em PNG
```

## Personalizar

Tudo fica no topo de `assets/js/main.js`:

- **`CONFIG`**: número do WhatsApp (só dígitos, com 55 + DDD), links do TikTok e Instagram, horário de atendimento e número de parcelas.
- **`PRODUCTS`**: nome, categoria, preço, preço antigo (`old`), selo (`tag`), tamanhos e cores de cada peça.
- **`CATEGORIES`**: categorias exibidas nas coleções e nos filtros.

O pedido é finalizado pelo WhatsApp: a sacola monta a mensagem com as peças, cores, tamanhos e o subtotal.
