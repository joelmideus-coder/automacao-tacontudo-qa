const CONFIG = JSON.parse(process.env.APP_CONFIG || '{}');
const CRED = CONFIG.credentials || {};

module.exports = {
  level: 'smoke',
  category: 'Smoke Test (Pré-Produção)',
  tests: [
    {
      name: 'Login',
      fn: async (page, h) => {
        await h.navigateAndWait(page, h.BASE_URL + '/login', 'Login');
        await h.fillField(page, 'Email', CRED.email || 'joelmi.deus@tacontudo.com');
        await h.fillField(page, 'Senha', CRED.password || 'Z@ckwailde12');
        await h.tryClick(page, 'Entrar');
        await h.sleep(2000);
        await h.screenshot(page, 'smoke', '01-login');
      }
    },
    {
      name: 'Criar cliente',
      fn: async (page, h) => {
        await h.tryNavigateTo(page, ['/admin/clientes'], 'Clientes');
        const suf = Math.floor(Math.random() * 10000);
        await h.tryClick(page, 'Novo');
        await h.fillField(page, 'Nome', `Smoke ${suf}`);
        await h.fillField(page, 'Email', `smoke${suf}@teste.com`);
        await h.tryClick(page, 'Salvar');
        await h.screenshot(page, 'smoke', '02-criar-cliente');
      }
    },
    {
      name: 'Criar agendamento',
      fn: async (page, h) => {
        await h.tryNavigateTo(page, ['/admin/agendamentos'], 'Agendamentos');
        await h.tryClick(page, 'Novo');
        await h.sleep(1000);
        await h.tryClick(page, 'Salvar');
        await h.screenshot(page, 'smoke', '03-criar-agendamento');
      }
    },
    {
      name: 'Aplicar cupom',
      fn: async (page, h) => {
        await h.navigateAndWait(page, h.BASE_URL + '/agendar', 'Agendamento web');
        await h.fillField(page, 'Cupom', 'TESTE10');
        await h.tryClick(page, 'Aplicar');
        await h.screenshot(page, 'smoke', '04-aplicar-cupom');
      }
    },
    {
      name: 'Emitir relatório',
      fn: async (page, h) => {
        await h.navigateAndWait(page, h.BASE_URL + '/admin/relatorios/faturamento', 'Relatório');
        await h.screenshot(page, 'smoke', '05-relatorio');
      }
    },
    {
      name: 'Logout',
      fn: async (page, h) => {
        await h.tryClick(page, 'Sair');
        await h.tryClick(page, 'Logout');
        await h.sleep(1000);
        await h.screenshot(page, 'smoke', '06-logout');
      }
    }
  ]
};
