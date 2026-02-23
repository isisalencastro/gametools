# GameTools

Plataforma web com mini jogos e ferramentas úteis, construída em HTML, CSS e JavaScript puro.

## 📌 Sobre o projeto

O GameTools reúne utilidade e entretenimento em uma interface simples, leve e rápida, com foco em execução direta no navegador e deploy estático.

## ✨ Funcionalidades disponíveis (v1)

### Mini jogos
- **Teste de Reação**: mede o tempo de resposta após sinal visual.
- **Adivinhe o Número**: jogo de tentativa e erro com dica de maior/menor e limite de tentativas.

### Ferramentas
- **Calculadora de IMC** com classificação básica.
- **Regra de três** (simples e composta).
- **Conversor de moedas manual** (taxa inserida pelo usuário).
- **Calculadora de idade exata** (anos, meses e dias).
- **Calculadora de juros** (simples e compostos).
- **Cronômetro/Pomodoro** com foco e pausa.

## 🧱 Estrutura do repositório

- `index.html` → home com visão geral e links para catálogos.
- `jogos.html` e `ferramentas.html` → páginas de catálogo.
- `jogos/reacao.html` e `ferramentas/*.html` → páginas individuais de features (IMC, regra de três, moedas, idade, juros e pomodoro).
- `styles.css` → estilos globais e responsividade.
- `script.js` → regras JS dos widgets na home (legado v1).
- `robots.txt` → diretrizes para crawlers e referência do sitemap.
- `sitemap.xml` → lista de URLs públicas para indexação.
- `package.json` → scripts NPM para validação estática.
- `eslint.config.js` → configuração de lint JavaScript.

## 🌐 SEO / Social: onde atualizar ao publicar

Ao publicar em outro domínio, atualize os valores abaixo:

- **URL base do projeto**:
  - `index.html` nas tags: `canonical`, `og:url`, JSON-LD `WebSite.url` e `SoftwareApplication.url`.
  - `robots.txt` na linha `Sitemap:`.
  - `sitemap.xml` em cada `<loc>`.
- **Imagem social**:
  - `index.html` nas tags `og:image` e `twitter:image`.
  - Recomendação: imagem pública absoluta (ex.: `https://seu-dominio.com/assets/social-card.png`).
- **Metadados sociais e descrição**:
  - `index.html` nas tags `description`, `og:title`, `og:description`, `twitter:title`, `twitter:description`.
- **Internacionalização (`pt-BR` e futura `en`)**:
  - O documento principal já usa `lang="pt-BR"`.
  - Quando houver versão em inglês, adicionar/ativar `hreflang="en"` no `index.html` e incluir a nova URL no `sitemap.xml`.

## ▶️ Como executar localmente

### Opção 1 (mais simples)
Abra o arquivo `index.html` diretamente no navegador.

### Opção 2 (recomendada)
Suba um servidor local:

```bash
python3 -m http.server 8080
```

Depois acesse `http://localhost:8080`.

## ✅ Validação de qualidade (NPM)

Execute validações do projeto estático:

```bash
npm run lint
```

Validações individuais:

```bash
npm run lint:js
npm run lint:css
npm run lint:html
```


## ♿ Critérios de acessibilidade (padrão para novas features)

Ao criar ou alterar páginas no GameTools, siga este checklist mínimo:

- **Atualizações dinâmicas anunciáveis**: todo bloco de status/resultado deve usar `aria-live="polite"` (preferencialmente com `role="status"`).
- **Teclado primeiro**: controles interativos devem ser elementos nativos (`button`, `a`, `input`, `select`) ou equivalentes com foco e ativação por teclado.
- **Foco visível**: manter estilo de `:focus-visible` com alto contraste em links, botões, inputs, selects e summaries.
- **Rótulos explícitos**: todo campo de formulário deve ter `<label for="...">`; placeholder nunca substitui label.
- **Validação clara**: bloquear ações inválidas e informar o erro em linguagem objetiva, dizendo como corrigir.
- **Atalho de navegação**: incluir link “Pular para conteúdo” no topo e `id` no conteúdo principal (`main`).

### Critérios de aceite rápidos
- Navegação completa com `Tab`, `Shift+Tab`, `Enter` e `Espaço` sem perder contexto.
- Foco sempre visível em qualquer controle ativo.
- Mensagens de erro/resultado compreensíveis para leitor de tela e sem ambiguidade.

## 🛠️ Tecnologias

- HTML5
- CSS3
- JavaScript (ES6+)
- ESLint (JS)
- Scripts Node.js para checagem estrutural de HTML/CSS

## 📄 Licença

Uso livre para estudo e adaptação.
