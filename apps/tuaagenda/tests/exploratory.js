const CONFIG = JSON.parse(process.env.APP_CONFIG || '{}');
const CRED = CONFIG.credentials || {};

const XSS_PAYLOADS = [
  { label: 'Script tag simples', value: '<script>console.log("XSS_TEST_1")</script>' },
  { label: 'Img onerror', value: '<img src=x onerror="console.log(\'XSS_TEST_2\')">' },
  { label: 'SVG onload', value: '<svg onload="console.log(\'XSS_TEST_3\')">' },
  { label: 'Link javascript', value: '<a href="javascript:console.log(\'XSS_TEST_4\')">click</a>' },
  { label: 'Div com onmouseover', value: '<div onmouseover="console.log(\'XSS_TEST_5\')">hover</div>' },
  { label: 'Input com onfocus', value: '<input onfocus="console.log(\'XSS_TEST_6\')">' },
  { label: 'Body onload', value: '<body onload="console.log(\'XSS_TEST_7\')">' },
  { label: 'Caractere especial SQL-like', value: "'; DROP TABLE users; --" },
  { label: 'HTML entities', value: '&lt;script&gt;alert(1)&lt;/script&gt;' },
  { label: 'Unicode ofuscado', value: '<\u0073cript>console.log("XSS_TEST_10")</\u0073cript>' },
];

const SPECIAL_CHARS = [
  { label: 'Caracteres especiais', value: '!@#$%¨&*()_+{}[]|\\:;"\'<>,.?/~`' },
  { label: 'Acentos e UTF-8', value: 'áéíóúàèìòùâêîôûãõçñÁÉÍÓÚÀÈÌÒÙÂÊÎÔÛÃÕÇÑ' },
  { label: 'Emoji', value: '😀🔥🚀💩🎉✅❌⚠️🔴🟢' },
  { label: 'Espaços extremos', value: '   texto   ' },
  { label: 'String muito longa', value: 'A'.repeat(10000) },
  { label: 'String vazia', value: '' },
  { label: 'Nulo textual', value: 'null' },
  { label: 'Undefined textual', value: 'undefined' },
  { label: 'Zero', value: '0' },
  { label: 'Negativo', value: '-1' },
];

async function checkForExecutionErrors(page, h, payload) {
  // Verifica se o payload foi executado (XSS) em vez de apenas renderizado
  try {
    const title = await page.title();
    const bodyText = await page.evaluate(() => document.body.innerText);
    if (bodyText.includes('XSS_TEST')) {
      return `⚠️ Payload parece ter sido executado (encontrado no DOM)`;
    }
    // Verifica se o payload está visível como texto (comportamento correto)
    if (bodyText.includes(payload.value)) {
      return null; // Renderizado como texto - seguro
    }
  } catch (e) {
    return `Erro ao verificar execução: ${e.message}`;
  }
  return null;
}

module.exports = {
  level: 'full',
  category: 'Teste Exploratório (Myers) - Validação Adversarial',
  tests: [
    // ===== VALIDAÇÃO DE FORMULÁRIO =====
    {
      name: 'Submissão vazia no login',
      fn: async (page, h) => {
        await h.navigateAndWait(page, h.BASE_URL + '/login', 'Login');
        await h.tryClick(page, 'Entrar');
        await h.sleep(1000);
        const erro = await page.evaluate(() => document.body.innerText);
        if (!erro.includes('obrigatório') && !erro.includes('inválido') && !erro.includes('required')) {
          throw new Error('Nenhuma mensagem de validação exibida para submissão vazia');
        }
        await h.screenshot(page, 'exploratory', '01-login-vazio');
      }
    },
    {
      name: 'Submissão vazia no cadastro de cliente',
      fn: async (page, h) => {
        await h.tryNavigateTo(page, ['/admin/clientes', '/clientes'], 'Clientes');
        await h.tryClick(page, 'Novo');
        await h.sleep(500);
        await h.tryClick(page, 'Salvar');
        await h.sleep(1000);
        const erro = await page.evaluate(() => document.body.innerText);
        if (!erro.includes('obrigatório') && !erro.includes('inválido') && !erro.includes('required')) {
          throw new Error('Nenhuma validação visível ao salvar cliente vazio');
        }
        await h.screenshot(page, 'exploratory', '02-cadastro-vazio');
      }
    },
    {
      name: 'Email inválido no login',
      fn: async (page, h) => {
        await h.navigateAndWait(page, h.BASE_URL + '/login', 'Login');
        await h.fillField(page, 'Email', 'invalido');
        await h.fillField(page, 'Senha', 'qualquer');
        await h.tryClick(page, 'Entrar');
        await h.sleep(1000);
        const erro = await page.evaluate(() => document.body.innerText);
        if (!erro.includes('válido') && !erro.includes('Email') && !erro.includes('inválido') && !erro.includes('formato')) {
          console.warn('  ⚠️ Possível falha de validação de email');
        }
        await h.screenshot(page, 'exploratory', '03-email-invalido');
      }
    },

    // ===== XSS / INJEÇÃO =====
    ...XSS_PAYLOADS.map((p, i) => ({
      name: `XSS: ${p.label}`,
      fn: async (page, h) => {
        await h.navigateAndWait(page, h.BASE_URL + '/login', 'Login');
        await h.fillField(page, 'Email', p.value);
        await h.sleep(500);
        const execError = await checkForExecutionErrors(page, h, p);
        if (execError) throw new Error(execError);
        await h.screenshot(page, 'exploratory', `xss-${String(i + 1).padStart(2, '0')}`);
      }
    })),

    // ===== ENTRADA DE DADOS EXTREMOS =====
    ...SPECIAL_CHARS.map((p, i) => ({
      name: `Caractere especial: ${p.label}`,
      fn: async (page, h) => {
        await h.tryNavigateTo(page, ['/admin/clientes', '/clientes'], 'Clientes');
        await h.tryClick(page, 'Novo');
        await h.sleep(500);
        await h.fillField(page, 'Nome', p.value);
        await h.fillField(page, 'Email', `teste${i}@teste.com`);
        await h.tryClick(page, 'Salvar');
        await h.sleep(2000);
        // Verifica se a pagina nao quebrou
        const bodyText = await page.evaluate(() => document.body.innerText);
        if (bodyText.includes('Error') || bodyText.includes('Internal Server Error') || bodyText.includes('500')) {
          throw new Error(`Payload "${p.label}" quebrou a página (500/Error)`);
        }
        await h.screenshot(page, 'exploratory', `chars-${String(i + 1).padStart(2, '0')}-${p.label}`);
      }
    })),

    // ===== TESTE DE RÓTULOS =====
    {
      name: 'Botão "Cancelar" realmente cancela?',
      fn: async (page, h) => {
        await h.tryNavigateTo(page, ['/admin/clientes', '/clientes'], 'Clientes');
        await h.tryClick(page, 'Novo');
        await h.sleep(500);
        // Preenche algo
        await h.fillField(page, 'Nome', 'Teste Cancelar');
        await h.sleep(300);
        await h.tryClick(page, 'Cancelar');
        await h.sleep(1000);
        // Recarrega e verifica se o cliente NAO foi salvo
        await h.navigateAndWait(page, h.BASE_URL + '/admin/clientes', 'Clientes (reload)');
        const body = await page.evaluate(() => document.body.innerText);
        if (body.includes('Teste Cancelar')) {
          throw new Error('Botão "Cancelar" salvou o registro em vez de cancelar');
        }
        await h.screenshot(page, 'exploratory', '04-cancelar-test');
      }
    },
    {
      name: 'Botão "Excluir" realmente exclui?',
      fn: async (page, h) => {
        // Cria um cliente para excluir
        await h.tryNavigateTo(page, ['/admin/clientes', '/clientes'], 'Clientes');
        await h.tryClick(page, 'Novo');
        await h.sleep(300);
        const suf = Date.now();
        await h.fillField(page, 'Nome', `Excluir Teste ${suf}`);
        await h.fillField(page, 'Email', `excluir${suf}@teste.com`);
        await h.tryClick(page, 'Salvar');
        await h.sleep(2000);
        // Tenta excluir
        await h.tryClick(page, 'Excluir');
        await h.sleep(500);
        await h.tryClick(page, 'Confirmar');
        await h.sleep(1000);
        // Recarrega e verifica
        await h.navigateAndWait(page, h.BASE_URL + '/admin/clientes', 'Clientes (reload)');
        const body = await page.evaluate(() => document.body.innerText);
        if (body.includes(`Excluir Teste ${suf}`)) {
          throw new Error('Botão "Excluir" não removeu o registro (ainda aparece após reload)');
        }
        await h.screenshot(page, 'exploratory', '05-excluir-test');
      }
    },
    {
      name: 'Logout realmente desloga?',
      fn: async (page, h) => {
        await h.tryClick(page, 'Sair');
        await h.sleep(500);
        await h.tryClick(page, 'Logout');
        await h.sleep(1000);
        // Tenta acessar rota protegida
        await h.navigateAndWait(page, h.BASE_URL + '/admin/clientes', 'Tentando acesso pós-logout');
        const body = await page.evaluate(() => document.body.innerText);
        if (!body.includes('login') && !body.includes('Login') && !body.includes('entrar') && !body.includes('Entrar')) {
          console.warn('  ⚠️ Possível falha: acesso a rota admin parece não redirecionar ao login após logout');
        }
        await h.screenshot(page, 'exploratory', '06-logout-test');
      }
    },

    // ===== TESTE DE ERROS DE REDE =====
    {
      name: 'Erros 500 ao submeter dados inválidos',
      fn: async (page, h) => {
        await h.tryNavigateTo(page, ['/admin/clientes', '/clientes'], 'Clientes');
        await h.tryClick(page, 'Novo');
        await h.sleep(500);
        await h.fillField(page, 'Nome', '<script>payload</script>');
        await h.tryClick(page, 'Salvar');
        await h.sleep(2000);
        const body = await page.evaluate(() => document.body.innerText);
        if (body.includes('500') || body.includes('Internal Server Error')) {
          throw new Error('Requisição com payload XSS retornou 500 (deveria validar e rejeitar graciosamente)');
        }
        await h.screenshot(page, 'exploratory', '07-erro-500');
      }
    },
    {
      name: 'Mensagens de erro genéricas vs específicas',
      fn: async (page, h) => {
        await h.navigateAndWait(page, h.BASE_URL + '/login', 'Login');
        await h.fillField(page, 'Email', 'nao.existe@teste.com');
        await h.fillField(page, 'Senha', 'senha_errada_123');
        await h.tryClick(page, 'Entrar');
        await h.sleep(1500);
        const body = await page.evaluate(() => document.body.innerText);
        const msg = body.includes('Email') || body.includes('senha') || body.includes('inválido') || body.includes('credenciais');
        if (!msg) {
          console.warn('  ⚠️ Mensagem de erro genérica demais - não informa qual campo está errado');
        }
        await h.screenshot(page, 'exploratory', '08-erro-generico');
      }
    },
  ]
};
