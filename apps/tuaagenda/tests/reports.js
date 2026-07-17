module.exports = {
  level: 'critical',
  category: 'Relatórios',
  tests: [
    {
      name: 'Relatório de faturamento',
      fn: async (page, h) => {
        await h.tryNavigateTo(page, [
          '/admin/relatorios/faturamento', '/admin/faturamento',
          '/admin/reports/billing'
        ], 'Faturamento');
        await h.screenshot(page, 'reports', '01-faturamento');
      }
    },
    {
      name: 'Relatório geral de agendamentos',
      fn: async (page, h) => {
        await h.tryNavigateTo(page, [
          '/admin/relatorios/agendamentos', '/admin/relatorios/visao-geral',
          '/admin/dashboard'
        ], 'Visão geral');
        await h.screenshot(page, 'reports', '02-geral-agendamentos');
      }
    },
    {
      name: 'Relatório de descontos',
      fn: async (page, h) => {
        await h.tryNavigateTo(page, [
          '/admin/relatorios/descontos', '/admin/descontos',
          '/admin/reports/discounts'
        ], 'Descontos');
        await h.screenshot(page, 'reports', '03-descontos');
      }
    },
    {
      name: 'Relatório por serviços',
      fn: async (page, h) => {
        await h.tryNavigateTo(page, [
          '/admin/relatorios/servicos', '/admin/reports/services'
        ], 'Serviços');
        await h.screenshot(page, 'reports', '04-por-servicos');
      }
    },
    {
      name: 'Relatório por profissionais',
      fn: async (page, h) => {
        await h.tryNavigateTo(page, [
          '/admin/relatorios/profissionais', '/admin/reports/staff'
        ], 'Profissionais');
        await h.screenshot(page, 'reports', '05-por-profissionais');
      }
    },
    {
      name: 'Filtros por período',
      fn: async (page, h) => {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        await h.fillField(page, 'Data início', firstDay.toISOString().split('T')[0]);
        await h.fillField(page, 'Data fim', lastDay.toISOString().split('T')[0]);
        await h.fillField(page, 'De', firstDay.toISOString().split('T')[0]);
        await h.fillField(page, 'Até', lastDay.toISOString().split('T')[0]);
        await h.tryClick(page, 'Filtrar');
        await h.sleep(2000);
        await h.screenshot(page, 'reports', '06-filtros-periodo');
      }
    },
    {
      name: 'Exportação PDF',
      fn: async (page, h) => {
        await h.tryClick(page, 'PDF');
        await h.tryClick(page, 'Exportar');
        await h.sleep(2000);
        await h.screenshot(page, 'reports', '07-exportacao-pdf');
      }
    },
    {
      name: 'Exportação Excel',
      fn: async (page, h) => {
        await h.tryClick(page, 'Excel');
        await h.tryClick(page, 'Exportar');
        await h.sleep(2000);
        await h.screenshot(page, 'reports', '08-exportacao-excel');
      }
    }
  ]
};
