import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '_modelo'))
from iba_carrossel import *
slides = [
    passos('branco', 'Automação sem medida vira custo. *Estes 3 números dizem se ela está de pé.*',
           [('Tempo até a primeira resposta', 'é o que o cliente sente e o que muda mais rápido quando a base está boa.'),
            ('Quanto a IA resolve sem passar para uma pessoa', 'número baixo indica base incompleta, não modelo ruim.'),
            ('Conversas que ficaram sem resposta nenhuma', 'é o único número que a média esconde.')],
           'Nada disso exige painel novo: os 3 saem do histórico de WhatsApp e de Instagram.'),
]
gerar(os.path.dirname(os.path.abspath(__file__)), slides)
