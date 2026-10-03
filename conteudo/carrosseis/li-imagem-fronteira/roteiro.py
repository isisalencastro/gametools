import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '_modelo'))
from iba_carrossel import *
slides = [
    texto('branco', 'O atendimento responde primeiro. *A decisão continua com uma pessoa.*',
          'É assim que a operação da IBA Estudio funciona. A tentação é deixar o sistema responder tudo, e o problema aparece na primeira conversa que sai do roteiro.',
          'O que você define antes de escolher a ferramenta:', ['O que a IA responde sozinha', 'O que ela responde com revisão', 'O que vai direto para alguém do time'], tam_titulo=76),
]
gerar(os.path.dirname(os.path.abspath(__file__)), slides)
