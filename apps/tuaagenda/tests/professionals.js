module.exports = {
  level: 'complete',
  category: 'Profissionais',
  tests: [
    {
      name: 'Cadastro de profissional',
      fn: async (page, h) => {
        await h.tryNavigateTo(page, [
          '/admin/profissionais', '/admin/staff', '/profissionais'
        ], 'Profissionais');
        await h.tryClick(page, 'Novo');
        const suf = Math.floor(Math.random() * 10000);
        await h.fillField(page, 'Nome', `Profissional ${suf}`);
        await h.fillField(page, 'Email', `prof${suf}@teste.com`);
        await h.fillField(page, 'Telefone', '11988888888');
        await h.tryClick(page, 'Salvar');
        await h.screenshot(page, 'professionals', '01-cadastro');
      }
    },
    {
      name: 'Horário de trabalho',
      fn: async (page, h) => {
        await h.tryClick(page, 'Horários');
        await h.tryClick(page, 'Editar');
        await h.sleep(500);
        await h.tryClick(page, 'Salvar');
        await h.screenshot(page, 'professionals', '02-horario-trabalho');
      }
    },
    {
      name: 'Bloqueio de horário',
      fn: async (page, h) => {
        await h.tryClick(page, 'Bloqueios');
        await h.tryClick(page, 'Novo bloqueio');
        await h.sleep(500);
        await h.tryClick(page, 'Salvar');
        await h.screenshot(page, 'professionals', '03-bloqueio');
      }
    },
    {
      name: 'Comissão',
      fn: async (page, h) => {
        await h.tryClick(page, 'Comissão');
        await h.fillField(page, 'Comissão', '30');
        await h.tryClick(page, 'Salvar');
        await h.screenshot(page, 'professionals', '04-comissao');
      }
    },
    {
      name: 'Exclusão de profissional',
      fn: async (page, h) => {
        await h.tryClick(page, 'Excluir');
        await h.tryClick(page, 'Confirmar');
        await h.sleep(1000);
        await h.screenshot(page, 'professionals', '05-exclusao');
      }
    }
  ]
};
