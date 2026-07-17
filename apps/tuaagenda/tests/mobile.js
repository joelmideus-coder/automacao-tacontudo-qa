module.exports = {
  level: 'full',
  category: 'Mobile (Android/iOS)',
  tests: [
    {
      name: 'Login mobile',
      fn: async (page, h) => {
        await page.setViewportSize({ width: 375, height: 812 });
        await h.navigateAndWait(page, h.BASE_URL + '/login', 'Login mobile');
        await h.fillField(page, 'Email', 'joelmi.deus@tacontudo.com');
        await h.fillField(page, 'Senha', 'Z@ckwailde12');
        await h.tryClick(page, 'Entrar');
        await h.screenshot(page, 'mobile', '01-login-mobile');
      }
    },
    {
      name: 'Agendamento mobile',
      fn: async (page, h) => {
        await h.tryClick(page, 'Agendar');
        await h.tryClick(page, 'Novo');
        await h.sleep(1000);
        await h.screenshot(page, 'mobile', '02-agendamento-mobile');
      }
    },
    {
      name: 'Rotação de tela',
      fn: async (page, h) => {
        await page.setViewportSize({ width: 812, height: 375 });
        await h.sleep(1000);
        await h.screenshot(page, 'mobile', '03-rotacao-paisagem');
        await page.setViewportSize({ width: 375, height: 812 });
        await h.sleep(1000);
        await h.screenshot(page, 'mobile', '04-rotacao-retrato');
      }
    },
    {
      name: 'Responsividade',
      fn: async (page, h) => {
        const sizes = [
          { w: 320, h: 568, label: 'iphone-se' },
          { w: 414, h: 896, label: 'iphone-11' },
        ];
        for (const s of sizes) {
          await page.setViewportSize({ width: s.w, height: s.h });
          await h.sleep(500);
          await h.screenshot(page, 'mobile', `05-responsivo-${s.label}`);
        }
      }
    },
    {
      name: 'Retorno do background',
      fn: async (page, h) => {
        console.log('  📱 Simulando retorno do background...');
        await page.evaluate(() => {
          document.dispatchEvent(new Event('visibilitychange'));
        });
        await h.sleep(1000);
        await h.screenshot(page, 'mobile', '06-retorno-background');
      }
    }
  ]
};
