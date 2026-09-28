import { copyToClipboard } from '../common/utils.js';
import { fireConfetti } from '../common/confetti.js';

const CATEGORIES = [
  { id: 'todas', name: 'Todas as Categorias', icon: '🎲', color: 'var(--accent)' },
  { id: 'ciencia', name: 'Ciência', icon: '🔬', color: 'var(--mint)' },
  { id: 'matematica', name: 'Matemática', icon: '🔢', color: 'var(--sky)' },
  { id: 'tecnologia', name: 'Tecnologia', icon: '💻', color: 'var(--lavender)' },
  { id: 'geografia', name: 'Geografia', icon: '🌍', color: 'var(--peach)' },
  { id: 'historia', name: 'História', icon: '📜', color: 'var(--yellow)' },
  { id: 'arte', name: 'Arte e Cultura', icon: '🎨', color: 'var(--lavender)' },
  { id: 'esportes', name: 'Esportes', icon: '⚽', color: 'var(--mint)' },
  { id: 'natureza', name: 'Natureza', icon: '🌿', color: 'var(--mint)' },
  { id: 'portugues', name: 'Língua Portuguesa', icon: '📝', color: 'var(--sky)' },
  { id: 'cinema', name: 'Cinema e TV', icon: '🎬', color: 'var(--peach)' },
];

const QUESTIONS = [
  // ===== CIÊNCIA =====
  { q: 'Qual planeta é conhecido como planeta vermelho?', options: ['Vênus', 'Marte', 'Júpiter', 'Mercúrio'], a: 1, category: 'ciencia', type: 'multiple' },
  { q: 'Qual destes é um mamífero?', options: ['Tubarão', 'Golfinho', 'Polvo', 'Sardinha'], a: 1, category: 'ciencia', type: 'multiple' },
  { q: 'Qual cor surge da mistura de azul com amarelo?', options: ['Roxo', 'Verde', 'Laranja', 'Rosa'], a: 1, category: 'ciencia', type: 'multiple' },
  { q: 'Qual é o maior planeta do Sistema Solar?', options: ['Saturno', 'Netuno', 'Júpiter', 'Urano'], a: 2, category: 'ciencia', type: 'multiple' },
  { q: 'Qual é o elemento químico representado pela letra O?', options: ['Ouro', 'Ósmio', 'Oxigênio', 'Ônio'], a: 2, category: 'ciencia', type: 'multiple' },
  { q: 'Qual gás as plantas absorvem da atmosfera?', options: ['Oxigênio', 'Nitrogênio', 'Gás carbônico', 'Hélio'], a: 2, category: 'ciencia', type: 'multiple' },
  { q: 'Quantos ossos tem o corpo humano adulto?', options: ['196', '206', '216', '186'], a: 1, category: 'ciencia', type: 'multiple' },
  { q: 'Qual é a fórmula da água?', options: ['CO2', 'NaCl', 'H2O', 'O2'], a: 2, category: 'ciencia', type: 'multiple' },
  { q: 'Quantas horas tem um dia?', options: ['20', '22', '24', '26'], a: 2, category: 'ciencia', type: 'multiple' },
  { q: 'Qual o nome do satélite natural da Terra?', options: ['Sol', 'Lua', 'Marte', 'Vênus'], a: 1, category: 'ciencia', type: 'multiple' },
  { q: 'Qual o nome do processo de transformação de lagarta em borboleta?', options: ['Mutação', 'Metamorfose', 'Mimetismo', 'Simbiose'], a: 1, category: 'ciencia', type: 'multiple' },
  { q: 'Qual vitamina é obtida pela exposição ao sol?', options: ['Vitamina A', 'Vitamina B', 'Vitamina C', 'Vitamina D'], a: 3, category: 'ciencia', type: 'multiple' },
  { q: 'Qual é o metal mais leve?', options: ['Alumínio', 'Lítio', 'Ferro', 'Magnésio'], a: 1, category: 'ciencia', type: 'multiple' },
  { q: 'Qual é o animal terrestre mais rápido do mundo?', options: ['Leão', 'Cavalo', 'Guepardo', 'Antílope'], a: 2, category: 'ciencia', type: 'multiple' },
  { q: 'Qual é o símbolo químico do ouro?', options: ['Or', 'Au', 'Ag', 'Go'], a: 1, category: 'ciencia', type: 'multiple' },
  { q: 'Qual animal é famoso por sua lentidão?', options: ['Leão', 'Preguiça', 'Águia', 'Cavalo'], a: 1, category: 'ciencia', type: 'multiple' },
  { q: 'A velocidade da luz é maior que a velocidade do som.', options: ['Verdadeiro', 'Falso'], a: 0, category: 'ciencia', type: 'boolean' },
  { q: 'O coração humano tem 6 câmaras.', options: ['Verdadeiro', 'Falso'], a: 1, category: 'ciencia', type: 'boolean' },
  { q: 'A água ferve a 100°C ao nível do mar.', options: ['Verdadeiro', 'Falso'], a: 0, category: 'ciencia', type: 'boolean' },
  { q: 'Os elétrons têm carga positiva.', options: ['Verdadeiro', 'Falso'], a: 1, category: 'ciencia', type: 'boolean' },
  { q: 'O DNA tem forma de dupla hélice.', options: ['Verdadeiro', 'Falso'], a: 0, category: 'ciencia', type: 'boolean' },
  { q: 'O som pode se propagar no vácuo.', options: ['Verdadeiro', 'Falso'], a: 1, category: 'ciencia', type: 'boolean' },
  { q: 'Diamantes são feitos de carbono puro.', options: ['Verdadeiro', 'Falso'], a: 0, category: 'ciencia', type: 'boolean' },
  { q: 'O processo pelo qual as plantas produzem seu alimento chama-se...', options: ['Respiração', 'Fotossíntese', 'Fermentação', 'Decomposição'], a: 1, category: 'ciencia', type: 'complete' },
  { q: 'O gás mais abundante na atmosfera terrestre é o...', options: ['Oxigênio', 'Nitrogênio', 'Gás carbônico', 'Argônio'], a: 1, category: 'ciencia', type: 'complete' },
  { q: 'O órgão responsável por bombear sangue no corpo é o...', options: ['Pulmão', 'Fígado', 'Coração', 'Rim'], a: 2, category: 'ciencia', type: 'complete' },
  { q: 'A unidade de medida de força no Sistema Internacional é o...', options: ['Joule', 'Watt', 'Pascal', 'Newton'], a: 3, category: 'ciencia', type: 'complete' },

  // ===== MATEMÁTICA =====
  { q: 'Quanto é 9 x 7?', options: ['56', '63', '72', '49'], a: 1, category: 'matematica', type: 'multiple' },
  { q: 'Quantos segundos há em 2 minutos?', options: ['120', '60', '90', '180'], a: 0, category: 'matematica', type: 'multiple' },
  { q: 'Quantos lados tem um hexágono?', options: ['5', '6', '7', '8'], a: 1, category: 'matematica', type: 'multiple' },
  { q: 'Qual o resultado de 144 ÷ 12?', options: ['10', '11', '12', '14'], a: 2, category: 'matematica', type: 'multiple' },
  { q: 'Qual é a raiz quadrada de 81?', options: ['7', '8', '9', '10'], a: 2, category: 'matematica', type: 'multiple' },
  { q: 'Quanto é 15% de 200?', options: ['15', '20', '25', '30'], a: 3, category: 'matematica', type: 'multiple' },
  { q: 'Quanto é 2 elevado à 5ª potência?', options: ['16', '25', '32', '64'], a: 2, category: 'matematica', type: 'multiple' },
  { q: 'Qual é o valor de π (pi) aproximado?', options: ['2,14', '3,14', '4,14', '3,41'], a: 1, category: 'matematica', type: 'multiple' },
  { q: 'Quanto é 1000 ÷ 8?', options: ['120', '125', '130', '150'], a: 1, category: 'matematica', type: 'multiple' },
  { q: 'Qual é o próximo primo depois de 7?', options: ['8', '9', '10', '11'], a: 3, category: 'matematica', type: 'multiple' },
  { q: 'Um triângulo equilátero tem todos os lados iguais.', options: ['Verdadeiro', 'Falso'], a: 0, category: 'matematica', type: 'boolean' },
  { q: 'Zero é um número ímpar.', options: ['Verdadeiro', 'Falso'], a: 1, category: 'matematica', type: 'boolean' },
  { q: 'A soma dos ângulos internos de um triângulo é 180°.', options: ['Verdadeiro', 'Falso'], a: 0, category: 'matematica', type: 'boolean' },
  { q: 'Todo número negativo é menor que zero.', options: ['Verdadeiro', 'Falso'], a: 0, category: 'matematica', type: 'boolean' },
  { q: 'O número 1 é considerado primo.', options: ['Verdadeiro', 'Falso'], a: 1, category: 'matematica', type: 'boolean' },
  { q: 'O resultado de 25 × 4 é...', options: ['80', '90', '100', '110'], a: 2, category: 'matematica', type: 'complete' },
  { q: 'O fatorial de 5 (5!) é igual a...', options: ['60', '100', '120', '150'], a: 2, category: 'matematica', type: 'complete' },
  { q: 'A área de um quadrado de lado 7 é...', options: ['14', '28', '42', '49'], a: 3, category: 'matematica', type: 'complete' },
  { q: 'O dobro de 3,5 é...', options: ['6', '6,5', '7', '7,5'], a: 2, category: 'matematica', type: 'complete' },

  // ===== TECNOLOGIA =====
  { q: 'Qual linguagem é usada para estilizar páginas web?', options: ['HTML', 'CSS', 'SQL', 'Python'], a: 1, category: 'tecnologia', type: 'multiple' },
  { q: 'Qual tecla geralmente envia formulários?', options: ['Esc', 'Shift', 'Enter', 'Tab'], a: 2, category: 'tecnologia', type: 'multiple' },
  { q: 'Qual a linguagem de programação criada por Brendan Eich?', options: ['Python', 'Java', 'JavaScript', 'C++'], a: 2, category: 'tecnologia', type: 'multiple' },
  { q: 'O que significa HTML?', options: ['HyperText Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyper Transfer Multi Language'], a: 0, category: 'tecnologia', type: 'multiple' },
  { q: 'Qual empresa criou o sistema Android?', options: ['Apple', 'Microsoft', 'Google', 'Samsung'], a: 2, category: 'tecnologia', type: 'multiple' },
  { q: 'Qual é o atalho para copiar no Windows?', options: ['Ctrl+V', 'Ctrl+X', 'Ctrl+C', 'Ctrl+Z'], a: 2, category: 'tecnologia', type: 'multiple' },
  { q: 'Quantos bits tem um byte?', options: ['4', '6', '8', '16'], a: 2, category: 'tecnologia', type: 'multiple' },
  { q: 'Qual desses é um sistema operacional?', options: ['Chrome', 'Linux', 'Photoshop', 'Excel'], a: 1, category: 'tecnologia', type: 'multiple' },
  { q: 'Qual protocolo é usado para páginas web seguras?', options: ['FTP', 'HTTP', 'HTTPS', 'SMTP'], a: 2, category: 'tecnologia', type: 'multiple' },
  { q: 'Qual componente é o "cérebro" do computador?', options: ['RAM', 'HD', 'CPU', 'GPU'], a: 2, category: 'tecnologia', type: 'multiple' },
  { q: 'Python é uma linguagem de programação.', options: ['Verdadeiro', 'Falso'], a: 0, category: 'tecnologia', type: 'boolean' },
  { q: 'O Wi-Fi funciona sem ondas de rádio.', options: ['Verdadeiro', 'Falso'], a: 1, category: 'tecnologia', type: 'boolean' },
  { q: '1 GB equivale a 1024 MB.', options: ['Verdadeiro', 'Falso'], a: 0, category: 'tecnologia', type: 'boolean' },
  { q: 'O primeiro iPhone foi lançado em 2005.', options: ['Verdadeiro', 'Falso'], a: 1, category: 'tecnologia', type: 'boolean' },
  { q: 'A sigla URL significa Uniform Resource Locator.', options: ['Verdadeiro', 'Falso'], a: 0, category: 'tecnologia', type: 'boolean' },
  { q: 'A linguagem de marcação usada para estruturar páginas web é...', options: ['CSS', 'HTML', 'JavaScript', 'PHP'], a: 1, category: 'tecnologia', type: 'complete' },
  { q: 'O dispositivo que conecta redes e distribui internet é o...', options: ['Monitor', 'Teclado', 'Roteador', 'Mouse'], a: 2, category: 'tecnologia', type: 'complete' },
  { q: 'A memória de acesso rápido e volátil do computador é a...', options: ['SSD', 'RAM', 'ROM', 'HD'], a: 1, category: 'tecnologia', type: 'complete' },

  // ===== GEOGRAFIA =====
  { q: 'Qual é o maior oceano da Terra?', options: ['Atlântico', 'Índico', 'Pacífico', 'Ártico'], a: 2, category: 'geografia', type: 'multiple' },
  { q: 'Em que continente fica o Brasil?', options: ['Europa', 'Ásia', 'América do Sul', 'África'], a: 2, category: 'geografia', type: 'multiple' },
  { q: 'Qual é a capital do Brasil?', options: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador'], a: 2, category: 'geografia', type: 'multiple' },
  { q: 'Qual é o rio mais longo do mundo?', options: ['Rio Amazonas', 'Rio Nilo', 'Rio Mississipi', 'Rio Yangtzé'], a: 1, category: 'geografia', type: 'multiple' },
  { q: 'Qual é o menor estado brasileiro em área?', options: ['Alagoas', 'Sergipe', 'Rio de Janeiro', 'Espírito Santo'], a: 1, category: 'geografia', type: 'multiple' },
  { q: 'Qual é a moeda oficial do Japão?', options: ['Yuan', 'Won', 'Iene', 'Rupia'], a: 2, category: 'geografia', type: 'multiple' },
  { q: 'Qual país tem formato de bota no mapa?', options: ['Grécia', 'Itália', 'Portugal', 'Espanha'], a: 1, category: 'geografia', type: 'multiple' },
  { q: 'Quantos estados tem o Brasil?', options: ['24', '25', '26', '27'], a: 2, category: 'geografia', type: 'multiple' },
  { q: 'Qual a capital da Argentina?', options: ['Montevidéu', 'Santiago', 'Buenos Aires', 'Lima'], a: 2, category: 'geografia', type: 'multiple' },
  { q: 'Qual é o maior país do mundo em território?', options: ['Canadá', 'China', 'EUA', 'Rússia'], a: 3, category: 'geografia', type: 'multiple' },
  { q: 'Qual o pico mais alto do mundo?', options: ['K2', 'Mont Blanc', 'Monte Everest', 'Kilimanjaro'], a: 2, category: 'geografia', type: 'multiple' },
  { q: 'Qual país tem mais habitantes no mundo?', options: ['EUA', 'Índia', 'Rússia', 'Indonésia'], a: 1, category: 'geografia', type: 'multiple' },
  { q: 'O Deserto do Saara fica na África.', options: ['Verdadeiro', 'Falso'], a: 0, category: 'geografia', type: 'boolean' },
  { q: 'A Austrália é um continente e um país ao mesmo tempo.', options: ['Verdadeiro', 'Falso'], a: 0, category: 'geografia', type: 'boolean' },
  { q: 'O Rio Amazonas deságua no Oceano Pacífico.', options: ['Verdadeiro', 'Falso'], a: 1, category: 'geografia', type: 'boolean' },
  { q: 'Tóquio é a capital do Japão.', options: ['Verdadeiro', 'Falso'], a: 0, category: 'geografia', type: 'boolean' },
  { q: 'A Groenlândia pertence à Dinamarca.', options: ['Verdadeiro', 'Falso'], a: 0, category: 'geografia', type: 'boolean' },
  { q: 'O maior rio do Brasil em extensão é o Rio...', options: ['Paraná', 'São Francisco', 'Amazonas', 'Tocantins'], a: 2, category: 'geografia', type: 'complete' },
  { q: 'A capital da França é...', options: ['Lyon', 'Marselha', 'Paris', 'Nice'], a: 2, category: 'geografia', type: 'complete' },
  { q: 'O continente com mais países é a...', options: ['Ásia', 'Europa', 'África', 'América'], a: 2, category: 'geografia', type: 'complete' },

  // ===== HISTÓRIA =====
  { q: 'Em que ano o Brasil foi descoberto?', options: ['1492', '1500', '1510', '1498'], a: 1, category: 'historia', type: 'multiple' },
  { q: 'Quem foi o primeiro presidente do Brasil?', options: ['Dom Pedro II', 'Getúlio Vargas', 'Deodoro da Fonseca', 'Rui Barbosa'], a: 2, category: 'historia', type: 'multiple' },
  { q: 'Qual civilização construiu as pirâmides de Gizé?', options: ['Romana', 'Grega', 'Egípcia', 'Persa'], a: 2, category: 'historia', type: 'multiple' },
  { q: 'Em que ano começou a Segunda Guerra Mundial?', options: ['1935', '1937', '1939', '1941'], a: 2, category: 'historia', type: 'multiple' },
  { q: 'Qual país lançou a primeira bomba atômica?', options: ['Alemanha', 'URSS', 'Japão', 'EUA'], a: 3, category: 'historia', type: 'multiple' },
  { q: 'Qual era a capital do Império Romano?', options: ['Atenas', 'Roma', 'Constantinopla', 'Alexandria'], a: 1, category: 'historia', type: 'multiple' },
  { q: 'Quem foi o líder da Revolução Francesa?', options: ['Napoleão', 'Robespierre', 'Luís XVI', 'Voltaire'], a: 1, category: 'historia', type: 'multiple' },
  { q: 'Em que século os portugueses chegaram ao Brasil?', options: ['XIV', 'XV', 'XVI', 'XVII'], a: 2, category: 'historia', type: 'multiple' },
  { q: 'Qual imperador governou o Brasil antes da República?', options: ['Dom Pedro I', 'Dom Pedro II', 'Dom João VI', 'Dom Miguel'], a: 1, category: 'historia', type: 'multiple' },
  { q: 'A abolição da escravatura no Brasil ocorreu em 1888.', options: ['Verdadeiro', 'Falso'], a: 0, category: 'historia', type: 'boolean' },
  { q: 'A Revolução Industrial começou na França.', options: ['Verdadeiro', 'Falso'], a: 1, category: 'historia', type: 'boolean' },
  { q: 'O Muro de Berlim caiu em 1989.', options: ['Verdadeiro', 'Falso'], a: 0, category: 'historia', type: 'boolean' },
  { q: 'Cleópatra foi uma rainha grega que governou o Egito.', options: ['Verdadeiro', 'Falso'], a: 0, category: 'historia', type: 'boolean' },
  { q: 'A Independência do Brasil foi proclamada em 1822.', options: ['Verdadeiro', 'Falso'], a: 0, category: 'historia', type: 'boolean' },
  { q: 'O período da história marcado pelo Renascimento ocorreu na...', options: ['Antiguidade', 'Idade Média', 'Idade Moderna', 'Idade Contemporânea'], a: 2, category: 'historia', type: 'complete' },
  { q: 'A lei que aboliu a escravidão no Brasil chama-se Lei...', options: ['Eusébio de Queirós', 'do Ventre Livre', 'Áurea', 'dos Sexagenários'], a: 2, category: 'historia', type: 'complete' },
  { q: 'O navegador que chegou ao Brasil em 1500 foi Pedro Álvares...', options: ['Cabral', 'Colombo', 'Magalhães', 'Caminha'], a: 0, category: 'historia', type: 'complete' },

  // ===== ARTE E CULTURA =====
  { q: 'Quem pintou a Mona Lisa?', options: ['Michelangelo', 'Leonardo da Vinci', 'Rafael', 'Donatello'], a: 1, category: 'arte', type: 'multiple' },
  { q: 'Qual instrumento tem 88 teclas?', options: ['Violão', 'Piano', 'Acordeão', 'Órgão'], a: 1, category: 'arte', type: 'multiple' },
  { q: 'Quem escreveu "Dom Casmurro"?', options: ['José de Alencar', 'Machado de Assis', 'Clarice Lispector', 'Jorge Amado'], a: 1, category: 'arte', type: 'multiple' },
  { q: 'Qual movimento artístico Picasso ajudou a criar?', options: ['Impressionismo', 'Surrealismo', 'Cubismo', 'Romantismo'], a: 2, category: 'arte', type: 'multiple' },
  { q: 'Qual compositor ficou surdo e continuou compondo?', options: ['Mozart', 'Bach', 'Beethoven', 'Chopin'], a: 2, category: 'arte', type: 'multiple' },
  { q: 'Qual dança é típica da Argentina?', options: ['Samba', 'Tango', 'Valsa', 'Flamenco'], a: 1, category: 'arte', type: 'multiple' },
  { q: 'Quantas notas musicais existem na escala padrão?', options: ['5', '6', '7', '8'], a: 2, category: 'arte', type: 'multiple' },
  { q: 'Quem escreveu "Romeu e Julieta"?', options: ['Dante', 'Shakespeare', 'Cervantes', 'Dickens'], a: 1, category: 'arte', type: 'multiple' },
  { q: 'O Carnaval é uma festa típica do Brasil.', options: ['Verdadeiro', 'Falso'], a: 0, category: 'arte', type: 'boolean' },
  { q: 'O samba é originário da Bahia.', options: ['Verdadeiro', 'Falso'], a: 0, category: 'arte', type: 'boolean' },
  { q: 'A Gioconda e a Mona Lisa são a mesma pintura.', options: ['Verdadeiro', 'Falso'], a: 0, category: 'arte', type: 'boolean' },
  { q: 'O violão tem 5 cordas.', options: ['Verdadeiro', 'Falso'], a: 1, category: 'arte', type: 'boolean' },
  { q: 'O autor de "O Pequeno Príncipe" é...', options: ['Victor Hugo', 'Saint-Exupéry', 'Julio Verne', 'Emile Zola'], a: 1, category: 'arte', type: 'complete' },
  { q: 'O ritmo musical brasileiro criado no Rio de Janeiro é o...', options: ['Forró', 'Sertanejo', 'Bossa Nova', 'Maracatu'], a: 2, category: 'arte', type: 'complete' },
  { q: 'A obra "Guernica" foi pintada por...', options: ['Dalí', 'Monet', 'Picasso', 'Van Gogh'], a: 2, category: 'arte', type: 'complete' },

  // ===== ESPORTES =====
  { q: 'Qual esporte é conhecido como "o esporte bretão"?', options: ['Vôlei', 'Futebol', 'Basquete', 'Tênis'], a: 1, category: 'esportes', type: 'multiple' },
  { q: 'Qual seleção venceu a primeira Copa do Mundo de futebol em 1930?', options: ['Brasil', 'Argentina', 'Uruguai', 'Itália'], a: 2, category: 'esportes', type: 'multiple' },
  { q: 'Quantos jogadores tem um time de futebol em campo?', options: ['9', '10', '11', '12'], a: 2, category: 'esportes', type: 'multiple' },
  { q: 'Em qual esporte se usa raquete e peteca?', options: ['Tênis', 'Badminton', 'Squash', 'Pingue-pongue'], a: 1, category: 'esportes', type: 'multiple' },
  { q: 'Qual país sediou as Olimpíadas de 2016?', options: ['China', 'Inglaterra', 'Brasil', 'Japão'], a: 2, category: 'esportes', type: 'multiple' },
  { q: 'Quantos sets um time precisa vencer para ganhar no vôlei?', options: ['2', '3', '4', '5'], a: 1, category: 'esportes', type: 'multiple' },
  { q: 'Qual é o esporte mais praticado no mundo?', options: ['Basquete', 'Críquete', 'Futebol', 'Natação'], a: 2, category: 'esportes', type: 'multiple' },
  { q: 'Qual nadador tem mais medalhas olímpicas de ouro?', options: ['Ian Thorpe', 'Michael Phelps', 'Ryan Lochte', 'Mark Spitz'], a: 1, category: 'esportes', type: 'multiple' },
  { q: 'Usain Bolt é jamaicano.', options: ['Verdadeiro', 'Falso'], a: 0, category: 'esportes', type: 'boolean' },
  { q: 'O Brasil já venceu 5 Copas do Mundo de futebol masculino.', options: ['Verdadeiro', 'Falso'], a: 0, category: 'esportes', type: 'boolean' },
  { q: 'Uma partida de basquete tem 4 quartos.', options: ['Verdadeiro', 'Falso'], a: 0, category: 'esportes', type: 'boolean' },
  { q: 'O golfe é jogado em uma quadra.', options: ['Verdadeiro', 'Falso'], a: 1, category: 'esportes', type: 'boolean' },
  { q: 'No futebol, o cartão vermelho expulsa o jogador do jogo.', options: ['Verdadeiro', 'Falso'], a: 0, category: 'esportes', type: 'boolean' },
  { q: 'O evento olímpico que combina natação, ciclismo e corrida é o...', options: ['Pentatlo', 'Triatlo', 'Decatlo', 'Biatlo'], a: 1, category: 'esportes', type: 'complete' },
  { q: 'No futebol, quem anota mais gols em uma competição recebe a...', options: ['Bola de Ouro', 'Chuteira de Ouro', 'Luva de Ouro', 'Taça de Prata'], a: 1, category: 'esportes', type: 'complete' },

  // ===== NATUREZA =====
  { q: 'Qual é a maior floresta tropical do mundo?', options: ['Floresta do Congo', 'Floresta Amazônica', 'Floresta de Bornéu', 'Floresta de Daintree'], a: 1, category: 'natureza', type: 'multiple' },
  { q: 'Qual animal é conhecido como rei da selva?', options: ['Tigre', 'Gorila', 'Leão', 'Elefante'], a: 2, category: 'natureza', type: 'multiple' },
  { q: 'Qual é a ave que não pode voar mas é a maior do mundo?', options: ['Pinguim', 'Avestruz', 'Emu', 'Kiwi'], a: 1, category: 'natureza', type: 'multiple' },
  { q: 'Qual é o maior animal do planeta?', options: ['Elefante', 'Tubarão-baleia', 'Baleia-azul', 'Girafa'], a: 2, category: 'natureza', type: 'multiple' },
  { q: 'Qual parte da planta realiza a fotossíntese?', options: ['Raiz', 'Caule', 'Folha', 'Flor'], a: 2, category: 'natureza', type: 'multiple' },
  { q: 'Qual inseto produz mel?', options: ['Vespa', 'Formiga', 'Abelha', 'Mariposa'], a: 2, category: 'natureza', type: 'multiple' },
  { q: 'Quantas patas tem uma aranha?', options: ['6', '8', '10', '12'], a: 1, category: 'natureza', type: 'multiple' },
  { q: 'Qual bioma brasileiro é conhecido como "savana"?', options: ['Mata Atlântica', 'Cerrado', 'Caatinga', 'Pampa'], a: 1, category: 'natureza', type: 'multiple' },
  { q: 'Qual animal vive tanto na água quanto na terra?', options: ['Peixe', 'Anfíbio', 'Réptil', 'Mamífero'], a: 1, category: 'natureza', type: 'multiple' },
  { q: 'As baleias são mamíferos.', options: ['Verdadeiro', 'Falso'], a: 0, category: 'natureza', type: 'boolean' },
  { q: 'Os cogumelos são plantas.', options: ['Verdadeiro', 'Falso'], a: 1, category: 'natureza', type: 'boolean' },
  { q: 'O camaleão muda de cor para se camuflar.', options: ['Verdadeiro', 'Falso'], a: 0, category: 'natureza', type: 'boolean' },
  { q: 'Os tubarões são mamíferos.', options: ['Verdadeiro', 'Falso'], a: 1, category: 'natureza', type: 'boolean' },
  { q: 'As plantas carnívoras se alimentam de insetos.', options: ['Verdadeiro', 'Falso'], a: 0, category: 'natureza', type: 'boolean' },
  { q: 'O bioma mais ameaçado do Brasil, com menos de 12% de cobertura original, é a...', options: ['Amazônia', 'Caatinga', 'Mata Atlântica', 'Pampa'], a: 2, category: 'natureza', type: 'complete' },
  { q: 'O animal símbolo do WWF (organização de preservação) é o...', options: ['Tigre', 'Panda', 'Urso polar', 'Baleia'], a: 1, category: 'natureza', type: 'complete' },
  { q: 'A árvore que produz o fruto açaí é o...', options: ['Açaizeiro', 'Coqueiro', 'Babaçu', 'Palmiteiro'], a: 0, category: 'natureza', type: 'complete' },

  // ===== LÍNGUA PORTUGUESA =====
  { q: 'Qual é o plural de "cidadão"?', options: ['Cidadãos', 'Cidadões', 'Cidadães', 'Cidadãs'], a: 0, category: 'portugues', type: 'multiple' },
  { q: 'Qual classe gramatical expressa ação?', options: ['Substantivo', 'Adjetivo', 'Verbo', 'Advérbio'], a: 2, category: 'portugues', type: 'multiple' },
  { q: 'Qual é o sinônimo de "efêmero"?', options: ['Eterno', 'Passageiro', 'Rápido', 'Lento'], a: 1, category: 'portugues', type: 'multiple' },
  { q: 'Qual é o antônimo de "prolixo"?', options: ['Extenso', 'Conciso', 'Verboso', 'Detalhado'], a: 1, category: 'portugues', type: 'multiple' },
  { q: 'Qual figura de linguagem usa exagero para dar ênfase?', options: ['Metáfora', 'Hipérbole', 'Ironia', 'Metonímia'], a: 1, category: 'portugues', type: 'multiple' },
  { q: 'Qual a forma correta?', options: ['A gente vamos', 'A gente vai', 'A gente iremos', 'A gente foram'], a: 1, category: 'portugues', type: 'multiple' },
  { q: '"Mau" e "mal" têm significados diferentes.', options: ['Verdadeiro', 'Falso'], a: 0, category: 'portugues', type: 'boolean' },
  { q: '"Nós" e "a gente" podem ser usados como sinônimos na linguagem informal.', options: ['Verdadeiro', 'Falso'], a: 0, category: 'portugues', type: 'boolean' },
  { q: 'Todas as palavras proparoxítonas são acentuadas.', options: ['Verdadeiro', 'Falso'], a: 0, category: 'portugues', type: 'boolean' },
  { q: '"Por que" junto e sem acento é usado no início de perguntas diretas.', options: ['Verdadeiro', 'Falso'], a: 1, category: 'portugues', type: 'boolean' },
  { q: 'O sujeito da oração "Choveu muito ontem" é classificado como sujeito...', options: ['Simples', 'Composto', 'Inexistente', 'Indeterminado'], a: 2, category: 'portugues', type: 'complete' },
  { q: 'A palavra "casa" é um...', options: ['Verbo', 'Adjetivo', 'Substantivo', 'Pronome'], a: 2, category: 'portugues', type: 'complete' },
  { q: 'O gênero literário que narra acontecimentos é o gênero...', options: ['Lírico', 'Dramático', 'Épico/Narrativo', 'Descritivo'], a: 2, category: 'portugues', type: 'complete' },
  { q: 'Palavras com sentidos opostos são chamadas de...', options: ['Sinônimas', 'Homônimas', 'Antônimas', 'Parônimas'], a: 2, category: 'portugues', type: 'complete' },

  // ===== CINEMA E TV =====
  { q: 'Qual filme da Pixar tem brinquedos que ganham vida?', options: ['Monstros S.A.', 'Toy Story', 'Carros', 'Divertida Mente'], a: 1, category: 'cinema', type: 'multiple' },
  { q: 'Qual ator interpreta o Homem de Ferro nos filmes da Marvel?', options: ['Chris Evans', 'Chris Hemsworth', 'Robert Downey Jr.', 'Mark Ruffalo'], a: 2, category: 'cinema', type: 'multiple' },
  { q: 'Em que país é produzida a maioria dos filmes de Bollywood?', options: ['China', 'Japão', 'Índia', 'Tailândia'], a: 2, category: 'cinema', type: 'multiple' },
  { q: 'Qual é o nome do famoso robô dourado de Star Wars?', options: ['R2-D2', 'C-3PO', 'BB-8', 'K-2SO'], a: 1, category: 'cinema', type: 'multiple' },
  { q: 'Qual filme animado se passa no fundo do mar?', options: ['Madagascar', 'Procurando Nemo', 'Frozen', 'Shrek'], a: 1, category: 'cinema', type: 'multiple' },
  { q: 'Qual diretor é famoso pelos filmes "Tubarão" e "E.T."?', options: ['Martin Scorsese', 'Steven Spielberg', 'James Cameron', 'Quentin Tarantino'], a: 1, category: 'cinema', type: 'multiple' },
  { q: 'Qual série de TV se passa em Winterfell e Kings Landing?', options: ['The Witcher', 'Vikings', 'Game of Thrones', 'Lord of the Rings'], a: 2, category: 'cinema', type: 'multiple' },
  { q: 'Qual personagem Disney vive em um castelo de gelo?', options: ['Rapunzel', 'Moana', 'Elsa', 'Cinderela'], a: 2, category: 'cinema', type: 'multiple' },
  { q: 'O filme "Titanic" foi dirigido por James Cameron.', options: ['Verdadeiro', 'Falso'], a: 0, category: 'cinema', type: 'boolean' },
  { q: '"O Senhor dos Anéis" foi escrito por C.S. Lewis.', options: ['Verdadeiro', 'Falso'], a: 1, category: 'cinema', type: 'boolean' },
  { q: 'O primeiro filme de Harry Potter foi lançado em 2001.', options: ['Verdadeiro', 'Falso'], a: 0, category: 'cinema', type: 'boolean' },
  { q: 'A Pixar pertence à Disney.', options: ['Verdadeiro', 'Falso'], a: 0, category: 'cinema', type: 'boolean' },
  { q: 'O personagem principal do filme "Matrix" é o...', options: ['Morpheus', 'Neo', 'Trinity', 'Smith'], a: 1, category: 'cinema', type: 'complete' },
  { q: 'O bruxo mais famoso do cinema, criado por J.K. Rowling, é...', options: ['Gandalf', 'Merlin', 'Harry Potter', 'Dumbledore'], a: 2, category: 'cinema', type: 'complete' },
  { q: 'O estúdio japonês de animação famoso por "A Viagem de Chihiro" é o Studio...', options: ['Ghibli', 'Toei', 'Madhouse', 'Bones'], a: 0, category: 'cinema', type: 'complete' },
];

const TYPE_LABELS = {
  multiple: 'Múltipla Escolha',
  boolean: 'Verdadeiro ou Falso',
  complete: 'Complete a Frase',
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getCategoryName(id) {
  const cat = CATEGORIES.find(c => c.id === id);
  return cat ? cat.name : id;
}

export function initQuickQuizFeature() {
  const quizStatus = document.getElementById('quiz-status');
  const quizQuestion = document.getElementById('quiz-question');
  const quizOptions = document.getElementById('quiz-options');
  const quizFeedback = document.getElementById('quiz-feedback');
  const quizReset = document.getElementById('quiz-reset');
  const quizShare = document.getElementById('quiz-share');
  const quizTimerBar = document.getElementById('quiz-timer-fill');
  const quizCategory = document.getElementById('quiz-category');
  const quizCategorySelect = document.getElementById('quiz-category-select');
  const quizGameArea = document.getElementById('quiz-game-area');
  const quizType = document.getElementById('quiz-type');

  if (!quizStatus || !quizQuestion || !quizOptions || !quizFeedback || !quizReset || !quizShare) return;

  const quizStorageKey = 'gametools_quiz_best';
  const quizTimePerQuestion = 15;

  let questions = [];
  let quizIndex = 0;
  let quizScore = 0;
  let quizTimeLeft = quizTimePerQuestion;
  let quizTimer = null;
  let quizEnded = false;
  let quizLocked = false;
  let selectedCategory = 'todas';

  function buildCategoryGrid() {
    if (!quizCategorySelect) return;
    quizCategorySelect.innerHTML = '';

    CATEGORIES.forEach(cat => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'quiz-cat-card';
      btn.dataset.category = cat.id;
      btn.style.setProperty('--cat-color', cat.color);

      const count = cat.id === 'todas'
        ? QUESTIONS.length
        : QUESTIONS.filter(q => q.category === cat.id).length;

      btn.innerHTML = `<span class="quiz-cat-icon">${cat.icon}</span><span class="quiz-cat-name">${cat.name}</span><span class="quiz-cat-count">${count} perguntas</span>`;
      btn.addEventListener('click', () => startWithCategory(cat.id));
      quizCategorySelect.appendChild(btn);
    });
  }

  function startWithCategory(categoryId) {
    selectedCategory = categoryId;
    if (quizCategorySelect) quizCategorySelect.style.display = 'none';
    if (quizGameArea) quizGameArea.style.display = 'block';
    quizResetGame();
  }

  function showCategorySelect() {
    if (quizCategorySelect) quizCategorySelect.style.display = '';
    if (quizGameArea) quizGameArea.style.display = 'none';
  }

  function quizBest() {
    return Number(localStorage.getItem(quizStorageKey) || '0');
  }

  function quizUpdateStatus() {
    const total = questions.length || 10;
    quizStatus.textContent = `Pergunta ${Math.min(quizIndex + 1, total)}/${total} · Tempo: ${quizTimeLeft}s · Pontos: ${quizScore} · Melhor: ${quizBest()}`;
  }

  function updateTimerBar() {
    if (!quizTimerBar) return;
    const pct = (quizTimeLeft / quizTimePerQuestion) * 100;
    quizTimerBar.style.width = `${pct}%`;
  }

  function quizNext() {
    quizIndex += 1;
    quizFeedback.textContent = '';
    quizLocked = false;

    if (quizIndex >= questions.length) {
      quizFinish();
      return;
    }

    quizRenderQuestion();
  }

  function quizFinish() {
    clearInterval(quizTimer);
    quizEnded = true;
    const total = questions.length;
    const isNewBest = quizScore > quizBest();
    if (isNewBest) {
      localStorage.setItem(quizStorageKey, String(quizScore));
    }
    quizQuestion.textContent = 'Fim do quiz!';
    quizOptions.innerHTML = '';
    const catLabel = selectedCategory === 'todas' ? 'Todas as Categorias' : getCategoryName(selectedCategory);
    quizFeedback.textContent = `Pontuação final: ${quizScore} de ${total} (${catLabel}).${isNewBest ? ' Novo recorde!' : ''}`;
    quizStatus.textContent = `Quiz finalizado · Melhor pontuação: ${quizBest()}`;
    if (quizCategory) quizCategory.textContent = '';
    if (quizType) quizType.textContent = '';
    if (quizTimerBar) quizTimerBar.style.width = '0%';

    if (quizScore >= total * 0.7) {
      fireConfetti();
    }
  }

  function quizHandleAnswer(answerIndex, buttons) {
    if (quizEnded || quizLocked) return;
    quizLocked = true;
    clearInterval(quizTimer);

    const current = questions[quizIndex];
    const correctIdx = current.a;

    buttons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === correctIdx) btn.classList.add('correct');
      if (idx === answerIndex && answerIndex !== correctIdx) btn.classList.add('wrong');
    });

    if (answerIndex === correctIdx) {
      quizScore += 1;
      quizFeedback.textContent = 'Resposta correta!';
    } else {
      quizFeedback.textContent = `Incorreta. Correta: ${current.options[correctIdx]}.`;
    }

    quizUpdateStatus();
    setTimeout(quizNext, 1000);
  }

  function quizTick() {
    quizTimeLeft -= 1;
    quizUpdateStatus();
    updateTimerBar();
    if (quizTimeLeft <= 0) {
      clearInterval(quizTimer);
      quizLocked = true;
      quizFeedback.textContent = `Tempo esgotado! Correta: ${questions[quizIndex].options[questions[quizIndex].a]}.`;
      const btns = quizOptions.querySelectorAll('.btn');
      btns.forEach((btn, idx) => {
        btn.disabled = true;
        if (idx === questions[quizIndex].a) btn.classList.add('correct');
      });
      setTimeout(quizNext, 1200);
    }
  }

  function quizRenderQuestion() {
    const current = questions[quizIndex];
    quizEnded = false;
    quizTimeLeft = quizTimePerQuestion;
    quizOptions.innerHTML = '';

    if (quizCategory) {
      quizCategory.textContent = `Categoria: ${getCategoryName(current.category)}`;
    }

    if (quizType) {
      const label = TYPE_LABELS[current.type] || TYPE_LABELS.multiple;
      quizType.textContent = label;
    }

    if (current.type === 'complete') {
      quizQuestion.textContent = `Complete: ${current.q}`;
    } else if (current.type === 'boolean') {
      quizQuestion.textContent = `Verdadeiro ou Falso: ${current.q}`;
    } else {
      quizQuestion.textContent = current.q;
    }

    const buttons = [];
    current.options.forEach((option, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'btn btn-secondary';
      if (current.type === 'boolean') {
        button.classList.add('quiz-bool-btn');
      }
      button.textContent = option;
      button.addEventListener('click', () => quizHandleAnswer(index, buttons));
      quizOptions.appendChild(button);
      buttons.push(button);
    });

    quizUpdateStatus();
    updateTimerBar();
    clearInterval(quizTimer);
    quizTimer = setInterval(quizTick, 1000);
  }

  async function quizShareResult() {
    const total = questions.length;
    const catLabel = selectedCategory === 'todas' ? 'Todas as Categorias' : getCategoryName(selectedCategory);
    const text = `No Quiz Rápido (${catLabel}) fiz ${quizScore}/${total} no GameTools!`;
    if (navigator.share) {
      await navigator.share({ title: 'Quiz Rápido - GameTools', text });
      return;
    }
    copyToClipboard(text, quizShare);
  }

  function quizResetGame() {
    clearInterval(quizTimer);
    quizIndex = 0;
    quizScore = 0;
    quizEnded = false;
    quizLocked = false;
    quizFeedback.textContent = '';
    quizOptions.innerHTML = '';

    const pool = selectedCategory === 'todas'
      ? QUESTIONS
      : QUESTIONS.filter(q => q.category === selectedCategory);

    questions = shuffle(pool).slice(0, 10);
    quizRenderQuestion();
  }

  function quizBackToCategories() {
    clearInterval(quizTimer);
    quizEnded = true;
    quizOptions.innerHTML = '';
    quizQuestion.textContent = '';
    quizFeedback.textContent = '';
    quizStatus.textContent = '';
    if (quizCategory) quizCategory.textContent = '';
    if (quizType) quizType.textContent = '';
    if (quizTimerBar) quizTimerBar.style.width = '100%';
    showCategorySelect();
  }

  const quizBackBtn = document.getElementById('quiz-back');
  if (quizBackBtn) {
    quizBackBtn.addEventListener('click', quizBackToCategories);
  }

  quizReset.addEventListener('click', quizResetGame);
  quizShare.addEventListener('click', () => {
    quizShareResult().catch(() => {
      quizFeedback.textContent = 'Falha ao compartilhar resultado.';
    });
  });

  buildCategoryGrid();
  showCategorySelect();
}
