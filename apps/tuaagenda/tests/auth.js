module.exports = {
  level: 'critical',
  category: 'Autenticação',
  tests: [
    {
      name: 'Login com usuário válido',
      fn: async (page, h) => {
        await h.navigateAndWait(page, h.BASE_URL + '/login', 'Acessando página de login');
        await h.fillField(page, 'Email', 'joelmi.deus@tacontudo.com');
        await h.fillField(page, 'Senha', 'Z@ckwailde12');
        await h.tryClick(page, 'Entrar');
        await h.screenshot(page, 'auth', '01-login-valido');
      }
    },
    {
      name: 'Login com senha inválida',
      fn: async (page, h) => {
        await h.navigateAndWait(page, h.BASE_URL + '/login', 'Acessando página de login');
        await h.fillField(page, 'Email', 'joelmi.deus@tacontudo.com');
        await h.fillField(page, 'Senha', 'senha_errada');
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
        await h.fillField(page, 'Email', 'joelmi.deus@tacontudo.com');
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
    },
    {
      name: 'Alteração de senha',
      fn: async (page, h) => {
        await h.tryClick(page, 'Perfil');
        await h.tryClick(page, 'Alterar senha');
        await h.fillField(page, 'Senha atual', 'Z@ckwailde12');
        await h.fillField(page, 'Nova senha', '654321');
        await h.fillField(page, 'Confirmar', '654321');
        await h.tryClick(page, 'Salvar');
        await h.screenshot(page, 'auth', '05-alterar-senha');
      }
    }
  ]
};
