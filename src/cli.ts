💻 File 6: src/cli.ts (The Entry Point)
TypeScript

import { Command } from 'commander';
import { SLAEngine } from './engine';
import chalk from 'chalk';

const program = new Command();
const engine = new SLAEngine();

program
  .command('audit')
  .option('-f, --file <path>', 'File to audit')
  .option('--fix', 'Automatically fix violations')
  .action(async (options) => {
    const content = fs.readFileSync(options.file, 'utf8');
    const result = await engine.runAudit(content, options.file, options.fix);
    
    if (result && !result.passed) {
      console.log(chalk.red(`Audit failed for ${options.file}`));
      process.exit(1);
    }
    console.log(chalk.green('Audit passed!'));
  });

program.parse();
