const randomSuffix = () => Math.floor(Math.random() * 10000);

module.exports = {
  level: 'critical',
  category: 'Cadastro de Usuários',
  tests: [
    {
      name: 'Cadastro de cliente',
      fn: async (page, h) => {
        await h.tryNavigateTo(page, ['/admin/clientes', '/admin/users', '/clientes'], 'Clientes');
        const suf = randomSuffix();
        await h.tryClick(page, 'Novo');
        await h.fillField(page, 'Nome', `Cliente Teste ${suf}`);
        await h.fillField(page, 'Email', `cliente${suf}@teste.com`);
        await h.fillField(page, 'Telefone', '11999999999');
        await h.tryClick(page, 'Salvar');
        await h.screenshot(page, 'users', '01-cadastro-cliente');
      }
    },
    {
      name: 'Edição de cliente',
      fn: async (page, h) => {
        await h.tryClick(page, 'Editar');
        await h.sleep(1000);
        await h.fillField(page, 'Nome', 'Cliente Editado');
        await h.tryClick(page, 'Salvar');
        await h.screenshot(page, 'users', '02-edicao-cliente');
      }
    },
    {
      name: 'Pesquisa de cliente',
      fn: async (page, h) => {
        await h.fillField(page, 'Buscar', 'Cliente Teste');
        await h.fillField(page, 'Pesquisar', 'Cliente Teste');
        await h.sleep(2000);
        await h.screenshot(page, 'users', '03-pesquisa-cliente');
      }
    },
    {
      name: 'Validação de campos obrigatórios',
      fn: async (page, h) => {
        await h.tryClick(page, 'Novo');
        await h.tryClick(page, 'Salvar');
        await h.sleep(1000);
        await h.screenshot(page, 'users', '04-campos-obrigatorios');
      }
    },
    {
      name: 'Exclusão de cliente',
      fn: async (page, h) => {
        await h.tryClick(page, 'Excluir');
        await h.tryClick(page, 'Confirmar');
        await h.sleep(1000);
        await h.screenshot(page, 'users', '05-exclusao-cliente');
      }
    }
  ]
};
