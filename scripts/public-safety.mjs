import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();
const ignored = new Set(['.git', 'node_modules', 'dist', 'build', '.gradle', 'Pods', 'DerivedData']);
const binary = /\.(apk|aab|ipa|jar|aar|class|png|jpg|jpeg|gif|webp|zip|gz|pdf|woff2?|ttf|xcassets)$/i;
const findings = [];

function visit(directory) {
  for (const name of readdirSync(directory)) {
    if (ignored.has(name)) continue;
    const path = join(directory, name);
    const info = statSync(path);
    if (info.isDirectory()) { visit(path); continue; }
    if (binary.test(path) || info.size > 2_000_000) continue;
    const rel = relative(root, path).replaceAll('\\', '/');
    if (/^\.env(\.|$)/.test(name) && name !== '.env.example') findings.push(`${rel}: environment file must not be committed`);
    const content = readFileSync(path, 'utf8');
    if (/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/.test(content)) findings.push(`${rel}: private key marker`);
    if (/(?:api[_-]?key|client[_-]?secret|password|access[_-]?token)\s*[:=]\s*["'][^"']{8,}["']/i.test(content)) findings.push(`${rel}: credential-like assignment`);
    if (/https?:\/\/(?:10(?:\.\d{1,3}){3}|192\.168(?:\.\d{1,3}){2}|172\.(?:1[6-9]|2\d|3[01])(?:\.\d{1,3}){2})(?::\d+)?/i.test(content)) findings.push(`${rel}: private endpoint`);
  }
}

visit(root);
if (findings.length) {
  console.error('Public safety scan failed:\n' + findings.map(item => `- ${item}`).join('\n'));
  process.exit(1);
}
console.log('Public safety scan passed: no committed environment file, private key, credential assignment or private HTTP(S) endpoint found.');
