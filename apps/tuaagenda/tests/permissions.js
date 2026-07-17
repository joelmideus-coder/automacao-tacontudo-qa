module.exports = {
  level: 'complete',
  category: 'Permissões',
  tests: [
    {
      name: 'Acesso administrador',
      fn: async (page, h) => {
        await h.navigateAndWait(page, h.BASE_URL + '/admin', 'Painel admin');
        await h.screenshot(page, 'permissions', '01-admin');
      }
    },
    {
      name: 'Acesso recepcionista',
      fn: async (page, h) => {
        await h.navigateAndWait(page, h.BASE_URL + '/login', 'Login recepcionista');
        await h.fillField(page, 'Email', 'recepcionista@tuaagenda.app');
        await h.fillField(page, 'Senha', 'Z@ckwailde12');
        await h.tryClick(page, 'Entrar');
        await h.sleep(2000);
        await h.screenshot(page, 'permissions', '02-recepcionista');
      }
    },
    {
      name: 'Menu por perfil',
      fn: async (page, h) => {
        const visibleItems = await page.locator('nav a, nav button, .sidebar a, .menu a').allTextContents();
        console.log(`  📋 Menu visível: ${visibleItems.join(', ')}`);
        await h.screenshot(page, 'permissions', '03-menu-perfil');
      }
    },
    {
      name: 'Acesso indevido',
      fn: async (page, h) => {
        await h.navigateAndWait(page, h.BASE_URL + '/admin/configuracoes', 'Tentando admin');
        if (page.url().includes('login') || page.url().includes('403')) {
          console.log('  ✅ Acesso negado conforme esperado');
        }
        await h.screenshot(page, 'permissions', '04-acesso-indevido');
      }
    }
  ]
};
