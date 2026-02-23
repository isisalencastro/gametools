# GameTools

Plataforma web com mini jogos e ferramentas úteis, construída em HTML, CSS e JavaScript puro.

## 📌 Sobre o projeto

O GameTools foi criado para reunir utilidade e entretenimento em uma interface simples, leve e rápida, com foco em funcionamento direto no navegador e deploy fácil no GitHub Pages.

## ✨ Funcionalidades disponíveis (v1)

### Mini jogos
- **Teste de Reação**: mede o tempo de resposta após sinal visual.
- **Adivinhe o Número**: jogo de tentativa e erro com dica de maior/menor e limite de tentativas.

### Ferramentas
- **Calculadora de IMC** com classificação básica.
- **Calculadora de Porcentagem** (`x% de y`).
- **Conversor de Temperatura** (°C ↔ °F).

## 🎨 Identidade visual

Paleta principal utilizada no projeto:
- Azul
- Branco
- Preto
- Amarelo (detalhes)

## 🧱 Estrutura do repositório

- `index.html` → estrutura da página e componentes visuais.
- `styles.css` → estilos globais e responsividade.
- `script.js` → regras dos jogos e ferramentas.
- `.github/workflows/deploy.yml` → deploy automático para GitHub Pages.
- `.nojekyll` → compatibilidade de publicação estática no Pages.

## ▶️ Como executar localmente

### Opção 1 (mais simples)
Abra o arquivo `index.html` diretamente no navegador.

### Opção 2 (recomendado)
Suba um servidor local:

```bash
python3 -m http.server 8080
```

Depois acesse:

```text
http://localhost:8080
```

## 🚀 Publicação no GitHub Pages

1. Faça push do projeto para a branch `main`.
2. No GitHub, abra **Settings > Pages**.
3. Em **Build and deployment > Source**, selecione **GitHub Actions**.
4. Aguarde o workflow `Deploy static site to Pages` concluir.
5. Acesse a URL publicada:
   - `https://<usuario>.github.io/<repositorio>/`

## 🛠️ Tecnologias

- HTML5
- CSS3
- JavaScript (ES6+)
- GitHub Actions
- GitHub Pages

## 📄 Licença

Uso livre para estudo e adaptação.
