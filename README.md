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
- **Calculadora de Porcentagem** (`x% de y`).
- **Conversor de Temperatura** (°C ↔ °F).

## 🧱 Estrutura do repositório

- `index.html` → estrutura da página e componentes visuais.
- `styles.css` → estilos globais e responsividade.
- `script.js` → regras dos jogos e ferramentas.
- `package.json` → scripts NPM para validação estática.
- `eslint.config.js` → configuração de lint JavaScript.

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

## 🛠️ Tecnologias

- HTML5
- CSS3
- JavaScript (ES6+)
- ESLint (JS)
- Scripts Node.js para checagem estrutural de HTML/CSS

## 📄 Licença

Uso livre para estudo e adaptação.
