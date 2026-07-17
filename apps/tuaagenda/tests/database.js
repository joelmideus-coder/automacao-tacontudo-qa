module.exports = {
  level: 'full',
  category: 'Banco de Dados',
  tests: [
    {
      name: 'Persistência de dados',
      fn: async (page, h) => {
        const suf = Math.floor(Math.random() * 10000);
        await h.navigateAndWait(page, h.BASE_URL + '/admin/clientes', 'Clientes');
        await h.tryClick(page, 'Novo');
        await h.fillField(page, 'Nome', `Persistência Teste ${suf}`);
        await h.fillField(page, 'Email', `persistencia${suf}@teste.com`);
        await h.tryClick(page, 'Salvar');
        await h.sleep(1000);
        await page.reload({ waitUntil: 'networkidle' });
        await h.sleep(2000);
        await h.fillField(page, 'Buscar', `Persistência Teste ${suf}`);
        await h.fillField(page, 'Pesquisar', `Persistência Teste ${suf}`);
        await h.sleep(2000);
        await h.screenshot(page, 'database', '01-persistencia');
      }
    },
    {
      name: 'Exclusão lógica',
      fn: async (page, h) => {
        await h.tryClick(page, 'Excluir');
        await h.tryClick(page, 'Confirmar');
        await h.sleep(1000);
        await h.screenshot(page, 'database', '02-exclusao-logica');
      }
    },
    {
      name: 'Histórico de alterações',
      fn: async (page, h) => {
        await h.tryClick(page, 'Histórico');
        await h.sleep(2000);
        await h.screenshot(page, 'database', '03-historico');
      }
    }
  ]
};
