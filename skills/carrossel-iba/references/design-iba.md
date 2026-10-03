# Design dos carrosséis IBA (padrão decodificado)

> Implementado em `modelo/iba_carrossel.py` + `modelo/style.css`. Ajuste o visual ali, não slide a slide.

## Formato

- 1080x1350 (4:5), 10 slides. LinkedIn: os mesmos PNGs exportados em PDF
- Margens laterais de 72px, rodapé livre de 80px

## Cores

- Fundos: **somente azul `#185CB6` e branco `#FFFFFF`**. A capa é uma foto com degradê para o azul
- Laranja `#FFBD59`: número do slide, trecho em destaque no título dos slides azuis e da capa, sublinhados, botão do CTA e a estrela do Nó
- Nos slides brancos, o destaque do título é azul com sublinhado laranja
- Proibido: fundo laranja inteiro, preto, gradiente roxo, glassmorphism, fonte pixel

## Tipografia

- Capa: Archivo condensada (font-stretch 62%), peso 900, caixa-alta, 124px
- Títulos: Archivo 800, 74 a 88px, entrelinha 1.02
- Corpo: Inter 500, 34 a 44px
- Números de slide, fontes e etiquetas: JetBrains Mono
- Números gigantes (provas): Archivo condensada 900, 190 a 250px

## Elementos fixos

- Faixa do topo: `IBA Estúdios · @ibaestudios · NN/10` (número em pílula laranja)
- Selo da capa: Nó azul em círculo branco com borda laranja + @ibaestudios
- Nó branco (`marca/no-branco.png`) sobre azul e Nó azul (`marca/no-azul.png`) sobre branco

## Fotos

- Unsplash, licença gratuita (`images.unsplash.com`), sempre conferidas antes de usar
- Pessoas reais em situações do dia a dia do pequeno negócio (balcão, celular, loja, sofá à noite)
- Cantos arredondados de 22px nos slides internos. Na capa, em tela cheia, com o assunto (rosto, celular) acima do título
- Ajustar enquadramento com `foco` (object-position) ou `foto_css` (capa)

## Ritmo

- Alternância: 1 foto/azul · 2 branco · 3 azul · 4 branco · 5 branco · 6 azul · 7 branco · 8 azul · 9 branco · 10 azul
- Cada slide tem um layout diferente do anterior
- Conferir sempre: rosto cortado, texto encavalado em número grande, buraco vazio no meio do slide
