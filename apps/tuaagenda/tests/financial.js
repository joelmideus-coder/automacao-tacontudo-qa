module.exports = {
  level: 'critical',
  category: 'Financeiro',
  tests: [
    {
      name: 'Recebimento',
      fn: async (page, h) => {
        await h.tryNavigateTo(page, [
          '/admin/financeiro', '/admin/finances', '/financeiro'
        ], 'Financeiro');
        await h.tryClick(page, 'Receber');
        await h.sleep(1000);
        await h.tryClick(page, 'Confirmar');
        await h.screenshot(page, 'financial', '01-recebimento');
      }
    },
    {
      name: 'Pagamento parcial',
      fn: async (page, h) => {
        await h.tryClick(page, 'Pagamento');
        await h.fillField(page, 'Valor', '50');
        await h.tryClick(page, 'Confirmar');
        await h.screenshot(page, 'financial', '02-pagamento-parcial');
      }
    },
    {
      name: 'Estorno',
      fn: async (page, h) => {
        await h.tryClick(page, 'Estornar');
        await h.tryClick(page, 'Confirmar');
        await h.sleep(1000);
        await h.screenshot(page, 'financial', '03-estorno');
      }
    },
    {
      name: 'Cancelamento financeiro',
      fn: async (page, h) => {
        await h.tryClick(page, 'Cancelar');
        await h.tryClick(page, 'Confirmar');
        await h.sleep(1000);
        await h.screenshot(page, 'financial', '04-cancelamento-financeiro');
      }
    },
    {
      name: 'Desconto manual',
      fn: async (page, h) => {
        await h.tryClick(page, 'Desconto');
        await h.sleep(500);
        await h.fillField(page, 'Desconto', '10');
        await h.tryClick(page, 'Aplicar');
        await h.screenshot(page, 'financial', '05-desconto-manual');
      }
    },
    {
      name: 'Fechamento de caixa',
      fn: async (page, h) => {
        await h.tryClick(page, 'Fechar caixa');
        await h.tryClick(page, 'Fechar');
        await h.sleep(1000);
        await h.screenshot(page, 'financial', '06-fechamento-caixa');
      }
    },
    {
      name: 'Sangria',
      fn: async (page, h) => {
        await h.tryClick(page, 'Sangria');
        await h.fillField(page, 'Valor', '100');
        await h.fillField(page, 'Motivo', 'Sangria de teste');
        await h.tryClick(page, 'Confirmar');
        await h.screenshot(page, 'financial', '07-sangria');
      }
    },
    {
      name: 'Suprimento',
      fn: async (page, h) => {
        await h.tryClick(page, 'Suprimento');
        await h.fillField(page, 'Valor', '500');
        await h.fillField(page, 'Motivo', 'Suprimento de teste');
        await h.tryClick(page, 'Confirmar');
        await h.screenshot(page, 'financial', '08-suprimento');
      }
    }
  ]
};
