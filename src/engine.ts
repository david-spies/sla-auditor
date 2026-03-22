🤖 File 5: src/engine.ts (The Interceptor Logic)
TypeScript

import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { Anthropic } from '@anthropic-ai/sdk';

export class SLAEngine {
  private rules: any;
  private client: Anthropic;

  constructor() {
    this.rules = yaml.load(fs.readFileSync('./.sla/rules.yaml', 'utf8'));
    this.client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }

  async runAudit(content: string, filePath: string, fix: boolean = false) {
    for (const rule of this.rules.constraints) {
      const regex = new RegExp(rule.pattern, 'g');
      if (regex.test(content)) {
        console.log(`❌ Violation: ${rule.name}`);
        if (fix) return await this.autoFix(content, rule, filePath);
        return { passed: false, rule };
      }
    }
    return { passed: true };
  }

  private async autoFix(content: string, rule: any, filePath: string) {
    const response = await this.client.messages.create({
      model: "claude-3-5-sonnet-20240620",
      max_tokens: 4000,
      messages: [{ 
        role: "user", 
        content: `Refactor this code in ${filePath} to meet this requirement: ${rule.requirement}\n\nCode:\n${content}` 
      }],
    });
    const fixedCode = response.content[0].text;
    fs.writeFileSync(filePath, fixedCode);
    console.log(`✅ Auto-fixed ${filePath}`);
  }
}
