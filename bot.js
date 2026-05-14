const { chromium } = require('playwright');

const TOKEN = '8924497505:AAGjsbvOYRNwxqrHenwmb7sfhOvCbULO3Dg';
const CHAT_ID = '1010381691';

async function sendTelegram(message) {
  try {
    const url = `https://api.telegram.org/bot${TOKEN}/sendMessage?chat_id=${CHAT_ID}&text=${encodeURIComponent(message)}`;
    await fetch(url).catch(() => {});
    console.log('📩 تم الإرسال على تيليجرام');
  } catch (e) {
    console.log('❌ خطأ في الإرسال');
  }
}

(async () => {
  await sendTelegram('✅ البوت اشتغل على السيرفر');  let found = false;

  while (true) {
    let browser;

    try {
      console.log('🚀 تشغيل المتصفح...');

      browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--ignore-certificate-errors']
      });

      const context = await browser.newContext({
        ignoreHTTPSErrors: true
      });

      const page = await context.newPage();

      console.log('🌐 فتح الموقع...');

      await page.goto('https://webook.com/en/explore?tag=football', {
        waitUntil: 'domcontentloaded',
        timeout: 60000
      });

      try {
        await page.click('text=Accept', { timeout: 5000 });
        console.log('✅ تم الضغط على Accept');
      } catch (e) {}

      await page.waitForTimeout(7000);

      console.log('🔍 جاري البحث عن المباراة...');

      const nassr = await page.locator('text=Al Nassr').count();
      const damac = await page.locator('text=Damac').count();

      if (nassr > 0 && damac > 0 && !found) {
        found = true;

        console.log('🔥 تم العثور على المباراة!');
        await sendTelegram('🔥 مباراة النصر وضمك نزلت في الموقع!');
      } else {
        console.log('❌ ما لقى المباراة');
      }

      await browser.close();

      console.log('⏳ إعادة بعد 10 ثواني...\n');
      await new Promise(r => setTimeout(r, 10000));

    } catch (error) {
      console.log('❌ خطأ:', error.message);

      if (browser) {
        await browser.close();
      }

      console.log('🔁 إعادة المحاولة بعد 5 ثواني...\n');
      await new Promise(r => setTimeout(r, 5000));
    }
  }
})();
