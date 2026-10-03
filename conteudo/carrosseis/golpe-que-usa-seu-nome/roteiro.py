import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '_modelo'))
from iba_carrossel import *

# Pauta: golpes que usam o nome da empresa no WhatsApp.
# Fonte: Global Anti-Scam Alliance, "State of Scams in Brazil", agosto de 2026
# (via MobileTime 06/08/2026, Roole 23/09/2026 e TI Inside 30/08/2026).
slides = [
    capa('capa.jpg', 'Tem um golpe se passando', 'pela sua loja', 'O cliente procura, acha e não sabe em quem confiar',
         fundo='branco', foto_css='width:1200px;height:1800px;left:-60px;top:-430px'),
    texto('branco', 'O golpista parou de mandar texto genérico. Ele agora copia *a sua loja*.',
          'O relatório State of Scams in Brazil, da Global Anti-Scam Alliance, saiu em agosto. O criminoso não manda mais aquele texto esquisito para todo mundo: ele monta o perfil da sua loja, usa a sua logo e conversa como se fosse o seu atendimento.',
          'O que isso mexe:', ['A confiança de quem te procura pela primeira vez',
                               'O nome da sua marca, queimado por um golpe que não é seu',
                               'O cliente que some sem reclamar, porque achou que você aplicou o golpe']),
    numero('azul', 'De onde vem essa informação?',
           'Relatório State of Scams in Brazil, da Global Anti-Scam Alliance, divulgado em agosto de 2026:',
           '64%', 'das tentativas de golpe no Brasil passam pelo WhatsApp.',
           'É o canal onde o seu negócio atende todo dia.',
           'No mesmo relatório, 16,5 milhões de brasileiros perderam dinheiro, com prejuízo estimado em **R$ 21,2 bilhões**.',
           'Nada de achismo. *Só número.*'),
    foto_xis('branco', 'O que *ficou velho* na conversa sobre golpe?', 'perfil-falso.jpg',
             ['"Golpe é problema do banco"', '"Quem cai é quem não presta atenção"',
              '"Basta avisar os clientes no story"', '"Golpe só pega quem vende pela internet"'],
             'Nenhuma dessas crenças devolve o dinheiro do seu cliente nem limpa o nome da sua loja.', foco='50% 40%'),
    stats('branco', 'O golpe tem número, e ele é *alto*.',
          [('R$ 21,2 bi', 'de prejuízo estimado com golpes no país em um ano (Global Anti-Scam Alliance, agosto de 2026).'),
           ('26%', 'das vítimas perdem o dinheiro em **minutos** depois do primeiro contato, segundo o mesmo relatório.')],
          'Fontes: Global Anti-Scam Alliance, State of Scams in Brazil, agosto de 2026; via MobileTime (06/08/2026), Roole (23/09/2026) e TI Inside (30/08/2026).'),
    conversa('azul', 'A conversa que o seu cliente tem *sem você*.', 'Sua loja (perfil falso)',
             [('out', 'Oi! Vi que vocês estão com 50% hoje', '14:02'),
              ('in', 'Isso! Últimas unidades, garante com o Pix', '14:03'),
              ('in', 'Chave: pagamento@exemplo.com', '14:03'),
              ('out', 'Paguei, manda o endereço', '14:07')],
             'O cliente paga achando que está comprando de você. Quando percebe, o dinheiro saiu, o produto não existe e a primeira ligação é para a sua loja.',
             'O prejuízo fica com o seu cliente. A desconfiança fica com a sua marca.'),
    passos('branco', 'Anatomia de um cliente que *confere antes de pagar*:',
           [('Procura o nome do negócio no Google', 'o primeiro resultado já diz muito.'),
            ('Confere o número do perfil', 'bate com o número do anúncio e do site?'),
            ('Olha se existe site com endereço e contato', 'sem isso, a decisão fica no escuro.'),
            ('Pergunta no direct se a promoção é real', 'quem responde rápido desfaz a dúvida.')],
           'Cada checagem dessas é uma chance de encontrar você, ou de cair no golpe.'),
    foto_lista('azul', 'Dá pra blindar o seu nome *sem virar especialista*?', 'atendimento.jpg',
               'Dá. O que o golpista não consegue copiar é a sua presença oficial:',
               ['Um canal oficial: site com endereço, telefone e o número que aparece no Google.',
                'Um aviso fixo no perfil e no status: nunca pedimos Pix por mensagem.',
                'Resposta rápida na DM: quem responde em minutos deixa menos espaço para o golpista.'],
               'O cliente decide em quem confiar nos primeiros minutos de procura.', foco='50% 45%'),
    iba('É isso que a *IBA* monta para você.', 'Site com os contatos oficiais e atendimento no WhatsApp que responde na hora.',
        ['Site com endereço, telefone e caminho de contato', 'Atendimento no WhatsApp que responde fora do horário',
         'Conversas organizadas, com quem é quem no lugar'],
        'Você não precisa entender de tecnologia. A gente cuida disso.'),
    cta('O que o seu cliente encontra quando procura o seu negócio?',
        'Antes de pagar, ele consegue confirmar que o canal é o seu?',
        'balcao.jpg', 'SEGURANCA',
        'e eu te mando uma análise gratuita: 2 a 3 pontos onde o seu negócio perde cliente hoje.', foco='50% 35%'),
]

gerar(os.path.dirname(os.path.abspath(__file__)), slides)
