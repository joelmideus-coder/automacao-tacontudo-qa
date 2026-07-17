module.exports = {
  level: 'complete',
  category: 'Configurações',
  tests: [
    {
      name: 'Alterar dados da empresa',
      fn: async (page, h) => {
        await h.tryNavigateTo(page, [
          '/admin/configuracoes/empresa',
          '/admin/settings/company',
          '/admin/configuracoes'
        ], 'Configurações');
        await h.fillField(page, 'Nome', 'Tua Agenda Teste');
        await h.fillField(page, 'Telefone', '11999999999');
        await h.tryClick(page, 'Salvar');
        await h.screenshot(page, 'settings', '01-dados-empresa');
      }
    },
    {
      name: 'Alterar horário de funcionamento',
      fn: async (page, h) => {
        await h.tryClick(page, 'Horários');
        await h.tryClick(page, 'Funcionamento');
        await h.sleep(500);
        await h.tryClick(page, 'Salvar');
        await h.screenshot(page, 'settings', '02-horario-funcionamento');
      }
    },
    {
      name: 'Configurar formas de pagamento',
      fn: async (page, h) => {
        await h.tryClick(page, 'Formas de pagamento');
        await h.tryClick(page, 'PIX');
        await h.tryClick(page, 'Cartão');
        await h.tryClick(page, 'Dinheiro');
        await h.tryClick(page, 'Salvar');
        await h.screenshot(page, 'settings', '03-formas-pagamento');
      }
    },
    {
      name: 'Configurar notificações',
      fn: async (page, h) => {
        await h.tryClick(page, 'Notificações');
        await h.tryClick(page, 'Push');
        await h.tryClick(page, 'Email');
        await h.tryClick(page, 'Salvar');
        await h.screenshot(page, 'settings', '04-config-notificacoes');
      }
    },
    {
      name: 'Configurar usuários do sistema',
      fn: async (page, h) => {
        await h.tryClick(page, 'Usuários');
        await h.tryClick(page, 'Novo');
        await h.sleep(500);
        await h.tryClick(page, 'Salvar');
        await h.screenshot(page, 'settings', '05-config-usuarios');
      }
    }
  ]
};
