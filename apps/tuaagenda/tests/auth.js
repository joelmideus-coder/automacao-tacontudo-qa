const CONFIG = JSON.parse(process.env.APP_CONFIG || '{}');
const CRED = CONFIG.credentials || {};
const EMAIL = CRED.email || 'joelmi.deus@tacontudo.com';
const SENHA = CRED.password || 'Z@ckwailde12';

module.exports = {
  level: 'critical',
  category: 'Autenticação',
  tests: [
    {
      name: 'Login com sucesso',
      fn: async (page, h) => {
        await h.navigateAndWait(page, h.BASE_URL + '/login', 'Acessando página de login');
        await h.fillField(page, 'Email', EMAIL);
        await h.fillField(page, 'Senha', SENHA);
        await h.tryClick(page, 'Entrar');
        await h.screenshot(page, 'auth', '01-login-valido');
      }
    },
    {
      name: 'Login com senha inválida',
      fn: async (page, h) => {
        await h.navigateAndWait(page, h.BASE_URL + '/login', 'Acessando página de login');
        await h.fillField(page, 'Email', EMAIL);
        await h.fillField(page, 'Senha', 'senha_errada_123');
        await h.tryClick(page, 'Entrar');
        await h.screenshot(page, 'auth', '02-login-invalido');
      }
    },
    {
      name: 'Recuperação de senha',
      fn: async (page, h) => {
        await h.navigateAndWait(page, h.BASE_URL + '/login', 'Acessando página de login');
        await h.tryClick(page, 'Esqueci');
        await h.sleep(1000);
        await h.fillField(page, 'Email', EMAIL);
        await h.tryClick(page, 'Enviar');
        await h.screenshot(page, 'auth', '03-recuperar-senha');
      }
    },
    {
      name: 'Logout',
      fn: async (page, h) => {
        await h.tryClick(page, 'Sair');
        await h.tryClick(page, 'Logout');
        await h.sleep(1000);
        await h.screenshot(page, 'auth', '04-logout');
      }
    }
  ]
};
