module.exports = {
  level: 'full',
  category: 'Segurança',
  tests: [
    {
      name: 'SQL Injection',
      fn: async (page, h) => {
        await h.navigateAndWait(page, h.BASE_URL + '/login', 'Login - SQL Injection');
        await h.fillField(page, 'Email', "' OR '1'='1' --");
        await h.fillField(page, 'Senha', "' OR '1'='1");
        await h.tryClick(page, 'Entrar');
        await h.sleep(2000);
        if (page.url().includes('login')) {
          console.log('  ✅ SQL Injection bloqueado (permaneceu no login)');
        } else {
          console.warn('  ⚠️  Possível vulnerabilidade SQL Injection');
        }
        await h.screenshot(page, 'security', '01-sql-injection');
      }
    },
    {
      name: 'XSS (Cross-Site Scripting)',
      fn: async (page, h) => {
        await h.fillField(page, 'Email', '<script>alert("XSS")</script>');
        await h.fillField(page, 'Senha', 'Z@ckwailde12');
        await h.tryClick(page, 'Entrar');
        await h.sleep(1000);
        const alertShown = await page.evaluate(() => document.querySelector('script')).catch(() => false);
        if (!alertShown) console.log('  ✅ XSS bloqueado');
        await h.screenshot(page, 'security', '02-xss');
      }
    },
    {
      name: 'Token inválido',
      fn: async (page, h) => {
        await page.evaluate(() => {
          localStorage.setItem('token', 'token-invalido-123');
        });
        await page.reload({ waitUntil: 'networkidle' });
        await h.sleep(2000);
        if (page.url().includes('login')) {
          console.log('  ✅ Token inválido redirecionou para login');
        }
        await h.screenshot(page, 'security', '03-token-invalido');
      }
    }
  ]
};
