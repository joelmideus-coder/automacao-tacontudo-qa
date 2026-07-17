module.exports = {
  level: 'full',
  category: 'Web (Cross-browser)',
  tests: [
    {
      name: 'Chrome',
      fn: async (page, h) => {
        const ua = await page.evaluate(() => navigator.userAgent);
        console.log(`  🌐 User Agent: ${ua.substring(0, 80)}...`);
        await h.navigateAndWait(page, h.BASE_URL, 'Página inicial');
        await h.screenshot(page, 'web', '01-chrome');
      }
    },
    {
      name: 'Responsividade desktop',
      fn: async (page, h) => {
        const sizes = [
          { w: 1920, h: 1080, label: 'fullhd' },
          { w: 1440, h: 900, label: 'laptop' },
          { w: 1024, h: 768, label: 'tablet' },
        ];
        for (const s of sizes) {
          await page.setViewportSize({ width: s.w, height: s.h });
          await h.sleep(500);
          await h.screenshot(page, 'web', `02-responsivo-${s.label}`);
        }
      }
    },
    {
      name: 'Elementos visíveis',
      fn: async (page, h) => {
        const elements = ['header', 'nav', 'main', 'footer', 'form', 'table'];
        for (const el of elements) {
          const visible = await page.locator(el).first().isVisible().catch(() => false);
          console.log(`  ${visible ? '✅' : '❌'} Elemento <${el}> ${visible ? 'visível' : 'ausente'}`);
        }
        await h.screenshot(page, 'web', '03-elementos');
      }
    }
  ]
};
