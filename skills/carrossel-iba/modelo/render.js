// Renderiza slides HTML em PNG 1080x1350.
// Uso: node conteudo/carrosseis/_modelo/render.js conteudo/carrosseis/<tema>/instagram/slide-*.html
const path = require('path');
let pw;
try { pw = require('playwright'); } catch (e) {
  pw = require(path.join(require('child_process').execSync('npm root -g').toString().trim(), 'playwright'));
}
(async () => {
  const opts = {};
  if (require('fs').existsSync('/opt/pw-browsers/chromium')) opts.executablePath = '/opt/pw-browsers/chromium';
  const browser = await pw.chromium.launch(opts);
  const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const f of process.argv.slice(2)) {
    await page.goto('file://' + path.resolve(f), { waitUntil: 'load' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    await page.screenshot({ path: f.replace(/\.html$/, '.png') });
    console.log('ok', f);
  }
  await browser.close();
})();
