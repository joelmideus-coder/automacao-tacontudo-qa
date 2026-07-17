# QA Framework

Framework genérico de testes automatizados com Playwright.
Criado para testar qualquer aplicação web com máxima produtividade.

## ✨ Funcionalidades

- **4 níveis de teste**: Smoke → Crítica → Completa → Full
- **Relatório Word** automático com screenshots
- **Dashboard HTML** com gráficos de pizza e KPIs
- **Painel de controle** com botões interativos e output em tempo real
- **100% portátil**: roda em qualquer máquina com Node.js
- **Multi-app**: teste quantas aplicações quiser com um único framework
- **Configurável por JSON**: sem precisar alterar código

## 📦 Estrutura

```
qa-framework/
├── run.js                 # 🚀 Entry point (não mexa aqui)
├── package.json           # Dependências
├── .env.example           # Exemplo de configuração
├── .gitignore
│
├── core/                  # ⚙️ Motor genérico (reutilizável)
│   ├── runner.js           # Executa os testes
│   ├── helpers.js          # Funções utilitárias (click, fill, screenshot)
│   ├── report.js           # Gera relatório Word
│   ├── report-bugs.js      # Gera relatório de bugs
│   ├── server.js           # Servidor web para o painel
│   └── dashboard.html      # Dashboard visual interativo
│
├── apps/                  # 📦 Aplicações para testar
│   └── tuaagenda/          # Exemplo: TuaAgenda
│       ├── config.json     # Configuração da aplicação
│       └── tests/          # Módulos de teste
│           ├── auth.js
│           ├── smoke.js
│           └── ...
│
└── screenshots/           # 📸 Evidências (gerado automaticamente)
```

## 🚀 Instalação

### Pré-requisitos

- **Node.js** 18+ ([Download](https://nodejs.org))
- **Google Chrome** ou Chromium

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/qa-framework.git
cd qa-framework

# 2. Instale as dependências
npm install

# 3. Instale o Chromium para o Playwright
npx playwright install chromium

# 4. Configure o ambiente (opcional)
cp .env.example .env
# Edite o .env com suas credenciais
```

## 🎯 Como usar

### Testar uma aplicação existente

```bash
# Testa a app padrão (definida em APP ou .env)
npm test

# Especificar o app
APP=tuaagenda npm test
```

### Níveis de teste

```bash
# Smoke - Apenas o essencial (6 testes)
npm run smoke

# Crítico - Funcionalidades principais (45 testes)
npm run critical

# Completo - Cobertura completa (69 testes)
npm run complete

# Full - Tudo, incluindo segurança e performance (100 testes)
npm run full
```

### Modo headless (sem abrir navegador)

```bash
HEADLESS=true npm test
```

### Gerar relatórios

```bash
# Relatório de regressão (Word)
npm run report

# Relatório de bugs (Word)
npm run report:bugs
```

### Painel de controle interativo

```bash
# Iniciar servidor do painel
npm run server

# Abrir http://localhost:3456 no navegador
```

O painel tem botões para executar qualquer teste com um clique,
além de output em tempo real com cores e atalhos de teclado.

## 🧪 Adicionar uma nova aplicação

### 1. Crie a estrutura

```bash
mkdir -p apps/minha-app/tests
```

### 2. Crie o config.json

`apps/minha-app/config.json`:

```json
{
  "appName": "Minha App",
  "baseUrl": "https://minha-app.com",
  "locale": "pt-BR",
  "credentials": {
    "email": "usuario@teste.com",
    "password": "minha-senha"
  },
  "selectors": {
    "email": "#email",
    "password": "#senha",
    "submit": "button[type=\"submit\"]"
  }
}
```

### 3. Crie os módulos de teste

`apps/minha-app/tests/login.js`:

```js
const CONFIG = JSON.parse(process.env.APP_CONFIG || '{}');
const CRED = CONFIG.credentials || {};

module.exports = {
  level: 'critical',
  category: 'Login',
  tests: [
    {
      name: 'Login com sucesso',
      fn: async (page, h) => {
        await h.navigateAndWait(page, h.BASE_URL + '/login', 'Login');
        await h.fillField(page, 'Email', CRED.email);
        await h.fillField(page, 'Senha', CRED.password);
        await h.tryClick(page, 'Entrar');
        await h.screenshot(page, 'login', '01-sucesso');
      }
    }
  ]
};
```

### 4. Teste

```bash
APP=minha-app npm test
```

## 📋 Criar módulos de teste

Cada arquivo em `apps/<app>/tests/` exporta:

| Campo | Descrição | Exemplo |
|-------|-----------|---------|
| `level` | Nível do teste | `'smoke'`, `'critical'`, `'complete'`, `'full'` |
| `category` | Nome do módulo | `'Autenticação'` |
| `tests[]` | Array de testes | `[{ name, fn }]` |

Cada teste recebe `(page, helpers)` onde `helpers` tem:

| Função | Descrição |
|--------|-----------|
| `navigateAndWait(page, url, desc)` | Navega para URL |
| `tryClick(page, texto)` | Clica em elemento pelo texto |
| `fillField(page, label, valor)` | Preenche campo pelo placeholder/label |
| `screenshot(page, pasta, nome)` | Captura screenshot |
| `tryNavigateTo(page, paths, desc)` | Tenta várias rotas |
| `sleep(ms)` | Aguarda |
| `BASE_URL` | URL base da aplicação |

## 🌐 Variáveis de ambiente

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `APP` | App a testar | `tuaagenda` |
| `TEST_LEVEL` | Nível do teste | `critical` |
| `HEADLESS` | Modo invisível | `true` |
| `BASE_URL` | URL da aplicação | `config.json` |
| `EMAIL_TESTE` | Email de login | `config.json` |
| `SENHA_TESTE` | Senha de login | `config.json` |
| `APP_ENV` | Ambiente | `dev` |

## 📊 Resultados

Após executar os testes, você encontra:

```
qa-framework/
├── screenshots/           # 📸 Evidências em PNG
│   ├── smoke/
│   ├── auth/
│   ├── scheduling/
│   └── ...
├── results.json           # 📊 Resultados em JSON
└── Desktop/               # 📄 Relatórios Word
    ├── Caderno_Evidencias_*.docx
    └── Relatorio_Bugs_*.docx
```

## 🔧 Comandos rápidos

```bash
# Executar tudo
APP=tuaagenda HEADLESS=true TEST_LEVEL=full npm test && npm run report

# Executar + relatório de bugs
npm run full && npm run report:bugs

# Abrir dashboard
npm run dashboard

# Servidor + painel
npm run server
# Abra http://localhost:3456
```

## 🤝 Contribuindo

1. Crie uma branch: `git checkout -b feature/minha-feature`
2. Commit: `git commit -m "feat: minha feature"`
3. Push: `git push origin feature/minha-feature`
4. Abra um Pull Request

## 📝 Licença

MIT
