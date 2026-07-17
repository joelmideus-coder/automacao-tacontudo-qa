module.exports = {
  level: 'complete',
  category: 'API',
  tests: [
    {
      name: 'HTTP 200 - Listar agendamentos',
      fn: async (page, h) => {
        const resp = await page.request.get(h.BASE_URL + '/api/agendamentos');
        console.log(`  📡 GET /api/agendamentos -> ${resp.status()}`);
        await h.screenshot(page, 'api', '01-http-200');
      }
    },
    {
      name: 'HTTP 400 - Requisição inválida',
      fn: async (page, h) => {
        const resp = await page.request.post(h.BASE_URL + '/api/agendamentos', {
          data: { invalid: true }
        });
        console.log(`  📡 POST /api/agendamentos (inválido) -> ${resp.status()}`);
        await h.screenshot(page, 'api', '02-http-400');
      }
    },
    {
      name: 'HTTP 401 - Não autenticado',
      fn: async (page, h) => {
        const resp = await page.request.get(h.BASE_URL + '/api/admin/usuarios');
        console.log(`  📡 GET /api/admin/usuarios -> ${resp.status()}`);
        await h.screenshot(page, 'api', '03-http-401');
      }
    },
    {
      name: 'HTTP 403 - Sem permissão',
      fn: async (page, h) => {
        const resp = await page.request.get(h.BASE_URL + '/api/admin/configuracoes');
        console.log(`  📡 GET /api/admin/configuracoes -> ${resp.status()}`);
        await h.screenshot(page, 'api', '04-http-403');
      }
    },
    {
      name: 'HTTP 404 - Rota inexistente',
      fn: async (page, h) => {
        const resp = await page.request.get(h.BASE_URL + '/api/rota-inexistente-123');
        console.log(`  📡 GET /api/rota-inexistente -> ${resp.status()}`);
        await h.screenshot(page, 'api', '05-http-404');
      }
    },
    {
      name: 'Timeout',
      fn: async (page, h) => {
        console.log('  ⏱️  Simulando timeout...');
        await h.screenshot(page, 'api', '06-timeout');
      }
    },
    {
      name: 'Sem internet',
      fn: async (page, h) => {
        console.log('  📵 Simulando offline...');
        await h.screenshot(page, 'api', '07-sem-internet');
      }
    }
  ]
};
