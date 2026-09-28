// Bootstrap principal: inicializa módulos por domínio conforme elementos disponíveis na página.
import { initCatalogExperience } from './common/catalog.js';
import { initMobileMenu } from './common/mobile-menu.js';
import { initThemeToggle } from './common/theme.js';
import { initFastClickFeature } from './games/fast-click.js';
import { initGuessFeature } from './games/guess.js';
import { initMemoryFeature } from './games/memory.js';
import { initQuickQuizFeature } from './games/quick-quiz.js';
import { initReactionFeature } from './games/reaction.js';
import { initRockPaperScissorsFeature } from './games/rock-paper-scissors.js';
import { initDebugChallengeFeature } from './games/debug-challenge.js';

initThemeToggle();
initMobileMenu();
initReactionFeature();
initGuessFeature();
initRockPaperScissorsFeature();
initFastClickFeature();
initQuickQuizFeature();
initDebugChallengeFeature();
initMemoryFeature();
initCatalogExperience();
