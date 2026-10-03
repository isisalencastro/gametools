import os
os.chdir(os.path.dirname(os.path.abspath(__file__)))

def page(n, cls, body, css=''):
    html = f'''<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><link rel="stylesheet" href="style.css">
<style>{css}</style></head>
<body>
<div class="slide {cls}">
  <div class="topo"><span>IBA Estúdios</span><span>@ibaestudios</span><span class="num">{n:02d}/10</span></div>
{body}
</div>
</body></html>
'''
    open(f'slide-{n:02d}.html', 'w').write(html)

# 2 · branco · o cliente mudou
page(2, 'branco', '''
  <h2 class="h" style="font-size:88px">Seu cliente <em>mudou o jeito de comprar</em> e não avisou ninguém.</h2>
  <hr style="margin:56px 0">
  <p class="p" style="font-size:44px">Ele chama no WhatsApp às 22h, compara três lojas ao mesmo tempo e fecha com quem responder primeiro. Quem demora nem fica sabendo que perdeu.</p>
  <div class="spacer"></div>
  <p class="p"><span class="sub">O que isso afeta:</span></p>
  <ul class="setas" style="margin-top:28px">
    <li>Suas vendas do dia</li>
    <li>As indicações que você recebe</li>
    <li>A volta de quem já comprou</li>
  </ul>
''')

# 3 · azul · de onde vem
page(3, 'azul', '''
  <h2 class="h">De onde vem essa informação?</h2>
  <hr>
  <p class="mini" style="font-size:28px;opacity:.8">Uma pesquisa da Opinion Box (junho de 2025, 1.126 pessoas):</p>
  <div class="big"><span class="n">97%</span><span class="t">dos brasileiros usam o WhatsApp todo dia.</span></div>
  <p class="p" style="font-size:42px">54% já compraram produtos e 61% já contrataram serviços pelo app.</p>
  <hr style="margin:56px 0">
  <p class="p" style="font-size:42px">E um estudo da Harvard Business Review que analisou <b class="dest">1,25 milhão</b> de contatos de clientes.</p>
  <div class="spacer"></div>
  <p class="h" style="font-size:64px">Nada de achismo. <em>Só número.</em></p>
''', css='''
  .big { display:flex; align-items:center; gap:36px; margin: 18px 0 26px; }
  .big .n { font-family:'Archivo'; font-stretch:70%; font-weight:900; font-size:250px; line-height:.9; color:var(--laranja); letter-spacing:-0.02em; }
  .big .t { font-family:'Archivo'; font-weight:800; font-size:48px; line-height:1.05; letter-spacing:-0.02em; }
''')

# 4 · branco + foto · o que morreu
page(4, 'branco', '''
  <h2 class="h">O que <em>morreu</em> no atendimento?</h2>
  <img class="foto" src="imagens/espera.jpg" style="height:400px;margin:44px 0 40px;object-position:50% 30%" alt="">
  <ul class="xis">
    <li>"Respondo quando der"</li>
    <li>"Se ele quiser mesmo, ele espera"</li>
    <li>"Quem perde venda é quem cobra caro"</li>
    <li>"Mensagem de sábado fica pra segunda"</li>
  </ul>
  <div class="spacer"></div>
  <p class="nota">Essas frases custam vendas todo dia, e o dono quase nunca percebe.</p>
''', css='''
  .xis { list-style:none; }
  .xis li { font-size:38px; line-height:1.25; font-weight:600; letter-spacing:-0.015em; padding-left:62px; position:relative; margin-bottom:14px; }
  .xis li::before { content:""; position:absolute; left:0; top:6px; width:40px; height:40px; border-radius:8px; background:var(--azul); }
  .xis li::after { content:"✕"; position:absolute; left:0; top:6px; width:40px; height:40px; display:grid; place-items:center; color:#fff; font-size:26px; font-weight:800; }
''')

# 5 · branco · a conta
page(5, 'branco', '''
  <h2 class="h">A conta que <em>ninguém faz</em>.</h2>
  <div class="spacer"></div>
  <div class="stat"><div class="n">7x</div><p class="p">Quem respondeu o cliente <b>em até 1 hora</b> teve 7 vezes mais chance de ter uma conversa de verdade com ele do que quem respondeu depois.</p></div>
  <div class="stat"><div class="n">60x</div><p class="p">Comparado com quem levou <b>um dia inteiro</b>, a chance foi 60 vezes maior.</p></div>
  <div class="spacer"></div>
  <p class="fonte">Fonte: Harvard Business Review, "The Short Life of Online Sales Leads", 2011.</p>
''', css='''
  .stat { display:grid; grid-template-columns: 300px 1fr; align-items:center; gap:36px; padding:40px 0; border-top:2px solid var(--linha-clara); }
  .stat:last-of-type { border-bottom:2px solid var(--linha-clara); }
  .stat .n { font-family:'Archivo'; font-stretch:68%; font-weight:900; font-size:230px; line-height:.85; color:var(--azul); letter-spacing:-0.03em; }
  .stat .n::after { content:""; display:block; width:120px; height:12px; background:var(--laranja); margin-top:14px; }
  .fonte { font-family:'JetBrains Mono'; font-size:22px; color:var(--cinza); line-height:1.4; }
''')

# 6 · azul · a virada + conversa de exemplo
page(6, 'azul', '''
  <h2 class="h" style="font-size:84px">A vantagem do <em>pequeno negócio</em>.</h2>
  <div class="zap">
    <div class="zap-topo"><span class="av"></span><div><b>Sua loja</b><small>online</small></div><span class="tag">EXEMPLO</span></div>
    <div class="zap-corpo">
      <div class="msg in">Oi, vocês fazem bolo pra sábado?<i>22:47</i></div>
      <div class="msg out">Oi! Fazemos sim. Pra quantas pessoas? Já te mando as opções e os preços.<i>22:47 <span class="ok">✓✓</span></i></div>
    </div>
  </div>
  <p class="p" style="font-size:42px">A grande rede tem marca e verba. Você pode responder como gente, na hora, com nome e sobrenome.</p>
  <div class="spacer"></div>
  <p class="h" style="font-size:58px;line-height:1.12"><span class="sub" style="border-bottom-width:6px">Velocidade virou a nova vitrine. Tamanho perdeu importância.</span></p>
''', css='''
  .zap { margin:56px 0 52px; border-radius:24px; overflow:hidden; background:#EFE7DD; box-shadow:0 18px 40px rgba(0,0,0,.25); color:#111B21; }
  .zap-topo { display:flex; align-items:center; gap:18px; padding:20px 26px; background:#F0F2F5; font-size:28px; }
  .zap-topo small { display:block; font-size:20px; color:#667781; }
  .zap-topo .av { width:56px; height:56px; border-radius:50%; background:#D1D7DB; }
  .zap-topo .tag { margin-left:auto; font-family:'JetBrains Mono'; font-weight:700; font-size:18px; padding:6px 12px; border-radius:6px; background:var(--laranja); color:var(--tinta); }
  .zap-corpo { padding:30px 26px 34px; display:flex; flex-direction:column; gap:18px; }
  .msg { max-width:80%; font-size:36px; line-height:1.3; padding:16px 20px 30px; border-radius:16px; position:relative; box-shadow:0 1px 1px rgba(0,0,0,.12); }
  .msg i { position:absolute; right:14px; bottom:6px; font-style:normal; font-size:18px; color:#667781; }
  .msg .ok { color:#53BDEB; }
  .msg.in { background:#fff; align-self:flex-start; border-top-left-radius:4px; }
  .msg.out { background:#D9FDD3; align-self:flex-end; border-top-right-radius:4px; }
''')

# 7 · branco · anatomia
page(7, 'branco', '''
  <h2 class="h">Anatomia de um atendimento <em>que vende</em>:</h2>
  <div class="spacer"></div>
  <div class="passos">
    <div class="passo"><span class="k">01</span><p class="p"><b>Resposta imediata:</b> o cliente sabe em segundos que foi ouvido.</p></div>
    <div class="passo"><span class="k">02</span><p class="p"><b>A pergunta certa:</b> o quê, para quando, para quantas pessoas.</p></div>
    <div class="passo"><span class="k">03</span><p class="p"><b>Preço claro:</b> sem "me chama no privado pra saber".</p></div>
    <div class="passo"><span class="k">04</span><p class="p"><b>Próximo passo:</b> link de pagamento, horário marcado, endereço.</p></div>
  </div>
  <div class="spacer"></div>
  <p class="nota">Quem pula uma dessas etapas deixa o cliente esfriar.</p>
''', css='''
  .passos { border-left:8px solid var(--azul); padding-left:40px; display:flex; flex-direction:column; gap:34px; }
  .passo { display:grid; grid-template-columns:110px 1fr; align-items:start; }
  .passo .k { font-family:'JetBrains Mono'; font-weight:700; font-size:40px; color:var(--tinta); background:var(--laranja); border-radius:10px; width:86px; text-align:center; padding:6px 0; margin-top:2px; }
''')

# 8 · azul + foto · automação
page(8, 'azul', '''
  <h2 class="h">Como fazer isso sem viver no celular?</h2>
  <img class="foto" src="imagens/balcao.jpg" style="height:380px;margin:40px 0 36px;object-position:50% 28%" alt="">
  <p class="p" style="font-weight:700"><span class="sub">É aqui que a automação entra. Montada do jeito certo, ela:</span></p>
  <ol class="num">
    <li>Responde na hora, de dia, de noite e no domingo.</li>
    <li>Faz as perguntas que você faria e separa quem quer comprar.</li>
    <li>Te entrega o cliente pronto, com tudo anotado, para você fechar.</li>
  </ol>
  <div class="spacer"></div>
  <p class="nota">Você continua no comando. Ela só não deixa ninguém esperando.</p>
''', css='''
  ol.num { list-style:none; counter-reset:n; margin-top:26px; }
  ol.num li { counter-increment:n; font-size:34px; line-height:1.3; font-weight:500; padding-left:56px; position:relative; margin-bottom:12px; letter-spacing:-0.015em; }
  ol.num li::before { content:counter(n) "."; position:absolute; left:0; font-family:'JetBrains Mono'; font-weight:700; color:var(--laranja); }
''')

# 9 · branco · a IBA
page(9, 'branco', '''
  <h2 class="h" style="font-size:84px">É isso que a <em>IBA</em> monta para você.</h2>
  <hr>
  <p class="p">Atendimento no WhatsApp funcionando 24 horas, com o jeito de falar do seu negócio.</p>
  <ul class="setas" style="margin-top:34px">
    <li>Conversa direta com quem desenvolve</li>
    <li>Proposta por escrito, sem letra miúda</li>
    <li>Aprovação em cada etapa e suporte depois da entrega</li>
  </ul>
  <div class="spacer"></div>
  <div class="bloco"><p>Você não precisa entender de tecnologia. A gente cuida disso.</p><img src="imagens/no-branco.png" alt=""></div>
''', css='''
  .bloco { background:var(--azul); color:#fff; border-radius:24px; padding:44px 48px; display:flex; align-items:center; gap:36px; }
  .bloco p { font-family:'Archivo'; font-weight:800; font-size:50px; line-height:1.08; letter-spacing:-0.02em; flex:1; }
  .bloco img { width:150px; }
''')

# 10 · azul · CTA
page(10, 'azul', '''
  <h2 class="h">Quantos clientes chamaram ontem à noite?</h2>
  <p class="p" style="margin-top:22px;font-size:44px;font-weight:700;color:var(--laranja)">E quantos você respondeu a tempo?</p>
  <img class="foto" src="imagens/sofa.jpg" style="height:400px;margin:40px 0 44px;object-position:50% 45%" alt="">
  <div class="cta">Comenta <b>"ATENDE"</b></div>
  <p class="p" style="margin-top:28px;font-size:34px">e eu te mando uma análise gratuita do seu WhatsApp, com 2 a 3 pontos onde você está perdendo cliente.</p>
  <div class="spacer"></div>
  <div class="assina"><img src="imagens/no-branco.png" alt=""><span>a IBA dá um nó nos seus processos 🐙</span></div>
''', css='''
  .cta { background:var(--laranja); color:var(--tinta); border-radius:999px; padding:26px 44px; font-family:'Archivo'; font-weight:800; font-size:54px; letter-spacing:-0.02em; text-align:center; }
  .cta b { font-weight:900; }
  .assina { display:flex; align-items:center; gap:22px; font-size:28px; font-weight:600; opacity:.95; }
  .assina img { width:84px; }
''')
print('ok')
