module.exports = {
  level: 'critical',
  category: 'Cupons de Desconto',
  tests: [
    {
      name: 'Aplicar cupom válido',
      fn: async (page, h) => {
        try {
          await h.navigateAndWait(page, h.BASE_URL + '/agendar', 'Página de agendamento');
        } catch {
          const pages = page.context().pages();
          const agendarPage = pages.find(p => p.url().includes('agendar'));
          if (agendarPage) { page = agendarPage; await agendarPage.bringToFront(); }
        }
        await h.sleep(2000);
        if (!page.url().includes('agendar')) {
          await page.goto(h.BASE_URL + '/agendar', { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});
          await h.sleep(2000);
        }
        console.log('  URL atual:', page.url());
        await h.fillField(page, 'Cupom', 'TESTE10');
        await h.fillField(page, 'Código', 'TESTE10');
        await h.tryClick(page, 'Aplicar');
        await h.screenshot(page, 'coupons', '01-cupom-valido');
      }
    },
    {
      name: 'Cupom expirado',
      fn: async (page, h) => {
        await h.fillField(page, 'Cupom', 'EXPIRADO');
        await h.fillField(page, 'Código', 'EXPIRADO');
        await h.tryClick(page, 'Aplicar');
        await h.screenshot(page, 'coupons', '02-cupom-expirado');
      }
    },
    {
      name: 'Cupom inexistente',
      fn: async (page, h) => {
        await h.fillField(page, 'Cupom', 'INEXISTENTE123');
        await h.fillField(page, 'Código', 'INEXISTENTE123');
        await h.tryClick(page, 'Aplicar');
        await h.screenshot(page, 'coupons', '03-cupom-inexistente');
      }
    },
    {
      name: 'Remover cupom',
      fn: async (page, h) => {
        await h.tryClick(page, 'Remover');
        await h.tryClick(page, 'Limpar');
        await h.screenshot(page, 'coupons', '04-remover-cupom');
      }
    },
    {
      name: 'Persistência do desconto',
      fn: async (page, h) => {
        await h.fillField(page, 'Cupom', 'TESTE10');
        await h.tryClick(page, 'Aplicar');
        await h.sleep(1000);
        const currentUrl = page.url();
        await page.goto(currentUrl, { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});
        await h.sleep(2000);
        await h.screenshot(page, 'coupons', '05-persistencia-desconto');
      }
    }
  ]
};
