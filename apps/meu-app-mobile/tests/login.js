const CONFIG = JSON.parse(process.env.APP_CONFIG || '{}');

module.exports = {
  level: 'smoke',
  category: 'Login Mobile',
  tests: [
    {
      name: 'Login com sucesso (Maestro)',
      fn: async (page, h) => {
        await h.runFlow('login');
        await h.screenshot(page, 'login', '01-login');
      }
    }
  ]
};
