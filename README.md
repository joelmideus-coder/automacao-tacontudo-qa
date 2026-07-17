<p align="center">
  <img src="https://img.shields.io/badge/QA_Framework-v1.0.0-8B5CF6?style=for-the-badge&logo=playwright&logoColor=white" alt="Version">
  <img src="https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node">
  <img src="https://img.shields.io/badge/Playwright-1.61%2B-45BA4D?style=for-the-badge&logo=playwright&logoColor=white" alt="Playwright">
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License">
  <img src="https://img.shields.io/badge/status-production%20ready-22C55E?style=for-the-badge" alt="Status">
</p>

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=140&section=header&text=QA%20Framework&fontSize=52&fontAlignY=32&fontColor=ffffff&desc=Testes%20Automatizados%20Inteligentes%20com%20Playwright&descAlignY=55&descSize=16" alt="header"/>
</p>

<p align="center">
  <b>🔥 Um framework genérico, portátil e elegante para testar qualquer aplicação web.</b><br>
  <i>Criado para transformar o caos da regressão manual em beleza automatizada.</i>
</p>

<br>

---

## 📋 Índice

<p align="center">
  <a href="#-visão-geral">Visão Geral</a> •
  <a href="#-arquitetura">Arquitetura</a> •
  <a href="#-instalação">Instalação</a> •
  <a href="#-como-usar">Como Usar</a> •
  <a href="#-níveis-de-teste">Níveis</a> •
  <a href="#-dashboard-interativo">Dashboard</a> •
  <a href="#-relatórios">Relatórios</a> •
  <a href="#-adicionar-nova-app">Nova App</a> •
  <a href="#-api-de-helpers">Helpers</a> •
  <a href="#-variáveis-de-ambiente">Env</a>
</p>

<br>

## 🚀 Visão Geral

Este não é apenas mais um framework de testes. É uma **plataforma completa de automação** que resolve de verdade o problema de testar aplicações web no dia a dia.

| Característica | Benefício |
|---|---|
| 🧩 **Multi-app** | Um repositório, N aplicações. Teste TuaAgenda, sua loja virtual, seu sistema interno — tudo no mesmo lugar |
| 📊 **4 níveis de severidade** | Smoke (1s) → Crítica → Completa → Full. Escolha o que rodar conforme o momento |
| 🖥️ **Dashboard interativo** | Botões, SSE em tempo real, atalhos de teclado. Parece um playground |
| 📄 **Relatório Word automático** | Screenshots embedadas, tabelas, capa, formatação profissional. Pronto para enviar ao cliente |
| 🔌 **100% configurável por JSON** | Zero código para configurar. Só JSON. Até sua avó consegue |
| 🌐 **.env + config.json** | Credenciais fora do git, ambiente separado da lógica |

<br>

## 🏗️ Arquitetura

```
📦 qa-framework/
│
├── 🚀 run.js                          # Entry point universal
├── 📦 package.json                    # Dependências (só 2: playwright + docx)
├── 🔒 .env.example                    # Template de ambiente
├── 📖 .gitignore                      # Segurança desde o início
│
├── ⚙️ core/                           # 🧠 MOTOR DO FRAMEWORK
│   ├── runner.js                       #   Orquestrador de testes
│   ├── helpers.js                      #   Funções utilitárias atômicas
│   ├── report.js                       #   Gerador de relatório Word
│   ├── report-bugs.js                  #   Gerador de relatório de bugs
│   ├── server.js                       #   Servidor HTTP do dashboard
│   └── dashboard.html                  #   Interface visual interativa
│
├── 📂 apps/                           # 📱 APLICAÇÕES SOB TESTE
│   └── tuaagenda/                      #   Exemplo: TuaAgenda
│       ├── 📜 config.json              #     Configuração da app
│       └── 🧪 tests/                   #     Módulos de teste
│           ├── smoke.js                #       🔴 Smoke
│           ├── auth.js                 #       🔴 Crítico
│           ├── users.js                #       🔴 Crítico
│           ├── scheduling.js           #       🟡 Completo
│           ├── financial.js            #       🟡 Completo
│           ├── security.js             #       🟢 Full
│           ├── performance.js          #       🟢 Full
│           └── ... (20 módulos)
│
├── 📸 screenshots/                    # 🖼️ EVIDÊNCIAS (gerado)
└── 📊 results.json                    # 📈 RESULTADOS (gerado)
```

### 🔄 Fluxo de Execução

```
run.js
  │
  ├─ 1. Lê .env (se existir)
  ├─ 2. Lê apps/<APP>/config.json
  ├─ 3. Mescla env + config → process.env.APP_CONFIG
  ├─ 4. Chama core/runner.js
  │
  └─ runner.js
       │
       ├─ 5. Carrega helpers.js
       ├─ 6. Escaneia tests/*.js
       ├─ 7. Filtra por nível (TEST_LEVEL)
       ├─ 8. Abre Chromium (headless ou não)
       ├─ 9. Executa cada módulo → cada teste
       │      ├─ ✅ Passou → log verde
       │      └─ ❌ Falhou → screenshot + log vermelho
       └─ 10. Salva results.json
```

<br>

## ⚡ Instalação

### Pré-requisitos

<table>
<tr>
  <td><img src="https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square&logo=nodedotjs&logoColor=white"></td>
  <td>Baixe em <a href="https://nodejs.org">nodejs.org</a></td>
</tr>
<tr>
  <td><img src="https://img.shields.io/badge/Google_Chrome-4285F4?style=flat-square&logo=googlechrome&logoColor=white"></td>
  <td>Chromium incluso via Playwright, mas Chrome próprio funciona melhor</td>
</tr>
<tr>
  <td><img src="https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white"></td>
  <td>Para clonar e contribuir</td>
</tr>
</table>

### Passo a passo

```bash
# 1. Clone com amor
git clone https://github.com/joelmideus-coder/automacao-tacontudo-qa.git
cd automacao-tacontudo-qa

# 2. Instale as dependências (leve — só 2 packages)
npm install

# 3. Instale o Chromium do Playwright
npx playwright install chromium

# 4. (Opcional) Configure o ambiente
cp .env.example .env
# Edite o .env com suas credenciais
```

> ⏱️ **Tempo total: ~2 minutos.** Sim, é rápido assim.

<br>

## 🎯 Como Usar

### ▶️ Comandos básicos

```bash
# Roda o app padrão (definido em APP ou .env)
npm test

# Especifica qual app testar
APP=tuaagenda npm test

# Modo invisível (sem abrir Chrome)
HEADLESS=true npm test

# Nível específico
TEST_LEVEL=full npm test
```

### 🎚️ Níveis de teste

Cada nível executa um conjunto progressivo de módulos. Você decide o quanto testar.

```bash
# 🔥 SMOKE — Só o essencial (segundos)
#  6 testes · Login, criar cliente, agendamento, cupom, relatório, logout
npm run smoke

# 🔴 CRÍTICO — Funcionalidades principais (~2 min)
#  45 testes · Auth, usuários, agendamentos, serviços, pagamentos
npm run critical

# 🟡 COMPLETO — Cobertura ampla (~5 min)
#  69 testes + financeiro, relatórios, profissionais, notificações
npm run complete

# 🟢 FULL — Tudo, including segurança e performance (~10 min)
#  100 testes + SQL injection, XSS, rate limiting, mobile, WebSocket
npm run full
```

### 🎮 Atalhos combinados

```bash
# Executar tudo + gerar relatório de regressão
HEADLESS=true TEST_LEVEL=full npm test && npm run report

# Executar + relatório de bugs
npm run full && npm run report:bugs

# Rodar crítico + abrir dashboard
npm run critical & npm run server
```

<br>

## 🖥️ Dashboard Interativo

O coração visual do framework. Um painel moderno com tema escuro, output em tempo real e atalhos de teclado.

```bash
npm run server
# Abra http://localhost:3456
```

### Funcionalidades

| Recurso | Descrição |
|---|---|
| 🧪 **Botões de teste** | Smoke, Crítico, Completo, Full — um clique |
| 📄 **Relatórios** | Gera Word direto do navegador |
| ⚙️ **Modo Headless** | Alterna com um toggle |
| 📟 **Console em tempo real** | SSE streaming com cores por severidade |
| ⌨️ **Atalhos de teclado** | `S` Smoke · `C` Crítico · `A` Completo · `F` Full · `R` Relatório · `B` Bugs |
| 🔄 **App selector** | Alterna entre apps sem reiniciar o servidor |
| ⏹️ **Kill button** | Interrompe execução em andamento |

### Preview do Console

```
╔══════════════════════════════════════════╗
║  QA Dashboard                           ║
║  Clique um botão para executar testes   ║
╚══════════════════════════════════════════╝

▶ Iniciando: critical (headless: true)

🔴 Crítica Módulo: Autenticação
  ▶ Login com sucesso... ✅ (3200ms)
  ▶ Login com senha inválida... ✅ (1500ms)
  ▶ Recuperar senha... ✅ (2800ms)

🔴 Crítica Módulo: Usuários
  ▶ Criar usuário... ✅ (4100ms)
  ▶ Editar usuário... ✅ (3500ms)
```

<br>

## 📄 Relatórios

### Relatório de Regressão (Word)

Gera um documento profissional com:
- **Capa** com nome da app, nível, data, resultado
- **Sumário executivo** com gráfico de pizza (passou/falhou)
- **Detalhamento por módulo** com resultados individuais
- **Screenshots embedadas** diretamente no documento
- **Tabela de resumo** ao final

```bash
npm run report
```

Arquivo gerado em: `~/Desktop/Caderno_Evidencias_<App>_<Data>.docx`

### Relatório de Bugs (Word)

```bash
npm run report:bugs
```

Arquivo gerado em: `~/Desktop/Relatorio_Bugs_<App>_<Data>.docx`

<br>

## 🧪 Adicionar uma Nova Aplicação

O framework foi feito para ser **extensível por configuração**. Você não precisa escrever código do framework — só os testes.

### 1. Crie a estrutura

```bash
mkdir -p apps/minha-app/tests
```

### 2. Configure

`apps/minha-app/config.json`:

```json
{
  "appName": "Minha App",
  "baseUrl": "https://minha-app.com",
  "locale": "pt-BR",
  "timezone": "America/Sao_Paulo",
  "credentials": {
    "email": "usuario@teste.com",
    "password": "minha-senha"
  },
  "selectors": {
    "email": "#email",
    "password": "#senha",
    "submit": "button[type=\"submit\"]"
  },
  "levels": {
    "smoke": 1,
    "critical": 2,
    "complete": 3,
    "full": 4
  }
}
```

### 3. Escreva os testes

`apps/minha-app/tests/login.js`:

```js
const CONFIG = JSON.parse(process.env.APP_CONFIG || '{}');
const CRED = CONFIG.credentials || {};

module.exports = {
  level: 'critical',
  category: 'Autenticação',
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

> 💡 **Dica:** Você pode ter quantas apps quiser. O seletor no dashboard as lista automaticamente.

<br>

## 📋 API de Helpers

Cada função de teste recebe `(page, h)` onde `h` é o objeto de helpers:

| Função | Descrição | Exemplo |
|---|---|---|
| `h.navigateAndWait(page, url, desc)` | Navega para URL com log | `h.navigateAndWait(page, h.BASE_URL + '/login', 'Login')` |
| `h.tryClick(page, texto)` | Clica no primeiro elemento com o texto | `h.tryClick(page, 'Salvar')` |
| `h.fillField(page, label, valor)` | Preenche campo por placeholder/label/name/id | `h.fillField(page, 'Email', 'teste@teste.com')` |
| `h.screenshot(page, pasta, nome)` | Captura screenshot completo | `h.screenshot(page, 'auth', '01-login')` |
| `h.tryNavigateTo(page, paths, desc)` | Tenta várias URLs até uma funcionar | `h.tryNavigateTo(page, ['/admin', '/dashboard'], 'Home')` |
| `h.sleep(ms)` | Aguarda (ms) | `h.sleep(2000)` |
| `h.runAllWithRetry(actions)` | Executa ações com retry automático | `h.runAllWithRetry([() => h.tryClick(...)])` |
| `h.BASE_URL` | URL base da aplicação | `const url = h.BASE_URL` |

### Estrutura do módulo de teste

| Propriedade | Tipo | Descrição |
|---|---|---|
| `level` | `string` | `'smoke'` \| `'critical'` \| `'complete'` \| `'full'` |
| `category` | `string` | Nome legível do módulo |
| `tests` | `Array` | Lista de `{ name, fn }` |

<br>

## 🌐 Variáveis de Ambiente

| Variável | Obrigatória | Padrão | Descrição |
|---|---|---|---|
| `APP` | ❌ | `tuaagenda` | Nome da pasta em `apps/` |
| `TEST_LEVEL` | ❌ | `critical` | Nível do teste |
| `HEADLESS` | ❌ | `true` | `true` = sem navegador visível |
| `BASE_URL` | ❌ | `config.json` | Sobrescreve URL do config |
| `EMAIL_TESTE` | ❌ | `config.json` | Sobrescreve email do config |
| `SENHA_TESTE` | ❌ | `config.json` | Sobrescreve senha do config |
| `APP_ENV` | ❌ | `dev` | Identificador do ambiente |

### Ordem de precedência

```
.env file  <  config.json  <  environment variables
(menor prioridade)              (maior prioridade)
```

Isso significa que variáveis de ambiente SEMPRE sobrescrevem o que está no `.env` ou `config.json`. Útil para CI/CD.

<br>

## 📊 Resultados e Evidências

Após executar os testes, a estrutura gerada é:

```
qa-framework/
│
├── 📸 screenshots/                     # Screenshots organizados por módulo
│   ├── smoke/
│   │   ├── 01-login.png
│   │   ├── 02-criar-cliente.png
│   │   └── ...
│   ├── auth/
│   │   ├── 01-login-sucesso.png
│   │   ├── 02-login-invalido.png
│   │   └── ...
│   └── ...
│
├── 📊 results.json                     # Resultados em JSON (máquina)
│
└── 🖥️ ~/Desktop/                       # Relatórios Word
    ├── Caderno_Evidencias_TuaAgenda_20260716.docx
    └── Relatorio_Bugs_TuaAgenda_15072026.docx
```

### Formato do results.json

```json
{
  "level": "full",
  "date": "2026-07-16T14:30:00.000Z",
  "config": { "appName": "TuaAgenda", "baseUrl": "https://..." },
  "modules": [
    {
      "category": "Autenticação",
      "level": "critical",
      "tests": [
        { "name": "Login com sucesso", "status": "passed", "elapsed": 3200 },
        { "name": "Login inválido", "status": "passed", "elapsed": 1500 }
      ]
    }
  ],
  "summary": { "passed": 98, "failed": 2, "skipped": 0, "total": 100 }
}
```

<br>

## 🔧 Comandos de Atalho

```bash
#                  Comando                           # O que faz
# ─────────────────────────────────────────────────────────────────
npm test                            # Testa app padrão (nível critical)
npm run smoke                       # Smoke test
npm run critical                    # Teste crítico
npm run complete                    # Teste completo
npm run full                        # Teste full
npm run report                      # Gera relatório Word de regressão
npm run report:bugs                 # Gera relatório Word de bugs
npm run server                      # Inicia dashboard interativo
npm run dashboard                   # Abre o dashboard no navegador
HEADLESS=true npm test              # Modo headless
APP=minha-app npm test              # Testa outra app
TEST_LEVEL=smoke npm test           # Nível específico
```

<br>

## 🧠 Boas Práticas

### Escrevendo testes robustos

```js
// ✅ BOM — usa helpers atômicos, screenshots, fallback
{
  name: 'Criar cliente',
  fn: async (page, h) => {
    await h.tryNavigateTo(page, ['/admin/clientes', '/clientes'], 'Clientes');
    await h.tryClick(page, 'Novo');
    await h.fillField(page, 'Nome', 'Cliente Teste');
    await h.tryClick(page, 'Salvar');
    await h.screenshot(page, 'clientes', '01-criado');
  }
}

// ❌ RUIM — sem fallback, sem screenshot, frágil
{
  name: 'Criar cliente',
  fn: async (page) => {
    await page.goto('https://app.com/admin/clientes');
    await page.click('button:has-text("Novo")');
    await page.fill('input[name="nome"]', 'Cliente Teste');
    await page.click('button:has-text("Salvar")');
  }
}
```

### Dicas de ouro

1. **Sempre tire screenshot** — é sua prova de que o teste passou
2. **Use `tryNavigateTo`** com fallback de URLs — apps mudam de rota
3. **Use `CRED` do config** — nunca hardcode credenciais
4. **Nomeie screenshots com prefixo numérico** — `01-login`, `02-criar` — a ordem importa no relatório
5. **Mantenha testes atômicos** — um teste = uma coisa
6. **Use o nível certo** — `smoke` para o que SEMPRE precisa funcionar, `full` para exploração

<br>

## 🤝 Como Contribuir

Este framework vive da comunidade. Toda contribuição é bem-vinda.

```bash
# 1. Faça um fork
# 2. Crie sua branch
git checkout -b feat/minha-melhoria

# 3. Commit com padrão semântico
git commit -m "feat: adiciona suporte a testes mobile"

# 4. Push
git push origin feat/minha-melhoria

# 5. Abra um Pull Request
```

### Guidelines

- ✨ **Novas features** — `feat: descrição`
- 🐛 **Bug fixes** — `fix: descrição`
- 📚 **Documentação** — `docs: descrição`
- 🎨 **Estilo/refactor** — `refactor: descrição`
- ⚡ **Performance** — `perf: descrição`

<br>

## 📝 Licença

Distribuído sob licença **MIT**. Veja `LICENSE` para mais informações.

---

<p align="center">
  <b>Feito com ❤️ pela equipe TudoContudo QA</b><br>
  <i>Qualidade não é um ato, é um hábito.</i>
  <br><br>
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&height=100&section=footer" alt="footer"/>
</p>
