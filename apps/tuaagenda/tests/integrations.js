module.exports = {
  level: 'full',
  category: 'Integrações',
  tests: [
    {
      name: 'Verificar Firebase config',
      fn: async (page, h) => {
        await h.navigateAndWait(page, h.BASE_URL, 'Página inicial');
        const hasFirebase = await page.evaluate(() => {
          return typeof window.firebase !== 'undefined' ||
                 document.querySelector('[src*="firebase"]') !== null;
        }).catch(() => false);
        console.log(`  🔥 Firebase ${hasFirebase ? '✅ presente' : '❌ não detectado'}`);
        await h.screenshot(page, 'integrations', '01-firebase');
      }
    },
    {
      name: 'Gateway de pagamento',
      fn: async (page, h) => {
        await h.navigateAndWait(page, h.BASE_URL + '/admin/financeiro', 'Gateway');
        await h.tryClick(page, 'Configurar');
        await h.tryClick(page, 'Gateway');
        await h.sleep(1000);
        await h.screenshot(page, 'integrations', '02-gateway-pagamento');
      }
    },
    {
      name: 'Envio de e-mail',
      fn: async (page, h) => {
        await h.navigateAndWait(page, h.BASE_URL + '/admin/configuracoes', 'Configurações');
        await h.tryClick(page, 'Email');
        await h.tryClick(page, 'Testar');
        await h.sleep(2000);
        await h.screenshot(page, 'integrations', '03-email');
      }
    }
  ]
};
