module.exports = {
  level: 'complete',
  category: 'Performance',
  tests: [
    {
      name: 'Tempo de login',
      fn: async (page, h) => {
        const start = Date.now();
        await h.navigateAndWait(page, h.BASE_URL + '/login', 'Medindo login');
        const elapsed = Date.now() - start;
        console.log(`  ⏱️  Carregamento da página de login: ${elapsed}ms`);
        await h.fillField(page, 'Email', 'joelmi.deus@tacontudo.com');
        await h.fillField(page, 'Senha', 'Z@ckwailde12');
        const loginStart = Date.now();
        await h.tryClick(page, 'Entrar');
        const loginElapsed = Date.now() - loginStart;
        console.log(`  ⏱️  Tempo de login: ${loginElapsed}ms`);
        await h.screenshot(page, 'performance', '01-login');
      }
    },
    {
      name: 'Carregamento da agenda',
      fn: async (page, h) => {
        const start = Date.now();
        await h.navigateAndWait(page, h.BASE_URL + '/admin/agendamentos', 'Medindo agenda');
        const elapsed = Date.now() - start;
        console.log(`  ⏱️  Carregamento da agenda: ${elapsed}ms`);
        await h.screenshot(page, 'performance', '02-carregamento-agenda');
      }
    },
    {
      name: 'Pesquisa de clientes',
      fn: async (page, h) => {
        const start = Date.now();
        await h.fillField(page, 'Buscar', 'a');
        await h.fillField(page, 'Pesquisar', 'a');
        await h.sleep(2000);
        const elapsed = Date.now() - start;
        console.log(`  ⏱️  Pesquisa de clientes: ${elapsed}ms`);
        await h.screenshot(page, 'performance', '03-pesquisa-clientes');
      }
    },
    {
      name: 'Carregamento de relatórios',
      fn: async (page, h) => {
        const start = Date.now();
        await h.navigateAndWait(page, h.BASE_URL + '/admin/relatorios/faturamento', 'Medindo relatório');
        const elapsed = Date.now() - start;
        console.log(`  ⏱️  Carregamento do relatório: ${elapsed}ms`);
        await h.screenshot(page, 'performance', '04-relatorios');
      }
    }
  ]
};
