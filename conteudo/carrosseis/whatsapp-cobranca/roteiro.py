import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '_modelo'))
from iba_carrossel import *

# Pauta: Meta passou a cobrar mensagens de atendimento na WhatsApp Business Platform (API) desde 01/10/2026.
slides = [
    capa('capa.jpg', 'O WhatsApp começou a', 'cobrar por mensagem', 'Quem paga, quanto custa e por que você talvez não pague nada',
         foto_css='width:1200px;height:1800px;left:-60px;top:-90px'),
    texto('branco', 'Desde *1º de outubro*, uma mensagem assusta donos de negócio.',
          '"O WhatsApp Business vai ser pago." Ela correu os grupos, chegou nos comerciantes e virou dúvida no balcão. Só que a mudança é bem mais estreita do que parece.',
          'O que você vai descobrir:', ['Quem realmente paga', 'Quanto custa cada mensagem', 'O que fazer no seu negócio']),
    numero('azul', 'De onde vem essa informação?',
           'Regra nova da Meta para a WhatsApp Business Platform (a API), em vigor desde 1º de outubro de 2026:',
           '1.000', 'mensagens de atendimento grátis por mês, por número.',
           'Passou disso, cada mensagem custa **R$ 0,035**.',
           'Fontes: O Tempo, Tribuna de Jundiaí, CartaCapital e Diário do Pará, outubro de 2026.',
           'Nada de boato. *Só a regra.*'),
    foto_xis('branco', 'O que é *boato* nessa história?', 'balcao.jpg',
             ['"O WhatsApp Business do celular vai ser pago"', '"O cliente vai pagar pra te mandar mensagem"', '"Todo pequeno negócio vai ter conta nova"'],
             'Quem atende pelo aplicativo gratuito no celular segue sem pagar nada.', foco='50% 35%'),
    stats('branco', 'A conta *de verdade*.',
          [('1.000', 'mensagens de atendimento por mês continuam **grátis** em cada número.'),
           ('R$140', 'é o custo aproximado de quem manda **5.000 mensagens** no mês: 4.000 pagas a R$ 0,035.')],
          'Fonte: regra da WhatsApp Business Platform (Meta), via Diário do Pará e O Tempo, outubro de 2026.'),
    conversa('azul', 'Mensagem boa ficou *mais valiosa*.', 'Seu negócio',
             [('in', 'Oi, quanto custa a limpeza de pele?', '10:02'),
              ('out', 'Oi! A limpeza é R$ 150 e dura 1h. Tenho horário amanhã às 10h ou às 15h. Qual prefere?', '10:02')],
             'Com cobrança por mensagem, cada "oi, tudo bem?" a mais pesa. Quem responde completo na primeira vez gasta menos e fecha mais rápido.',
             'Conversa enxuta virou economia. E venda.'),
    passos('branco', 'O que as empresas *estão fazendo*:',
           [('Mapear conversas', 'descobrir onde o atendimento anda em círculo.'),
            ('Cortar repetição', 'tirar confirmações e mensagens que não levam a nada.'),
            ('Juntar perguntas', 'pedir as informações de uma vez só.'),
            ('Abrir outros canais', 'site, Instagram e formulários junto com o WhatsApp.')],
           'Estratégias citadas por empresas à CartaCapital, outubro de 2026.'),
    foto_lista('azul', 'E o pequeno negócio, *o que faz*?', 'notebook.jpg', 'Primeiro, descubra qual WhatsApp você usa. Depois:',
               ['Atende só pelo app no celular: segue tudo igual, sem custo novo.',
                'Usa robô ou sistema (API): confira o volume do mês. Até 1.000 mensagens, nada muda.',
                'Passa disso: organize o atendimento para resolver em menos mensagens.'],
               'E o site vira aliado: tira dúvidas antes da conversa começar.', foco='50% 40%'),
    iba('É aqui que a *IBA* entra.', 'A gente olha o seu atendimento e monta o caminho mais barato para o tamanho do seu negócio.',
        ['Diz se você precisa (ou não) de automação', 'Monta conversas que resolvem em poucas mensagens', 'Cria o site que responde as dúvidas antes do WhatsApp'],
        'Você não precisa entender de tecnologia. A gente cuida disso.'),
    cta('Ficou na dúvida se isso te afeta?', 'A gente confere pra você.', 'cta.jpg', 'WHATSAPP',
        'e eu te mando uma análise gratuita: qual WhatsApp você usa, se vai pagar algo e como atender gastando menos.', foco='50% 30%'),
]

gerar(os.path.dirname(os.path.abspath(__file__)), slides)
