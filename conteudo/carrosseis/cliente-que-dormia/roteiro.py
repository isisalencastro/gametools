import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '_modelo'))
from iba_carrossel import *

slides = [
    capa('capa.jpg', 'O cliente que você', 'perdeu enquanto dormia', 'Por que responder em 1 hora vale 7 vezes mais', brilho=1.35),
    texto('branco', 'Seu cliente *mudou o jeito de comprar* e não avisou ninguém.',
          'Ele chama no WhatsApp às 22h, compara três lojas ao mesmo tempo e fecha com quem responder primeiro. Quem demora nem fica sabendo que perdeu.',
          'O que isso afeta:', ['Suas vendas do dia', 'As indicações que você recebe', 'A volta de quem já comprou']),
    numero('azul', 'De onde vem essa informação?', 'Uma pesquisa da Opinion Box (junho de 2025, 1.126 pessoas):',
           '97%', 'dos brasileiros usam o WhatsApp todo dia.',
           '54% já compraram produtos e 61% já contrataram serviços pelo app.',
           'E um estudo da Harvard Business Review que analisou **1,25 milhão** de contatos de clientes.',
           'Nada de achismo. *Só número.*'),
    foto_xis('branco', 'O que *morreu* no atendimento?', 'espera.jpg',
             ['"Respondo quando der"', '"Se ele quiser mesmo, ele espera"', '"Quem perde venda é quem cobra caro"', '"Mensagem de sábado fica pra segunda"'],
             'Essas frases custam vendas todo dia, e o dono quase nunca percebe.'),
    stats('branco', 'A conta que *ninguém faz*.',
          [('7x', 'Quem respondeu o cliente **em até 1 hora** teve 7 vezes mais chance de ter uma conversa de verdade com ele do que quem respondeu depois.'),
           ('60x', 'Comparado com quem levou **um dia inteiro**, a chance foi 60 vezes maior.')],
          'Fonte: Harvard Business Review, "The Short Life of Online Sales Leads", 2011.'),
    conversa('azul', 'A vantagem do *pequeno negócio*.', 'Sua loja',
             [('in', 'Oi, vocês fazem bolo pra sábado?', '22:47'), ('out', 'Oi! Fazemos sim. Pra quantas pessoas? Já te mando as opções e os preços.', '22:47')],
             'A grande rede tem marca e verba. Você pode responder como gente, na hora, com nome e sobrenome.',
             'Velocidade virou a nova vitrine. Tamanho perdeu importância.'),
    passos('branco', 'Anatomia de um atendimento *que vende*:',
           [('Resposta imediata', 'o cliente sabe em segundos que foi ouvido.'), ('A pergunta certa', 'o quê, para quando, para quantas pessoas.'),
            ('Preço claro', 'sem "me chama no privado pra saber".'), ('Próximo passo', 'link de pagamento, horário marcado, endereço.')],
           'Quem pula uma dessas etapas deixa o cliente esfriar.'),
    foto_lista('azul', 'Como fazer isso sem viver no celular?', 'balcao.jpg', 'É aqui que a automação entra. Montada do jeito certo, ela:',
               ['Responde na hora, de dia, de noite e no domingo.', 'Faz as perguntas que você faria e separa quem quer comprar.', 'Te entrega o cliente pronto, com tudo anotado, para você fechar.'],
               'Você continua no comando. Ela só não deixa ninguém esperando.', foco='50% 28%'),
    iba('É isso que a *IBA* monta para você.', 'Atendimento no WhatsApp funcionando 24 horas, com o jeito de falar do seu negócio.',
        ['Conversa direta com quem desenvolve', 'Proposta por escrito, sem letra miúda', 'Aprovação em cada etapa e suporte depois da entrega'],
        'Você não precisa entender de tecnologia. A gente cuida disso.'),
    cta('Quantos clientes chamaram ontem à noite?', 'E quantos você respondeu a tempo?', 'sofa.jpg', 'ATENDE',
        'e eu te mando uma análise gratuita do seu WhatsApp, com 2 a 3 pontos onde você está perdendo cliente.'),
]

gerar(os.path.dirname(os.path.abspath(__file__)), slides)
