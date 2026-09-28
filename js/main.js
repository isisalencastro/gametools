// Bootstrap principal: inicializa módulos por domínio conforme elementos disponíveis na página.
import { initCatalogExperience } from './common/catalog.js';
import { initMobileMenu } from './common/mobile-menu.js';
import { initThemeToggle } from './common/theme.js';
initThemeToggle();
initMobileMenu();
initCatalogExperience();

// Licao de 28/09/2026, e ela custou caro: ao apagar um jogo, apague tambem o import dele.
// Import de arquivo inexistente derruba o modulo INTEIRO, e com ele o tema, o menu do
// celular e o filtro do catalogo, em todas as paginas. Nao aparece na tela: a pagina
// segue bonita e os botoes simplesmente nao respondem.
