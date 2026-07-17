const {
  Document, Packer, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell,
  width, LevelFormat, HeadingLevel, AlignmentType, BorderStyle,
  convertInchesToTwip, pageBreak
} = require('docx');
const fs = require('fs');
const path = require('path');

const RESULTS_FILE = path.join(process.cwd(), 'results.json');
const SCREENSHOT_DIR = path.join(process.cwd(), 'screenshots');
const DESKTOP_DIR = path.join(require('os').homedir(), 'Desktop');
const CONFIG = JSON.parse(process.env.APP_CONFIG || '{}');
const CRED = CONFIG.credentials || {};

const LEVEL_LABELS = CONFIG.levelLabels || { smoke: '🔴 Smoke', critical: '🔴 Crítica', complete: '🟡 Completa', full: '🟢 Full' };

async function imageToBuffer(filePath) {
  try {
    return fs.readFileSync(filePath);
  } catch {
    return null;
  }
}

async function buildDocument() {
  const raw = fs.readFileSync(RESULTS_FILE, 'utf-8');
  const results = JSON.parse(raw);
  const { passed, failed, skipped, total } = results.summary;
  const dateStr = new Date(results.date).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

  const children = [];

  // ===== CAPA =====
  children.push(
    new Paragraph({ spacing: { before: 4000 } }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: CONFIG.appName || 'QA Framework', size: 52, bold: true, color: '2563EB' })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 600 },
      children: [new TextRun({ text: 'Suíte de Testes Regressivos', size: 36, color: '475569' })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [new TextRun({ text: `Nível: ${LEVEL_LABELS[results.level] || results.level}`, size: 28 })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [new TextRun({ text: `Data: ${dateStr}`, size: 22, color: '64748B' })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
      children: [new TextRun({ text: `URL: ${CONFIG.baseUrl || ''}`, size: 22, color: '64748B' })],
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [new TextRun({ text: `Usuário: ${CRED.email || ''}`, size: 22, color: '64748B' })],
    }),
    new Paragraph({ spacing: { before: 1000 } }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [
        new TextRun({ text: `Resultado: ${passed}/${total} testes aprovados`, size: 28, bold: true, color: failed > 0 ? 'DC2626' : '16A34A' }),
      ],
    }),
    new Paragraph({ children: [pageBreak] }),
  );

  // ===== SUMÁRIO EXECUTIVO =====
  children.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [new TextRun({ text: 'Sumário Executivo', bold: true })],
    }),
    new Paragraph({ spacing: { before: 200, after: 100 }, children: [new TextRun({ text: `Este documento contém o resultado da execução dos testes regressivos de nível ${LEVEL_LABELS[results.level] || results.level} na plataforma TuaAgenda.` })] }),
    new Paragraph({ spacing: { before: 200, after: 100 }, children: [new TextRun({ text: `Total de testes: ${total}` })] }),
    new Paragraph({ spacing: { before: 200, after: 100 }, children: [new TextRun({ text: `Aprovados: ${passed}`, bold: true, color: '16A34A' })] }),
    new Paragraph({ spacing: { before: 200, after: 100 }, children: [new TextRun({ text: `Falhos: ${failed}`, bold: true, color: failed > 0 ? 'DC2626' : '16A34A' })] }),
    new Paragraph({ spacing: { before: 200, after: 100 }, children: [new TextRun({ text: `Módulos testados: ${results.modules.length}` })] }),
    new Paragraph({ spacing: { before: 200, after: 400 }, children: [new TextRun({ text: `Data da execução: ${dateStr}` })] }),

    // Tabela de módulos
    new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun({ text: 'Resumo por Módulo', bold: true })] }),
    new Paragraph({ spacing: { before: 100, after: 200 } }),
  );

  const moduleRows = [
    new TableRow({
      tableHeader: true,
      children: ['Módulo', 'Nível', 'Testes', 'OK', 'Falhos'].map(h =>
        new TableCell({
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: h, bold: true, size: 20, color: 'FFFFFF' })],
          })],
          shading: { fill: '2563EB' },
        })
      ),
    }),
  ];

  for (const mod of results.modules) {
    const modPassed = mod.tests.filter(t => t.status === 'passed').length;
    const modFailed = mod.tests.filter(t => t.status === 'failed').length;
    const levelLabel = LEVEL_LABELS[mod.level] || mod.level;
    moduleRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: mod.category })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: levelLabel })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(mod.tests.length) })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(modPassed), color: '16A34A', bold: true })] })] }),
          new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: String(modFailed), color: modFailed > 0 ? 'DC2626' : '16A34A', bold: true })] })] }),
        ],
      })
    );
  }

  children.push(new Table({ rows: moduleRows }));
  children.push(new Paragraph({ children: [pageBreak] }));

  // ===== DETALHAMENTO DOS TESTES =====
  for (const mod of results.modules) {
    const levelLabel = LEVEL_LABELS[mod.level] || mod.level;
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400 },
        children: [new TextRun({ text: `${levelLabel} ${mod.category}`, bold: true })],
      })
    );

    for (let testIdx = 0; testIdx < mod.tests.length; testIdx++) {
      const test = mod.tests[testIdx];
      const isPass = test.status === 'passed';
      const statusIcon = isPass ? '✅' : '❌';
      const statusColor = isPass ? '16A34A' : 'DC2626';
      const elapsedStr = test.elapsed ? `${(test.elapsed / 1000).toFixed(1)}s` : '';

      children.push(
        new Paragraph({
          spacing: { before: 200, after: 50 },
          children: [
            new TextRun({ text: `${statusIcon} ${test.name}`, bold: true, size: 22 }),
            new TextRun({ text: `  [${elapsedStr}]`, size: 18, color: '64748B' }),
          ],
        })
      );

      if (!isPass && test.error) {
        children.push(
          new Paragraph({
            spacing: { before: 50, after: 100 },
            indent: { left: 400 },
            children: [new TextRun({ text: `Erro: ${test.error}`, size: 20, color: 'DC2626', italics: true })],
          })
        );
      }

      // Map category names to screenshot directories
      const categoryToDir = {
        'Smoke Test (Pré-Produção)': 'smoke',
        'Autenticação': 'auth',
        'Cadastro de Usuários': 'users',
        'Agenda': 'scheduling',
        'Serviços': 'services',
        'Profissionais': 'professionals',
        'Cupons de Desconto': 'coupons',
        'Financeiro': 'financial',
        'Relatórios': 'reports',
        'Notificações': 'notifications',
        'Pagamentos': 'payments',
        'Configurações': 'settings',
        'Permissões': 'permissions',
        'API': 'api',
        'Performance': 'performance',
        'Mobile (Android/iOS)': 'mobile',
        'Web (Cross-browser)': 'web',
        'Banco de Dados': 'database',
        'Segurança': 'security',
        'Integrações': 'integrations',
      };
      const modDir = categoryToDir[mod.category] || mod.category.toLowerCase().replace(/[^a-z0-9]/g, '');

      const modScreenshotDir = path.join(SCREENSHOT_DIR, modDir);
      let screenshotBuffer = null;

      if (fs.existsSync(modScreenshotDir)) {
        const files = fs.readdirSync(modScreenshotDir).filter(f => f.endsWith('.png')).sort();
        // Use test index to match corresponding screenshot
        if (testIdx < files.length) {
          screenshotBuffer = await imageToBuffer(path.join(modScreenshotDir, files[testIdx]));
        }
        // Fallback: use same index from end
        if (!screenshotBuffer && files.length > 0) {
          screenshotBuffer = await imageToBuffer(path.join(modScreenshotDir, files[Math.min(testIdx, files.length - 1)]));
        }
      }

      if (screenshotBuffer) {
        try {
          children.push(
            new Paragraph({
              spacing: { before: 50, after: 50 },
              alignment: AlignmentType.CENTER,
              children: [
                new ImageRun({
                  data: screenshotBuffer,
                  transformation: { width: 500, height: 280 },
                  type: 'png',
                }),
              ],
            })
          );
        } catch (e) {
          console.log(`  ⚠️  Erro ao adicionar screenshot de "${test.name}": ${e.message}`);
        }
      }

      children.push(new Paragraph({ spacing: { before: 50 }, children: [] }));
    }

    children.push(new Paragraph({ children: [pageBreak] }));
  }

  // ===== CONCLUSÃO =====
  children.push(
    new Paragraph({
      heading: HeadingLevel.HEADING_1,
      children: [new TextRun({ text: 'Conclusão', bold: true })],
    }),
    new Paragraph({
      spacing: { before: 200, after: 100 },
      children: [new TextRun({
        text: failed === 0
          ? `Todos os ${total} testes do nível ${LEVEL_LABELS[results.level]} foram executados com sucesso. Nenhuma falha foi encontrada durante a execução.`
          : `${failed} teste(s) falharam durante a execução. Revisar os screenshots de erro para diagnóstico.`,
      })],
    }),
    new Paragraph({
      spacing: { before: 200, after: 100 },
      children: [new TextRun({ text: `Nível executado: ${LEVEL_LABELS[results.level]}` })],
    }),
    new Paragraph({
      spacing: { before: 200, after: 100 },
      children: [new TextRun({ text: `Total de testes: ${total}` })],
    }),
    new Paragraph({
      spacing: { before: 200, after: 100 },
      children: [new TextRun({ text: `Taxa de aprovação: ${((passed / total) * 100).toFixed(1)}%`, bold: true })],
    }),
    new Paragraph({
      spacing: { before: 200, after: 100 },
      children: [new TextRun({ text: `Data: ${dateStr}` })],
    }),
  );

  return new Document({
    title: `TuaAgenda - Regressão ${LEVEL_LABELS[results.level] || results.level}`,
    description: 'Caderno de Evidências - Testes Regressivos TuaAgenda',
    styles: {
      default: {
        document: {
          run: { size: 22, font: 'Calibri' },
          paragraph: { spacing: { after: 100 } },
        },
      },
    },
    sections: [{ children }],
  });
}

async function main() {
  if (!fs.existsSync(RESULTS_FILE)) {
    console.error('❌ results.json não encontrado. Execute os testes primeiro.');
    console.log('   Use: npm test');
    process.exit(1);
  }

  console.log('📄 Gerando caderno de evidências...');
  const doc = await buildDocument();
  const buffer = await Packer.toBuffer(doc);

  const datePart = new Date().toISOString().split('T')[0].replace(/-/g, '');
  const fileName = `Caderno_Evidencias_TuaAgenda_Regressao_${datePart}.docx`;
  const outputPath = path.join(DESKTOP_DIR, fileName);

  fs.writeFileSync(outputPath, buffer);
  console.log(`\n✅ Documento gerado: ${outputPath}`);
  console.log(`   Tamanho: ${(buffer.length / 1024 / 1024).toFixed(1)} MB`);
}

main().catch(err => {
  console.error('\n❌ Erro ao gerar relatório:', err.message);
  process.exit(1);
});
