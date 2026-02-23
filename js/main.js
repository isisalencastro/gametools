// Bootstrap principal: inicializa módulos por domínio conforme elementos disponíveis na página.
import { initCatalogExperience } from './common/catalog.js';
import { initThemeToggle } from './common/theme.js';
import { initGuessFeature } from './games/guess.js';
import { initReactionFeature } from './games/reaction.js';
import { initCatalogExperience } from './common/catalog.js';
import { initImcFeature } from './tools/imc.js';
import { initPercentageFeature } from './tools/percentage.js';
import { initTemperatureFeature } from './tools/temperature.js';

initThemeToggle();
initReactionFeature();
initGuessFeature();
initCatalogExperience();
initImcFeature();
initPercentageFeature();
initTemperatureFeature();
