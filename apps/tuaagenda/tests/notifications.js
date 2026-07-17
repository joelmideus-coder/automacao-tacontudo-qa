module.exports = {
  level: 'complete',
  category: 'Notificações',
  tests: [
    {
      name: 'Configuração de notificações',
      fn: async (page, h) => {
        await h.tryNavigateTo(page, [
          '/admin/configuracoes/notificacoes',
          '/admin/settings/notifications',
          '/admin/notificacoes'
        ], 'Notificações');
        await h.screenshot(page, 'notifications', '01-config-notificacoes');
      }
    },
    {
      name: 'Ativar push',
      fn: async (page, h) => {
        await h.tryClick(page, 'Push');
        await h.tryClick(page, 'Ativar');
        await h.tryClick(page, 'Salvar');
        await h.screenshot(page, 'notifications', '02-ativar-push');
      }
    },
    {
      name: 'Ativar notificação de agendamento',
      fn: async (page, h) => {
        await h.tryClick(page, 'Agendamento');
        await h.tryClick(page, 'Ativar');
        await h.tryClick(page, 'Salvar');
        await h.screenshot(page, 'notifications', '03-notificacao-agendamento');
      }
    },
    {
      name: 'Ativar notificação de cancelamento',
      fn: async (page, h) => {
        await h.tryClick(page, 'Cancelamento');
        await h.tryClick(page, 'Ativar');
        await h.tryClick(page, 'Salvar');
        await h.screenshot(page, 'notifications', '04-notificacao-cancelamento');
      }
    },
    {
      name: 'Ativar notificação de lembrete',
      fn: async (page, h) => {
        await h.tryClick(page, 'Lembrete');
        await h.tryClick(page, 'Ativar');
        await h.tryClick(page, 'Salvar');
        await h.screenshot(page, 'notifications', '05-notificacao-lembrete');
      }
    }
  ]
};
