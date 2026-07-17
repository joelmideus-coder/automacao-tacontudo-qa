module.exports = {
  level: 'critical',
  category: 'Serviços',
  tests: [
    {
      name: 'Cadastro de serviço',
      fn: async (page, h) => {
        await h.tryNavigateTo(page, [
          '/admin/servicos', '/admin/services', '/servicos'
        ], 'Serviços');
        await h.tryClick(page, 'Novo');
        const suf = Math.floor(Math.random() * 10000);
        await h.fillField(page, 'Nome', `Serviço Teste ${suf}`);
        await h.fillField(page, 'Preço', '150');
        await h.fillField(page, 'Duração', '60');
        await h.tryClick(page, 'Salvar');
        await h.screenshot(page, 'services', '01-cadastro-servico');
      }
    },
    {
      name: 'Alteração de preço',
      fn: async (page, h) => {
        await h.tryClick(page, 'Editar');
        await h.fillField(page, 'Preço', '200');
        await h.fillField(page, 'Valor', '200');
        await h.tryClick(page, 'Salvar');
        await h.screenshot(page, 'services', '02-alteracao-preco');
      }
    },
    {
      name: 'Serviço inativo',
      fn: async (page, h) => {
        await h.tryClick(page, 'Ativo');
        await h.tryClick(page, 'Inativo');
        await h.tryClick(page, 'Salvar');
        await h.screenshot(page, 'services', '03-servico-inativo');
      }
    },
    {
      name: 'Exclusão de serviço',
      fn: async (page, h) => {
        await h.tryClick(page, 'Excluir');
        await h.tryClick(page, 'Confirmar');
        await h.sleep(1000);
        await h.screenshot(page, 'services', '04-exclusao-servico');
      }
    }
  ]
};
