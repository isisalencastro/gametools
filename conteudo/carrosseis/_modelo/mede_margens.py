"""Mede as margens dos PNGs de um carrossel ja renderizado.

Uso:  /opt/data/.venv/bin/python conteudo/carrosseis/_modelo/mede_margens.py <tema>

Regra do formato: 72px nas laterais e 80px na base. Saem da conta o slide 1 (capa, com foto
em tela cheia) e o slide 6 (conversa, cujo painel e largo por desenho, igual aos carrosseis
ja aprovados).

Quando acusa, quase sempre e uma destas duas coisas:
- layout `texto` com corpo comprido: o texto empurra a base para fora (encurtar ou passar
  tam_titulo/tam_corpo menores);
- layout `numero` com numero longo: o corpo do numero estoura a direita (o modelo ja reduz
  o tamanho pelo comprimento do numero).

Sai com codigo 1 quando algum slide fica fora da margem.
"""
import os
import sys
from collections import Counter

try:
    from PIL import Image, ImageChops
except ImportError:
    sys.exit("precisa do Pillow: rode com /opt/data/.venv/bin/python")

ESQ = DIR = 72
BASE = 80
IGNORAR = {1, 6}
TOLERANCIA = 3


def medir(png):
    im = Image.open(png).convert("RGB")
    largura, altura = im.size
    fundo = Counter(im.get_flattened_data() if hasattr(im, "get_flattened_data") else im.getdata()).most_common(1)[0][0]
    bbox = ImageChops.difference(im, Image.new("RGB", im.size, fundo)).getbbox()
    if not bbox:
        return None
    esq, _, dir_, base = bbox
    return esq, largura - dir_, altura - base


def main(pasta_tema):
    instagram = os.path.join(pasta_tema, "instagram")
    if not os.path.isdir(instagram):
        sys.exit(f"sem pasta instagram em {pasta_tema}")
    pngs = sorted(p for p in os.listdir(instagram) if p.endswith(".png"))
    if not pngs:
        sys.exit(f"sem PNG em {instagram}")
    fora = 0
    print(f"{os.path.basename(pasta_tema.rstrip('/'))}: {len(pngs)} slides")
    for nome in pngs:
        numero = int(nome.split("-")[1].split(".")[0])
        if numero in IGNORAR:
            continue
        m = medir(os.path.join(instagram, nome))
        if m is None:
            print(f"  slide {numero:02d}: vazio")
            continue
        esq, dir_, base = m
        problemas = []
        if esq < ESQ - TOLERANCIA:
            problemas.append(f"esquerda {esq}px (minimo {ESQ})")
        if dir_ < DIR - TOLERANCIA:
            problemas.append(f"direita {dir_}px (minimo {DIR})")
        if base < BASE - TOLERANCIA:
            problemas.append(f"base {base}px (minimo {BASE})")
        if problemas:
            fora += 1
            print(f"  slide {numero:02d}: FORA - " + "; ".join(problemas))
    if fora:
        print(f"resultado: {fora} slide(s) fora da margem")
        return 1
    print("resultado: todas as margens ok")
    return 0


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit("uso: mede_margens.py <pasta do tema>")
    raise SystemExit(main(sys.argv[1]))
