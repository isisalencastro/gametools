"""Gerador de carrosséis da IBA (padrão "decodificado", 10 slides 1080x1350).

Uso:
    python3 conteudo/carrosseis/<tema>/roteiro.py      # gera instagram/slide-XX.html
    node conteudo/carrosseis/_modelo/render.js conteudo/carrosseis/<tema>/instagram/slide-*.html

Marcação nos textos:
    *texto*   -> destaque do título (laranja no azul, azul sublinhado no branco)
    **texto** -> destaque no corpo (negrito colorido)
"""
import html
import os
import re

MODELO = '../../_modelo'
IMAGENS = '../imagens'


def _fmt(texto):
    t = html.escape(texto, quote=False)
    t = re.sub(r'\*\*(.+?)\*\*', r'<b class="dest">\1</b>', t)
    t = re.sub(r'\*(.+?)\*', r'<em>\1</em>', t)
    return t


def _setas(itens, estilo='margin-top:28px'):
    lis = ''.join(f'<li>{_fmt(i)}</li>' for i in itens)
    return f'<ul class="setas" style="{estilo}">{lis}</ul>'


# ---------------------------------------------------------------- layouts

def capa(foto, titulo, destaque, chamada, foto_css='width:1200px;height:1800px;left:-60px;top:-500px', brilho=1.0):
    """Slide 1. Foto em tela cheia + degradê azul + manchete condensada.
    titulo: parte branca; destaque: parte em laranja; chamada: subtítulo com seta.
    foto_css posiciona a foto para o rosto/objeto ficar acima do título."""
    css = f'''
  .capa {{ padding: 0; background: #0E3F82; color: #fff; }}
  .capa .bg {{ position: absolute; {foto_css}; object-fit: cover; filter: brightness({brilho}) contrast(1.05); }}
  .capa .shade {{ position: absolute; inset: 0; background: linear-gradient(180deg, rgba(14,63,130,0.55) 0%, rgba(14,63,130,0) 14%, rgba(24,92,182,0) 44%, rgba(24,92,182,0.88) 62%, rgba(24,92,182,1) 80%); }}
  .capa .conteudo {{ position: absolute; left: 72px; right: 72px; bottom: 96px; display: flex; flex-direction: column; align-items: center; text-align: center; }}
  .capa .marca {{ margin-bottom: 30px; }}
  .capa h1 {{ font-family: 'Archivo', sans-serif; font-stretch: 62%; font-weight: 900; text-transform: uppercase; font-size: 124px; line-height: 0.9; letter-spacing: -0.01em; }}
  .capa h1 span {{ color: var(--laranja); }}
  .capa .chamada {{ margin-top: 38px; font-family: 'Archivo'; font-stretch: 75%; font-weight: 800; text-transform: uppercase; font-size: 40px; line-height: 1.15; }}
  .capa .chamada b {{ color: var(--laranja); }}'''
    body = f'''
  <img class="bg" src="{IMAGENS}/{foto}" alt="">
  <div class="shade"></div>
  <div class="conteudo">
    <div class="marca"><span class="logo"><img src="{MODELO}/marca/no-azul.png" alt=""></span>@ibaestudios</div>
    <h1>{html.escape(titulo)} <span>{html.escape(destaque)}</span></h1>
    <p class="chamada"><b>→</b> {html.escape(chamada)}</p>
  </div>'''
    return ('capa', body, css)


def texto(fundo, titulo, corpo, rotulo=None, itens=(), tam_titulo=88):
    """Título grande, parágrafo e (opcional) lista com setas ancorada embaixo."""
    lista = ''
    if itens:
        lista = f'''<div class="spacer"></div>
  <p class="p"><span class="sub">{_fmt(rotulo)}</span></p>
  {_setas(itens)}'''
    body = f'''
  <h2 class="h" style="font-size:{tam_titulo}px">{_fmt(titulo)}</h2>
  <hr style="margin:56px 0">
  <p class="p" style="font-size:44px">{_fmt(corpo)}</p>
  {lista}'''
    return (fundo, body, '')


def numero(fundo, titulo, intro, numero, legenda, corpo, segundo=None, fecho=None):
    """Prova: número gigante em destaque + contexto. Bom para "De onde vem essa informação?"."""
    css = '''
  .big { display:flex; align-items:center; gap:36px; margin: 18px 0 26px; }
  .big .n { font-family:'Archivo'; font-stretch:70%; font-weight:900; font-size:250px; line-height:.9; letter-spacing:-0.02em; }
  .azul .big .n { color:var(--laranja); } .branco .big .n { color:var(--azul); }
  .big .t { font-family:'Archivo'; font-weight:800; font-size:48px; line-height:1.05; letter-spacing:-0.02em; }'''
    extra = ''
    if segundo:
        extra += f'<hr style="margin:56px 0"><p class="p" style="font-size:42px">{_fmt(segundo)}</p>'
    if fecho:
        extra += f'<div class="spacer"></div><p class="h" style="font-size:64px">{_fmt(fecho)}</p>'
    body = f'''
  <h2 class="h">{_fmt(titulo)}</h2>
  <hr>
  <p class="mini" style="font-size:28px;opacity:.8">{_fmt(intro)}</p>
  <div class="big"><span class="n">{html.escape(numero)}</span><span class="t">{_fmt(legenda)}</span></div>
  <p class="p" style="font-size:42px">{_fmt(corpo)}</p>
  {extra}'''
    return (fundo, body, css)


def foto_xis(fundo, titulo, foto, itens, nota, foco='50% 30%'):
    """Título + foto + lista de crenças/mitos com ✕ + nota final."""
    css = '''
  .xis { list-style:none; }
  .xis li { font-size:38px; line-height:1.25; font-weight:600; letter-spacing:-0.015em; padding-left:62px; position:relative; margin-bottom:14px; }
  .xis li::before { content:""; position:absolute; left:0; top:6px; width:40px; height:40px; border-radius:8px; background:var(--azul); }
  .azul .xis li::before { background:var(--laranja); }
  .xis li::after { content:"✕"; position:absolute; left:0; top:6px; width:40px; height:40px; display:grid; place-items:center; color:#fff; font-size:26px; font-weight:800; }
  .azul .xis li::after { color:var(--tinta); }'''
    lis = ''.join(f'<li>{_fmt(i)}</li>' for i in itens)
    body = f'''
  <h2 class="h">{_fmt(titulo)}</h2>
  <img class="foto" src="{IMAGENS}/{foto}" style="height:400px;margin:44px 0 40px;object-position:{foco}" alt="">
  <ul class="xis">{lis}</ul>
  <div class="spacer"></div>
  <p class="nota">{_fmt(nota)}</p>'''
    return (fundo, body, css)


def stats(fundo, titulo, linhas, fonte):
    """Dois ou três números grandes, cada um com explicação. linhas = [(numero, texto)]."""
    css = '''
  .stat { display:grid; grid-template-columns: minmax(260px, auto) 1fr; align-items:center; gap:36px; padding:40px 0; border-top:2px solid var(--linha-clara); }
  .azul .stat { border-top-color: var(--linha-escura); }
  .stat:last-of-type { border-bottom:2px solid var(--linha-clara); }
  .azul .stat:last-of-type { border-bottom-color: var(--linha-escura); }
  .stat .n { white-space:nowrap; font-family:'Archivo'; font-stretch:62%; font-weight:900; font-size:200px; line-height:.85; letter-spacing:-0.03em; }
  .branco .stat .n { color:var(--azul); } .azul .stat .n { color:#fff; }
  .stat .n::after { content:""; display:block; width:120px; height:12px; background:var(--laranja); margin-top:14px; }
  .fonte { font-family:'JetBrains Mono'; font-size:22px; line-height:1.4; opacity:.75; }'''
    maior = max(len(n) for n, _ in linhas)
    tam = 240 if maior <= 3 else 190
    rows = ''.join(f'<div class="stat"><div class="n" style="font-size:{tam}px">{html.escape(n)}</div><p class="p">{_fmt(t)}</p></div>' for n, t in linhas)
    body = f'''
  <h2 class="h">{_fmt(titulo)}</h2>
  <div class="spacer"></div>
  {rows}
  <div class="spacer"></div>
  <p class="fonte">{_fmt(fonte)}</p>'''
    return (fundo, body, css)


def conversa(fundo, titulo, contato, msgs, corpo, fecho, etiqueta='EXEMPLO'):
    """Print desenhado de WhatsApp (sempre com etiqueta EXEMPLO quando for fictício).
    msgs = [('in'|'out', texto, hora)]."""
    css = '''
  .zap { margin:56px 0 52px; border-radius:24px; overflow:hidden; background:#EFE7DD; box-shadow:0 18px 40px rgba(0,0,0,.25); color:#111B21; }
  .branco .zap { box-shadow:0 0 0 2px var(--linha-clara), 0 18px 40px rgba(16,24,40,.12); }
  .zap-topo { display:flex; align-items:center; gap:18px; padding:20px 26px; background:#F0F2F5; font-size:28px; }
  .zap-topo small { display:block; font-size:20px; color:#667781; }
  .zap-topo .av { width:56px; height:56px; border-radius:50%; background:#D1D7DB; }
  .zap-topo .tag { margin-left:auto; font-family:'JetBrains Mono'; font-weight:700; font-size:18px; padding:6px 12px; border-radius:6px; background:var(--laranja); color:var(--tinta); }
  .zap-corpo { padding:30px 26px 34px; display:flex; flex-direction:column; gap:18px; }
  .msg { max-width:80%; font-size:34px; line-height:1.3; padding:16px 20px 30px; border-radius:16px; position:relative; box-shadow:0 1px 1px rgba(0,0,0,.12); }
  .msg i { position:absolute; right:14px; bottom:6px; font-style:normal; font-size:18px; color:#667781; }
  .msg .ok { color:#53BDEB; }
  .msg.in { background:#fff; align-self:flex-start; border-top-left-radius:4px; }
  .msg.out { background:#D9FDD3; align-self:flex-end; border-top-right-radius:4px; }'''
    bolhas = ''
    for lado, txt, hora in msgs:
        check = ' <span class="ok">✓✓</span>' if lado == 'out' else ''
        bolhas += f'<div class="msg {lado}">{html.escape(txt)}<i>{hora}{check}</i></div>'
    tag = f'<span class="tag">{etiqueta}</span>' if etiqueta else ''
    body = f'''
  <h2 class="h" style="font-size:84px">{_fmt(titulo)}</h2>
  <div class="zap">
    <div class="zap-topo"><span class="av"></span><div><b>{html.escape(contato)}</b><small>online</small></div>{tag}</div>
    <div class="zap-corpo">{bolhas}</div>
  </div>
  <p class="p" style="font-size:42px">{_fmt(corpo)}</p>
  <div class="spacer"></div>
  <p class="h" style="font-size:58px;line-height:1.12"><span class="sub" style="border-bottom-width:6px">{_fmt(fecho)}</span></p>'''
    return (fundo, body, css)


def passos(fundo, titulo, itens, nota):
    """Checklist numerado 01-04 com borda lateral. itens = [(rótulo, texto)]."""
    css = '''
  .passos { border-left:8px solid var(--azul); padding-left:40px; display:flex; flex-direction:column; gap:34px; }
  .azul .passos { border-left-color: var(--laranja); }
  .passo { display:grid; grid-template-columns:110px 1fr; align-items:start; }
  .passo .k { font-family:'JetBrains Mono'; font-weight:700; font-size:40px; color:var(--tinta); background:var(--laranja); border-radius:10px; width:86px; text-align:center; padding:6px 0; margin-top:2px; }'''
    rows = ''.join(f'<div class="passo"><span class="k">{i + 1:02d}</span><p class="p"><b>{html.escape(r)}:</b> {_fmt(t)}</p></div>' for i, (r, t) in enumerate(itens))
    body = f'''
  <h2 class="h">{_fmt(titulo)}</h2>
  <div class="spacer"></div>
  <div class="passos">{rows}</div>
  <div class="spacer"></div>
  <p class="nota">{_fmt(nota)}</p>'''
    return (fundo, body, css)


def foto_lista(fundo, titulo, foto, intro, itens, nota, foco='50% 30%'):
    """Título + foto + frase sublinhada + lista numerada (1. 2. 3.)."""
    css = '''
  ol.num { list-style:none; counter-reset:n; margin-top:26px; }
  ol.num li { counter-increment:n; font-size:34px; line-height:1.3; font-weight:500; padding-left:56px; position:relative; margin-bottom:12px; letter-spacing:-0.015em; }
  ol.num li::before { content:counter(n) "."; position:absolute; left:0; font-family:'JetBrains Mono'; font-weight:700; }
  .azul ol.num li::before { color:var(--laranja); } .branco ol.num li::before { color:var(--azul); }'''
    lis = ''.join(f'<li>{_fmt(i)}</li>' for i in itens)
    body = f'''
  <h2 class="h">{_fmt(titulo)}</h2>
  <img class="foto" src="{IMAGENS}/{foto}" style="height:380px;margin:40px 0 36px;object-position:{foco}" alt="">
  <p class="p" style="font-weight:700"><span class="sub">{_fmt(intro)}</span></p>
  <ol class="num">{lis}</ol>
  <div class="spacer"></div>
  <p class="nota">{_fmt(nota)}</p>'''
    return (fundo, body, css)


def iba(titulo, corpo, itens, bloco):
    """Slide da oferta (fundo branco) com bloco azul + Nó."""
    css = '''
  .bloco { background:var(--azul); color:#fff; border-radius:24px; padding:44px 48px; display:flex; align-items:center; gap:36px; }
  .bloco p { font-family:'Archivo'; font-weight:800; font-size:50px; line-height:1.08; letter-spacing:-0.02em; flex:1; }
  .bloco img { width:150px; }'''
    body = f'''
  <h2 class="h" style="font-size:84px">{_fmt(titulo)}</h2>
  <hr>
  <p class="p">{_fmt(corpo)}</p>
  {_setas(itens, 'margin-top:34px')}
  <div class="spacer"></div>
  <div class="bloco"><p>{_fmt(bloco)}</p><img src="{MODELO}/marca/no-branco.png" alt=""></div>'''
    return ('branco', body, css)


def cta(titulo, pergunta, foto, palavra, depois, foco='50% 45%'):
    """Último slide (fundo azul): pergunta + foto + botão laranja "Comenta PALAVRA" + Nó."""
    css = '''
  .cta { background:var(--laranja); color:var(--tinta); border-radius:999px; padding:26px 44px; font-family:'Archivo'; font-weight:800; font-size:54px; letter-spacing:-0.02em; text-align:center; }
  .cta b { font-weight:900; }
  .assina { display:flex; align-items:center; gap:22px; font-size:28px; font-weight:600; opacity:.95; }
  .assina img { width:84px; }'''
    body = f'''
  <h2 class="h">{_fmt(titulo)}</h2>
  <p class="p" style="margin-top:22px;font-size:44px;font-weight:700;color:var(--laranja)">{_fmt(pergunta)}</p>
  <img class="foto" src="{IMAGENS}/{foto}" style="height:400px;margin:40px 0 44px;object-position:{foco}" alt="">
  <div class="cta">Comenta <b>"{html.escape(palavra)}"</b></div>
  <p class="p" style="margin-top:28px;font-size:34px">{_fmt(depois)}</p>
  <div class="spacer"></div>
  <div class="assina"><img src="{MODELO}/marca/no-branco.png" alt=""><span>a IBA dá um nó nos seus processos 🐙</span></div>'''
    return ('azul', body, css)


# ---------------------------------------------------------------- saída

def gerar(pasta_tema, slides):
    """Escreve instagram/slide-XX.html para cada slide da lista."""
    out = os.path.join(pasta_tema, 'instagram')
    os.makedirs(out, exist_ok=True)
    total = len(slides)
    for n, (cls, body, css) in enumerate(slides, start=1):
        doc = f'''<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><link rel="stylesheet" href="{MODELO}/style.css">
<style>{css}</style></head>
<body>
<div class="slide {cls}">
  <div class="topo"><span>IBA Estúdios</span><span>@ibaestudios</span><span class="num">{n:02d}/{total:02d}</span></div>
{body}
</div>
</body></html>
'''
        with open(os.path.join(out, f'slide-{n:02d}.html'), 'w') as f:
            f.write(doc)
    print(f'{total} slides em {out}')
