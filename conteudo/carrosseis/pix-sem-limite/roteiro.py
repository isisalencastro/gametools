import os, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '_modelo'))
from iba_carrossel import *

# Pauta: Banco Central tirou o teto de R$ 500 do Pix por aproximação em 01/10/2026 + Pix = 64% dos pagamentos das PMEs (Asaas).
slides = [
    capa('capa.jpg', 'O Pix por aproximação', 'perdeu o limite de R$ 500', 'O que muda no caixa do seu negócio a partir de agora',
         foto_css='width:1200px;height:1800px;left:-60px;top:-700px'),
    texto('branco', 'Seu cliente agora pode *pagar encostando o celular*, sem teto fixo.',
          'Desde 1º de outubro, o Banco Central tirou o limite de R$ 500 por compra no Pix por aproximação. Agora vale o limite que cada cliente define no próprio banco.',
          'O que isso mexe:', ['A velocidade do seu caixa', 'As compras de valor mais alto', 'O jeito de cobrar no balcão e no WhatsApp']),
    numero('azul', 'De onde vem essa informação?',
           'Estudo da Asaas com mais de 300 mil clientes (2021 a setembro de 2026):',
           '64%', 'dos pagamentos de pequenas e médias empresas são via Pix.',
           'O boleto ficou com 19%.',
           'E a regra nova vem da Instrução Normativa **BCB nº 746**, publicada em junho de 2026.',
           'Nada de achismo. *Só número.*'),
    foto_xis('branco', 'O que *ficou velho* no caixa?', 'dono-loja.jpg',
             ['"Me passa a chave que eu confiro depois"', '"Pix só pra valor pequeno"', '"Manda o comprovante no WhatsApp"', '"Cobrança a gente faz no fim do mês"'],
             'Cada etapa manual no pagamento é uma chance de erro, atraso ou desistência.', foco='50% 68%'),
    stats('branco', 'O Pix *já ganhou* o caixa.',
          [('64%', 'dos pagamentos das pequenas e médias empresas em 2026 foram via **Pix** (Asaas).'),
           ('80 bi', 'de transações Pix no Brasil em 2025, **25,7%** a mais que no ano anterior (Banco Central).')],
          'Fontes: Asaas via Central do Varejo; Banco Central via Symplexia; outubro de 2026.'),
    conversa('azul', 'Venda boa termina *com o Pix na mão*.', 'Seu negócio',
             [('in', 'Fechado! Como eu pago?', '18:31'),
              ('out', 'Perfeito! Aqui está o Pix copia e cola de R$ 180. Assim que cair, já confirmo seu pedido por aqui.', '18:31')],
             'O cliente decidiu. O pior que pode acontecer agora é ele esperar você achar a chave, calcular o valor e conferir o extrato.',
             'Pagamento rápido também é atendimento.'),
    passos('branco', 'Anatomia de uma *cobrança sem atrito*:',
           [('Valor certo', 'o cliente recebe o total, sem conta de cabeça.'),
            ('Pix pronto', 'copia e cola ou QR Code na hora, sem digitar chave.'),
            ('Confirmação automática', 'o pagamento caiu, o pedido segue.'),
            ('Tudo registrado', 'sem caçar print de comprovante no WhatsApp.')],
           'Quanto menos o cliente precisa fazer, mais rápido o dinheiro entra.'),
    foto_lista('azul', 'Dá pra fazer isso *sem uma equipe*?', 'balcao.jpg', 'Dá. Com automação no WhatsApp e no site, o sistema:',
               ['Gera o Pix com o valor certo no fim da conversa.', 'Avisa você quando o pagamento cai.', 'Registra o pedido sem você digitar nada.'],
               'Você cuida da venda. A parte chata fica com o sistema.', foco='50% 58%'),
    iba('É isso que a *IBA* monta para você.', 'Site e atendimento no WhatsApp com o pagamento por Pix no meio da conversa.',
        ['Pix copia e cola gerado na hora', 'Aviso de pagamento e pedido organizado', 'Conversa direta com quem desenvolve'],
        'Você não precisa entender de tecnologia. A gente cuida disso.'),
    cta('Quanto tempo você gasta conferindo Pix por dia?', 'Dá pra gastar quase nada.', 'cta.jpg', 'PIX',
        'e eu te mando uma análise gratuita de como o seu negócio cobra hoje e onde dá pra acelerar.', foco='50% 30%'),
]

gerar(os.path.dirname(os.path.abspath(__file__)), slides)
