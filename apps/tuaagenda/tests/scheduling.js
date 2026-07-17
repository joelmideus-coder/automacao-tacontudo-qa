module.exports = {
  level: 'critical',
  category: 'Agenda',
  tests: [
    {
      name: 'Criar agendamento',
      fn: async (page, h) => {
        await h.tryNavigateTo(page, [
          '/admin/agendamentos', '/admin/schedules', '/agendamentos'
        ], 'Agendamentos');
        await h.tryClick(page, 'Novo');
        const suf = Math.floor(Math.random() * 10000);
        await h.fillField(page, 'Cliente', `Cliente Teste ${suf}`);
        await h.fillField(page, 'Serviço', 'Consulta');
        await h.fillField(page, 'Profissional', 'Profissional');
        await h.tryClick(page, 'Salvar');
        await h.screenshot(page, 'scheduling', '01-criar-agendamento');
      }
    },
    {
      name: 'Editar agendamento',
      fn: async (page, h) => {
        await h.tryClick(page, 'Editar');
        await h.sleep(1000);
        await h.tryClick(page, 'Salvar');
        await h.screenshot(page, 'scheduling', '02-editar-agendamento');
      }
    },
    {
      name: 'Cancelar agendamento',
      fn: async (page, h) => {
        await h.tryClick(page, 'Cancelar');
        await h.tryClick(page, 'Confirmar');
        await h.sleep(1000);
        await h.screenshot(page, 'scheduling', '03-cancelar-agendamento');
      }
    },
    {
      name: 'Reagendar',
      fn: async (page, h) => {
        await h.tryClick(page, 'Reagendar');
        await h.sleep(1000);
        await h.tryClick(page, 'Salvar');
        await h.screenshot(page, 'scheduling', '04-reagendar');
      }
    },
    {
      name: 'Visualização diária',
      fn: async (page, h) => {
        await h.tryClick(page, 'Dia');
        await h.sleep(1000);
        await h.screenshot(page, 'scheduling', '05-visao-diaria');
      }
    },
    {
      name: 'Visualização semanal',
      fn: async (page, h) => {
        await h.tryClick(page, 'Semana');
        await h.sleep(1000);
        await h.screenshot(page, 'scheduling', '06-visao-semanal');
      }
    },
    {
      name: 'Visualização mensal',
      fn: async (page, h) => {
        await h.tryClick(page, 'Mês');
        await h.sleep(1000);
        await h.screenshot(page, 'scheduling', '07-visao-mensal');
      }
    }
  ]
};
