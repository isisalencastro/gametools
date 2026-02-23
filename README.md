# GameTools v1.0

Plataforma web com mini jogos e ferramentas úteis construída com Next.js + TypeScript + Tailwind CSS.

## Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS

## Funcionalidades v1.0

### Mini jogos
- Teste de Reação
- Adivinhe o Número

### Ferramentas
- Calculadora de IMC
- Calculadora de Porcentagem
- Conversor de Temperatura

## Rodando localmente

```bash
npm install
npm run dev
```

A aplicação ficará disponível em `http://localhost:3000`.

## Deploy no GitHub Pages

Este projeto já está preparado para deploy automático via GitHub Actions em `.github/workflows/deploy.yml`.

1. No repositório, abra **Settings > Pages**.
2. Em **Source**, selecione **GitHub Actions**.
3. Faça push na branch `main`.
4. A URL final ficará em:
   - `https://<usuario>.github.io/<repositorio>/`

> Observação: a URL `github.com/<usuario>/<repositorio>` sempre mostra o código/README, não o site publicado.
