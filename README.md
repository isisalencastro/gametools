# GameTools v1.0 (HTML, CSS e JavaScript)

Projeto de mini jogos e ferramentas úteis feito em **HTML, CSS e JS puro**, sem framework e sem etapa de build.

## Funcionalidades

### Mini jogos
- Teste de Reação
- Adivinhe o Número (1 a 100)

### Ferramentas
- Calculadora de IMC
- Calculadora de Porcentagem
- Conversor de Temperatura (°C ↔ °F)

## Rodando localmente

Basta abrir o arquivo `index.html` no navegador.

Se quiser subir um servidor local:

```bash
python3 -m http.server 8080
```

Depois acesse `http://localhost:8080`.

## Deploy no GitHub Pages

O deploy está automatizado em `.github/workflows/deploy.yml`.

1. Vá em **Settings > Pages** no repositório.
2. Em **Source**, escolha **GitHub Actions**.
3. Faça push na branch `main`.
4. Acesse:
   - `https://<usuario>.github.io/<repositorio>/`
