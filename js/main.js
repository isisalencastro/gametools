// Bootstrap principal: inicializa módulos por domínio conforme elementos disponíveis na página.
import { initGuessFeature } from './games/guess.js';
import { initReactionFeature } from './games/reaction.js';
import { initImcFeature } from './tools/imc.js';
import { initPercentageFeature } from './tools/percentage.js';
import { initTemperatureFeature } from './tools/temperature.js';

initReactionFeature();
initGuessFeature();
initImcFeature();
initPercentageFeature();
initTemperatureFeature();
