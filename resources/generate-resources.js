const puppeteer = require('puppeteer');
const path = require('path');
const appDir = path.dirname(process.mainModule.filename);
const rootDir = path.join(appDir, '..');

const iconSizes = [72,96,128,144,152,192,384,512];

// Suppress MaxListenersExceededWarning
try {
  process.setMaxListeners(0);
} catch {}

const images = [
  { name: 'apple-icon', size: { width: 512, height: 512 } },
  ...iconSizes.reduce((acc, curr) => acc.concat({ name: `icon-${curr}x${curr}`, size: { width: curr, height: curr } }), []),
  { name: 'iphone5_splash', size: { width: 640, height: 1136 } },
  { name: 'iphone6_splash', size: { width: 750, height: 1334 } },
  { name: 'iphoneplus_splash', size: { width: 1242, height: 2208 } },
  { name: 'iphonex_splash', size: { width: 1125, height: 2436 } },
  { name: 'iphonexr_splash', size: { width: 878, height: 1792 } },
  { name: 'iphonexsmax_splash', size: { width: 1242, height: 2688 } },
  { name: 'ipad_splash', size: { width: 1536, height: 2048 } },
  { name: 'ipadpro1_splash', size: { width: 1668, height: 2224 } },
  { name: 'ipadpro2_splash', size: { width: 2048, height: 2732 } },
  { name: 'ipadpro3_splash', size: { width: 1668, height: 2388 } },
];

images.forEach(async ({ name, size: { width, height } }) => {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: {
      width,
      height,
    },
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ]});
  const page = await browser.newPage();
  await page.goto(`file://${rootDir}/resources/logo.html`);
  await page.screenshot({path: `${rootDir}/src/assets/icons/${name}.png`});

  await browser.close();
});
