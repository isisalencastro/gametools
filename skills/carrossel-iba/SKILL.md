---
name: carrossel-iba
description: Cria carrosséis de Instagram da IBA Estúdios no padrão "decodificado" (10 slides, estilo BrandsDecoded adaptado), com pauta tirada das notícias mais faladas do Brasil e ligada ao mercado da IBA (WhatsApp, atendimento, sites, automação, pagamentos). Use quando pedirem carrossel, post, slides ou conteúdo para Instagram/LinkedIn da IBA.
---

# /carrossel-iba: carrossel "decodificado" da IBA

Carrossel de 10 slides que pega uma notícia em alta, explica o que ela significa para o pequeno negócio e termina com um CTA de palavra-chave que gera lead. O formato foi tirado da análise do @brandsdecoded__ e adaptado à identidade da IBA.

## Arquivos

- `references/empresa-iba.md`: empresa, público, serviços, oferta gratuita (isca), mensagens-chave
- `references/design-iba.md`: identidade visual e regras de cada slide
- `references/formato-decodificado.md`: a fórmula dos 10 slides, regras de texto e exemplos aprovados
- `references/pautas-noticias.md`: como escolher a pauta a partir das notícias (Etapa 0)
- `modelo/`: gerador (`iba_carrossel.py`), renderizador (`render.js`), `style.css`, fontes e o mascote Nó. No repositório fica em `conteudo/carrosseis/_modelo/` (se não existir, copiar `modelo/` para lá)

## Ambiente

- Python 3 e Node com Playwright para gerar os PNGs, acesso a `unsplash.com` e `images.unsplash.com` e busca na web.
- Se o navegador do Playwright não estiver instalado, e o `npx playwright install chromium` falhar com `EACCES` em
  `/opt/hermes`, apontar o caminho para uma pasta gravável:
  `PLAYWRIGHT_BROWSERS_PATH=$HOME/.cache/ms-playwright npx playwright install chromium`.
- O `render.js` usa `/opt/pw-browsers/chromium` quando ele existe; quando não existe, usa o navegador do Playwright.

## Identidade (fixa, não perguntar)

- Instagram: **@ibaestudios** · site ibaestudio.com · contato@ibaestudio.com
- Fundos: **só azul `#185CB6` e branco `#FFFFFF`**. Laranja `#FFBD59` só em destaques (palavra do título, número do slide, botão do CTA, sublinhados)
- Texto sobre azul: branco. Texto sobre branco: `#101828`
- Fontes: Archivo (títulos, 800/900; condensada na capa), Inter (corpo), JetBrains Mono (números e fontes)
- Mascote Nó (polvo azul de traço contínuo com estrela laranja): selo da capa, bloco do slide 9 e assinatura do slide 10
- Frase da marca: "a IBA dá um nó nos seus processos 🐙"

## Cores intercaladas (obrigatório)

O feed da IBA é intercalado: nenhum post repete a cor de fundo da capa do post anterior.

- Antes de gerar, ler `cor_fundo_capa` do último post em `/opt/data/iba-site/instagram/feed-registro.json` e usar o
  fundo contrário na capa (azul depois de branco, branco depois de azul). Sem registro, usar azul.
- Depois de publicar ou agendar, atualizar o mesmo arquivo com data, cor usada e slug, para o próximo não repetir.
- Capa branca: `capa(..., fundo='branco')` no roteiro. É a variante clara do modelo, com a mesma manchete e a chamada de seta; a versão azul continua sendo o padrão.
- Dentro do carrossel, os fundos seguem a alternância do formato: a cor chapada troca entre branco e azul de um slide
  para o outro, com as fotos nos slides 4 e 8. Dois slides de cor chapada igual seguidos só quando o roteiro não tiver
  como evitar.

## Fluxo

### Etapa 0: pauta (notícia + mercado da IBA)
Seguir `references/pautas-noticias.md`: buscar as notícias mais faladas no Brasil nos últimos dias, filtrar as que tocam o pequeno negócio e o mercado da IBA e propor **3 pautas**, cada uma com manchete, ângulo IBA, fontes e palavra do CTA. Evitar política, eleição, tragédia e polêmica. Se o pedido já trouxer o tema, pular para a Etapa 1.

### Etapa 1: espinha dorsal + capa
Ângulo, tensão, provas (número + fonte + data), virada e **3 opções de capa** (manchete com até ~8 palavras de destaque, mais uma chamada com seta). Esperar aprovação, a menos que a pessoa tenha dito para seguir direto.

### Etapa 2: texto dos 10 slides + legenda
Seguir a fórmula de `references/formato-decodificado.md`. Mostrar o texto completo e esperar aprovação (mesma exceção).

### Etapa 3: fotos
Fotos de banco gratuito (Unsplash), com termos em inglês. A página de busca bloqueia robô (401/403 e "BotStopper"): buscar o termo direto no Wayback, que devolve o snapshot com os IDs, e baixar do CDN, que responde normal:

1. `https://archive.org/wayback/available?url=unsplash.com/s/photos/<termo>` e depois a `closest.url`
2. do HTML do snapshot, pegar `images\\.unsplash\\.com/photo-[0-9a-zA-Z_-]{20,}` (descartar `plus.unsplash.com`, que é pago)
3. baixar `https://images.unsplash.com/photo-<id>?w=1600&q=85&fm=jpg`

Só termos com snapshot arquivado funcionam. Vale usar as palavras mais simples possíveis (storefront, cashier, shopping, retail, phone, market). Baixar `https://images.unsplash.com/photo-<id>?w=1600&q=85&fm=jpg`. **Sempre olhar a foto antes de usar** (montar uma folha de contato) e anotar os créditos no `carousel-text.md`. Precisa de 4 fotos: capa, slide 4, slide 8 e slide 10.

### Etapa 4: gerar e renderizar
1. Criar `conteudo/carrosseis/<tema>/roteiro.py` (copiar de um tema existente) e salvar as fotos em `<tema>/imagens/`
2. `python3 conteudo/carrosseis/<tema>/roteiro.py`
3. `node conteudo/carrosseis/_modelo/render.js conteudo/carrosseis/<tema>/instagram/slide-*.html`
4. Medir a margem antes de olhar: `/opt/data/.venv/bin/python conteudo/carrosseis/_modelo/mede_margens.py conteudo/carrosseis/<tema>` (72px nas laterais, 80px na base). Corpo comprido estoura a base no layout `texto`; numero longo estoura a direita no `numero`
5. Conferir **todos** os PNGs (montagem 5x2): rosto cortado, texto encavalado, buraco grande, foto escura. Ajustar `foco`/`foto_css` e renderizar de novo
6. Salvar `carousel-text.md` com legenda, fontes e créditos das fotos

## Saída

```
conteudo/carrosseis/<tema>/
  roteiro.py          <- texto dos slides (fonte da verdade)
  carousel-text.md    <- legenda + fontes + créditos
  imagens/            <- fotos do Unsplash
  instagram/slide-01..10.html/.png
```

## Regras

- Todo número tem fonte e data. Sem fonte: opinião honesta, nunca número inventado
- Conversa de WhatsApp desenhada é sempre marcada como **EXEMPLO**
- Sem travessão (—), sem "não é X, é Y", sem cacoetes ("isso muda tudo", "no fim das contas"), sem jargão (ecossistema, mindset), sem emoji no corpo (só o 🐙 da assinatura)
- Texto aprovado não muda no visual
- Depois de pronto, registrar o post no Notion (REDES SOCIAIS > Instagram) e no Obsidian, quando houver acesso
