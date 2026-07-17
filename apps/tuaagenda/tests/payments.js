module.exports = {
  level: 'critical',
  category: 'Pagamentos',
  tests: [
    {
      name: 'Pagamento PIX',
      fn: async (page, h) => {
        await h.tryNavigateTo(page, [
          '/admin/financeiro', '/admin/finances', '/financeiro'
        ], 'Financeiro');
        await h.tryClick(page, 'PIX');
        await h.tryClick(page, 'Pix');
        await h.sleep(1000);
        await h.screenshot(page, 'payments', '01-pagamento-pix');
      }
    },
    {
      name: 'Pagamento cartão',
      fn: async (page, h) => {
        await h.tryClick(page, 'Cartão');
        await h.tryClick(page, 'Crédito');
        await h.sleep(1000);
        await h.screenshot(page, 'payments', '02-pagamento-cartao');
      }
    },
    {
      name: 'Pagamento dinheiro',
      fn: async (page, h) => {
        await h.tryClick(page, 'Dinheiro');
        await h.sleep(1000);
        await h.screenshot(page, 'payments', '03-pagamento-dinheiro');
      }
    },
    {
      name: 'Múltiplas formas',
      fn: async (page, h) => {
        await h.tryClick(page, 'Dividir');
        await h.fillField(page, 'Cartão', '50');
        await h.fillField(page, 'Dinheiro', '50');
        await h.tryClick(page, 'Confirmar');
        await h.screenshot(page, 'payments', '04-multiplas-formas');
      }
    },
    {
      name: 'Cancelamento de pagamento',
      fn: async (page, h) => {
        await h.tryClick(page, 'Cancelar');
        await h.tryClick(page, 'Confirmar');
        await h.sleep(1000);
        await h.screenshot(page, 'payments', '05-cancelamento-pagamento');
      }
    }
  ]
};
