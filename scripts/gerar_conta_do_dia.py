# -*- coding: utf-8 -*-
"""Gerador de "A Conta do dia": o jogo diario de aritmetica dos Jogos IBA.

Em uma linha: todo dia um alvo e um tamanho de conta, e ganha quem escreve qualquer conta
valida, com esse tanto exato de caracteres, que chegue no alvo.

Decisoes, e por que cada uma:

1. O jogo valida REGRA, nao gabarito. Qualquer conta valida vence, igual ao No do dia, que
   aceita qualquer arranjo que respeite as quatro regras. Consequencia boa: o arquivo
   publicado traz alvo, tamanho, quantas respostas existem e UMA delas, para quem pedir.
2. A dificuldade sai de medicao, nao de gosto. Contando por forca bruta, com o avaliador
   obvio deste arquivo (medicao em 29/09/2026, no servidor):

   - alvo de 3 digitos com exatamente 4 caracteres: 357 alvos, mediana de 2 respostas,
     pior caso 24. E o dia apertado, de fatorar de cabeca ("408 = 51*8").
   - alvo de 4 digitos com exatamente 5 caracteres: 4173 alvos, mediana de 4 respostas.
   - alvo de 3 digitos com exatamente 5 caracteres: mediana de 37 respostas, mole demais.

   Por isso o tamanho e EXATO, e nao "ate". Com "ate", o mesmo alvo de 3 digitos passa a ter
   centenas de respostas e o dia perde a graca, porque qualquer conta curta fecha.
3. Divisao so exata, sem parenteses, sem virgula, sem zero a esquerda, e a conta precisa ter
   pelo menos um operador (senao escrever o proprio alvo resolveria o dia).
4. Alvo nao se repete no arquivo: os dois pools sao bem maiores que o ano.

Uso:
  python3 gerar_conta_do_dia.py medir          # mede as faixas de dificuldade
  python3 gerar_conta_do_dia.py gerar 400      # escreve o arquivo do jogo
"""
import hashlib
import json
import random
import re
import sys
import time
from datetime import date, timedelta

OPS = "+-*/"
TETOS = (4, 5, 6)
TAMANHO_MAXIMO = max(TETOS)
INICIO_PADRAO = "2026-10-01"
MIN_RESPOSTAS = 2
MAX_RESPOSTAS = 10
DESTINO_PADRAO = "/opt/data/staging-gametools/assets/data/conta-do-dia.json"


def avaliar(expr):
    """Valor inteiro da conta, ou None quando a conta nao vale.

    Precedencia normal (multiplicacao e divisao antes de soma e subtracao), da esquerda para
    a direita dentro de cada nivel, divisao so exata. Versao obvia de proposito: e o oraculo
    do gerador e a referencia da versao em JavaScript que roda no navegador.

    Licao de 28/09/2026, do No do dia: o juiz confiavel foi o contador lento e obvio, nao o
    esperto. Versao esperta sem oraculo e medicao inventada.
    """
    if not re.fullmatch(r"[0-9]+([+\-*/][0-9]+)*", expr):
        return None
    for numero in re.findall(r"[0-9]+", expr):
        if len(numero) > 1 and numero[0] == "0":
            return None
    total = 0
    sinal = 1
    for indice, termo in enumerate(re.split(r"([+\-])", expr)):
        if indice % 2 == 1:
            sinal = 1 if termo == "+" else -1
            continue
        pedacos = re.split(r"([*/])", termo)
        valor = int(pedacos[0])
        posicao = 1
        while posicao < len(pedacos):
            operador = pedacos[posicao]
            outro = int(pedacos[posicao + 1])
            if operador == "*":
                valor *= outro
            else:
                if outro == 0 or valor % outro != 0:
                    return None
                valor //= outro
            posicao += 2
        total += sinal * valor
    return total


def _reparticoes(espaco, partes):
    """Todas as formas de dividir `espaco` em `partes` pedacos de pelo menos 1."""
    if partes == 1:
        yield (espaco,)
        return
    for primeiro in range(1, espaco - partes + 2):
        for resto in _reparticoes(espaco - primeiro, partes - 1):
            yield (primeiro, *resto)


def _numeros(quantidade):
    if quantidade == 1:
        return list("0123456789")
    inicio = 10 ** (quantidade - 1)
    return [str(n) for n in range(inicio, inicio * 10)]


def _montar(prefixo, digitos, saida):
    if not digitos:
        saida.append("".join(prefixo))
        return
    for operador in OPS:
        for numero in _numeros(digitos[0]):
            _montar(prefixo + [operador, numero], digitos[1:], saida)


def contas(quantidade_caracteres):
    """Todas as contas bem formadas com EXATAMENTE esse tanto de caracteres."""
    saida = []
    for quantidade_numeros in range(2, quantidade_caracteres // 2 + 2):
        sobra = quantidade_caracteres - (quantidade_numeros - 1)
        if sobra < quantidade_numeros:
            continue
        for digitos in _reparticoes(sobra, quantidade_numeros):
            if max(digitos) > 3:
                continue
            for inicio in _numeros(digitos[0]):
                _montar([inicio], digitos[1:], saida)
    return saida


def por_alvo(quantidade_caracteres):
    """Conta entra, dicionario alvo para lista de contas validas sai."""
    mapa = {}
    descartadas = 0
    for expr in contas(quantidade_caracteres):
        valor = avaliar(expr)
        if valor is None:
            descartadas += 1
            continue
        if valor < 10 or valor > 9999:
            continue
        mapa.setdefault(valor, []).append(expr)
    return mapa, descartadas


def perfis():
    """Para cada alvo, o menor tamanho que chega nele e as contas validas desse tamanho.

    E o coracao do desenho: o teto do dia e o menor tamanho, entao "no maximo N" tem o mesmo
    conjunto de respostas que "exatamente N", com a regra mais simpatica na tela.
    """
    menor = {}
    validas = {}
    for quantidade in range(1, TAMANHO_MAXIMO + 1):
        inicio = time.time()
        mapa, descartadas = por_alvo(quantidade)
        validas[quantidade] = mapa
        for alvo in mapa:
            menor.setdefault(alvo, quantidade)
        print(f"  {quantidade} caracteres: {sum(len(v) for v in mapa.values())} contas validas, "
              f"{len(mapa)} alvos, {descartadas} descartadas ({time.time() - inicio:.2f} s)")
    return menor, validas


def medir():
    menor, validas = perfis()
    for teto in TETOS:
        alvos = [alvo for alvo, minimo in menor.items() if minimo == teto]
        print(f"\nteto {teto}: {len(alvos)} alvos")
        for digitos in (2, 3, 4):
            contagens = sorted(len(validas[teto][alvo]) for alvo in alvos
                               if len(str(alvo)) == digitos)
            if not contagens:
                continue
            print(f"   alvo de {digitos} digitos: {len(contagens)} alvos | respostas min "
                  f"{contagens[0]} mediana {contagens[len(contagens) // 2]} max {contagens[-1]}")
    com_soma = [alvo for alvo, minimo in menor.items() if minimo == 6
                and any(("+" in conta or "-" in conta) for conta in validas[6][alvo])]
    print(f"\nteto 6 com soma ou subtracao entre as respostas: {len(com_soma)} alvos")
    for alvo in sorted(com_soma)[:5]:
        print(f"   {alvo}: {sorted(validas[6][alvo])[:3]}")
    print(f"\nfaixa escolhida por dia: de {MIN_RESPOSTAS} a {MAX_RESPOSTAS} respostas")


def escolher_ano(dias, inicio_iso, menor, validas):
    """Escolhe alvo e teto de cada dia. Determinista: mesma entrada, mesmo arquivo."""
    pools = {}
    for teto in TETOS:
        candidatos = sorted(alvo for alvo, minimo in menor.items()
                            if minimo == teto
                            and MIN_RESPOSTAS <= len(validas[teto][alvo]) <= MAX_RESPOSTAS)
        pools[teto] = candidatos
        operadores = {}
        for alvo in candidatos:
            for conta in validas[teto][alvo]:
                for operador in OPS:
                    if operador in conta:
                        operadores[operador] = operadores.get(operador, 0) + 1
        print(f"teto {teto}: {len(candidatos)} alvos na faixa | operadores possiveis {operadores}")

    necessarios = {teto: sum(1 for i in range(dias) if TETOS[i % len(TETOS)] == teto) for teto in TETOS}
    for teto in TETOS:
        if len(pools[teto]) < necessarios[teto]:
            raise SystemExit(f"faltam alvos para o teto {teto}: {len(pools[teto])} disponiveis, "
                             f"{necessarios[teto]} necessarios")

    sorteio = random.Random(int(hashlib.sha256(b"conta-do-dia|jogos-iba").hexdigest()[:8], 16))
    sorteado = {}
    for teto in TETOS:
        lista = list(pools[teto])
        sorteio.shuffle(lista)
        sorteado[teto] = iter(lista)

    inicio = date.fromisoformat(inicio_iso)
    saida = []
    usados = set()
    for i in range(dias):
        teto = TETOS[i % len(TETOS)]
        # alvo nao se repete no arquivo: o mesmo numero pode ser alvo de tetos diferentes.
        # Foi o proprio conferir() que pegou a repeticao, na primeira geracao do ano.
        alvo = next(sorteado[teto])
        while alvo in usados:
            alvo = next(sorteado[teto])
        usados.add(alvo)
        respostas = sorted(validas[teto][alvo])
        saida.append({
            "n": i + 1,
            "data": (inicio + timedelta(days=i)).isoformat(),
            "alvo": alvo,
            "caracteres": teto,
            "respostas": len(respostas),
            "exemplo": respostas[0],
        })
    return saida


def conferir(lista):
    """Confere item por item e devolve os problemas. Conferencia silenciosa nao confere.

    Repete a medicao do zero, de proposito: o conferidor nao usa o resultado do gerador, senao
    ele so confirma a si mesmo. Ainda verifica que nenhum dia tem resposta mais curta que o teto.
    """
    problemas = []
    menor = {}
    validas = {}
    for quantidade in range(1, TAMANHO_MAXIMO + 1):
        mapa, _ = por_alvo(quantidade)
        validas[quantidade] = mapa
        for alvo in mapa:
            menor.setdefault(alvo, quantidade)

    for item in lista:
        valor = avaliar(item["exemplo"])
        if valor != item["alvo"]:
            problemas.append(f"dia {item['n']}: exemplo {item['exemplo']} da {valor}, "
                             f"esperado {item['alvo']}")
        if len(item["exemplo"]) != item["caracteres"]:
            problemas.append(f"dia {item['n']}: exemplo com {len(item['exemplo'])} caracteres, "
                             f"esperado {item['caracteres']}")
        if not any(operador in item["exemplo"] for operador in OPS):
            problemas.append(f"dia {item['n']}: exemplo sem operador")
        if item["caracteres"] != menor.get(item["alvo"]):
            problemas.append(f"dia {item['n']}: existe resposta mais curta que o teto "
                             f"({menor.get(item['alvo'])} caracteres)")
        if item["respostas"] != len(validas[item["caracteres"]].get(item["alvo"], [])):
            problemas.append(f"dia {item['n']}: contagem de respostas divergente "
                             f"(arquivo diz {item['respostas']})")
        if item["respostas"] < MIN_RESPOSTAS:
            problemas.append(f"dia {item['n']}: alvo com {item['respostas']} respostas")
    datas = [item["data"] for item in lista]
    if datas != sorted(datas) or len(set(datas)) != len(datas):
        problemas.append("datas fora de ordem ou repetidas")
    alvos = [item["alvo"] for item in lista]
    if len(set(alvos)) != len(alvos):
        problemas.append("alvo repetido no ano")
    return problemas


def gerar(dias, inicio_iso, destino):
    inicio = time.time()
    print("medindo os alvos, por tamanho de conta:")
    menor, validas = perfis()
    lista = escolher_ano(dias, inicio_iso, menor, validas)
    problemas = conferir(lista)
    if problemas:
        for problema in problemas:
            print("PROBLEMA:", problema)
        raise SystemExit(1)

    pacote = {"jogo": "A Conta do dia", "inicio": inicio_iso, "dias": lista}
    with open(destino, "w", encoding="utf-8") as arquivo:
        json.dump(pacote, arquivo, ensure_ascii=False, separators=(",", ":"))

    with open(destino, "rb") as arquivo:
        tamanho = len(arquivo.read())
    por_teto = {teto: sum(1 for item in lista if item["caracteres"] == teto) for teto in TETOS}

    print(f"\narquivo {destino}")
    print(f"  dias ................. {len(lista)}, de {lista[0]['data']} a {lista[-1]['data']}")
    print(f"  por teto ............. {por_teto}")
    print(f"  respostas por dia .... {min(item['respostas'] for item in lista)} "
          f"a {max(item['respostas'] for item in lista)}")
    print(f"  tamanho do arquivo ... {tamanho} bytes ({tamanho / len(lista):.1f} por dia)")
    print(f"  tempo ................ {time.time() - inicio:.1f} s")
    print("  conferencia .......... cada dia reavaliado do zero, sem problema")


if __name__ == "__main__":
    comando = sys.argv[1] if len(sys.argv) > 1 else "medir"
    if comando == "medir":
        medir()
    elif comando == "corpus":
        # Corpus para o teste de paridade com o JavaScript: a mesma regra escrita duas vezes
        # divergem na primeira pressa, entao o navegador e conferido contra o gerador.
        casos = []
        for quantidade in range(1, TAMANHO_MAXIMO + 1):
            lista = contas(quantidade)
            passo = 1 if quantidade <= 3 else 97
            for expr in lista[::passo]:
                casos.append([expr, avaliar(expr)])
        destino = sys.argv[2] if len(sys.argv) > 2 else "corpus-conta.json"
        with open(destino, "w", encoding="utf-8") as arquivo:
            json.dump({"casos": casos}, arquivo, ensure_ascii=False, separators=(",", ":"))
        print(f"{len(casos)} casos escritos em {destino}")
    else:
        gerar(
            int(sys.argv[2]) if len(sys.argv) > 2 else 400,
            sys.argv[3] if len(sys.argv) > 3 else INICIO_PADRAO,
            sys.argv[4] if len(sys.argv) > 4 else DESTINO_PADRAO,
        )
