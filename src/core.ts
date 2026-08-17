import { Capacitor, CapacitorHttp } from '@capacitor/core';
import type { FeedItem, KevItem, LabResult, TerminalEvent } from './types';

const PREFIX = 'prometheus_ot_mobile:';
const KEV_URL = 'https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json';

export function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) as T : fallback;
  } catch {
    return fallback;
  }
}

export function writeJson<T>(key: string, value: T): void {
  localStorage.setItem(PREFIX + key, JSON.stringify(value));
}

export function labResults(): LabResult[] {
  return readJson<LabResult[]>('lab-results', []);
}

export function saveLabResult(result: LabResult): void {
  const remaining = labResults().filter(item => item.labId !== result.labId);
  writeJson('lab-results', [...remaining, result]);
}

async function requestText(url: string): Promise<string> {
  const parsed = new URL(url);
  if (parsed.protocol !== 'https:') throw new Error('Remote sources must use HTTPS.');
  if (Capacitor.isNativePlatform()) {
    const response = await CapacitorHttp.get({ url, connectTimeout: 10_000, readTimeout: 15_000 });
    if (response.status < 200 || response.status >= 300) throw new Error(`Source returned HTTP ${response.status}.`);
    return typeof response.data === 'string' ? response.data : JSON.stringify(response.data);
  }
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), 15_000);
  try {
    const response = await fetch(url, { signal: controller.signal, headers: { Accept: 'application/json, application/rss+xml, application/atom+xml, application/xml, text/xml' } });
    if (!response.ok) throw new Error(`Source returned HTTP ${response.status}.`);
    return await response.text();
  } finally {
    window.clearTimeout(timer);
  }
}

export interface CachedResult<T> {
  items: T[];
  fetchedAt: string;
  cached: boolean;
  warning?: string;
}

export async function loadKev(force = false): Promise<CachedResult<KevItem>> {
  const cached = readJson<{ items: KevItem[]; fetchedAt: string } | null>('kev', null);
  const stillFresh = cached && Date.now() - new Date(cached.fetchedAt).getTime() < 6 * 60 * 60 * 1000;
  if (!force && stillFresh) return { ...cached, cached: true };
  try {
    const body = await requestText(KEV_URL);
    const parsed = JSON.parse(body) as { vulnerabilities?: unknown };
    if (!Array.isArray(parsed.vulnerabilities)) throw new Error('CISA response did not contain a vulnerability list.');
    const items = parsed.vulnerabilities.filter(isKev).slice(0, 250);
    const value = { items, fetchedAt: new Date().toISOString() };
    writeJson('kev', value);
    return { ...value, cached: false };
  } catch (error) {
    if (cached) return { ...cached, cached: true, warning: `Refresh failed; showing offline cache. ${errorMessage(error)}` };
    throw error;
  }
}

function isKev(value: unknown): value is KevItem {
  if (!value || typeof value !== 'object') return false;
  const row = value as Record<string, unknown>;
  return ['cveID','vendorProject','product','vulnerabilityName','dateAdded','dueDate','requiredAction','knownRansomwareCampaignUse']
    .every(key => typeof row[key] === 'string');
}

export async function loadFeed(source: { id: string; name: string; url: string }, force = false): Promise<CachedResult<FeedItem>> {
  const cacheKey = `feed:${source.id}`;
  const cached = readJson<{ items: FeedItem[]; fetchedAt: string } | null>(cacheKey, null);
  const stillFresh = cached && Date.now() - new Date(cached.fetchedAt).getTime() < 60 * 60 * 1000;
  if (!force && stillFresh) return { ...cached, cached: true };
  try {
    const xml = await requestText(source.url);
    const items = parseFeed(xml, source.name).slice(0, 30);
    if (!items.length) throw new Error('No valid entries were found.');
    const value = { items, fetchedAt: new Date().toISOString() };
    writeJson(cacheKey, value);
    return { ...value, cached: false };
  } catch (error) {
    if (cached) return { ...cached, cached: true, warning: `Refresh failed; showing offline cache. ${errorMessage(error)}` };
    throw error;
  }
}

export function parseFeed(xml: string, source: string): FeedItem[] {
  if (typeof DOMParser === 'undefined') return parseFeedPortable(xml, source);
  const doc = new DOMParser().parseFromString(xml, 'application/xml');
  if (doc.querySelector('parsererror')) return [];
  const nodes = [...doc.querySelectorAll('item, entry')];
  return nodes.map((node, index) => {
    const title = text(node, 'title').slice(0, 240);
    const summary = stripMarkup(text(node, 'description, summary, content')).slice(0, 500);
    const linkNode = node.querySelector('link');
    const candidate = linkNode?.getAttribute('href') || linkNode?.textContent || '';
    const link = safeHttpUrl(candidate);
    const published = text(node, 'pubDate, published, updated');
    return { id: `${source}-${index}-${title}`, title, link, published, source, summary };
  }).filter(item => item.title && item.link);
}

function parseFeedPortable(xml: string, source: string): FeedItem[] {
  const blocks = xml.match(/<(item|entry)\b[\s\S]*?<\/\1>/gi) ?? [];
  return blocks.map((block, index) => {
    const pick = (names: string) => {
      for (const name of names.split('|')) {
        const match = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)<\\/${name}>`, 'i'));
        if (match?.[1]) return stripMarkup(match[1]);
      }
      return '';
    };
    const href = block.match(/<link[^>]+href=["']([^"']+)["']/i)?.[1] || pick('link');
    const title = pick('title').slice(0, 240);
    return { id:`${source}-${index}-${title}`, title, link:safeHttpUrl(href), published:pick('pubDate|published|updated'), source, summary:pick('description|summary|content').slice(0,500) };
  }).filter(item => item.title && item.link);
}

function text(parent: Element, selector: string): string {
  return parent.querySelector(selector)?.textContent?.trim() ?? '';
}

function stripMarkup(value: string): string {
  return value.replace(/<!\[CDATA\[|\]\]>/g, '').replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();
}

export function safeHttpUrl(value: string): string {
  try {
    const parsed = new URL(value.trim());
    return parsed.protocol === 'https:' || parsed.protocol === 'http:' ? parsed.toString() : '';
  } catch {
    return '';
  }
}

export function normalisePairOrigin(value: string): string {
  if (!value.trim()) return '';
  const parsed = new URL(value.trim());
  const loopback = parsed.hostname === '127.0.0.1' || parsed.hostname === 'localhost' || parsed.hostname === '::1';
  if (parsed.protocol !== 'https:' && !(parsed.protocol === 'http:' && loopback)) {
    throw new Error('Pairing requires HTTPS. HTTP is allowed only for local USB development.');
  }
  parsed.pathname = '';
  parsed.search = '';
  parsed.hash = '';
  return parsed.toString().replace(/\/$/, '');
}

export function coach(prompt: string, context: { completed: number; kevCount: number; online: boolean }): string {
  const clean = prompt.trim().toLowerCase();
  if (!clean) return 'State the decision or concept you are working on. I will help you form a hypothesis, identify evidence, consider alternatives, and define proof.';
  const grounding = `Context: ${context.completed} lab outcome(s) demonstrated; ${context.kevCount} cached KEV record(s); network ${context.online ? 'available' : 'offline'}.`;
  if (/cve|vulnerab|kev/.test(clean)) return `${grounding}\n\nDo not equate a CVE or KEV entry with local exposure. Establish asset/version presence, reachability, exploitation evidence, business consequence, compensating controls and remediation ownership. Your proof should cite the evidence that changed the priority.`;
  if (/ot|ics|plc|scada|modbus|safety/.test(clean)) return `${grounding}\n\nSeparate cyber state from physical process state. Identify the process consequence, operational authority, safe-state prerequisite and reversible containment. The model or analyst may recommend; operations retains authority for process-affecting action.`;
  if (/ai|llm|agent|prompt|model|rag/.test(clean)) return `${grounding}\n\nMap data, model, retrieval and tool trust boundaries. Treat model input and output as untrusted, enforce identity and policy outside the model, constrain agency, and require inspectable evidence for consequential claims.`;
  if (/intel|cti|rfi|pir|threat/.test(clean)) return `${grounding}\n\nStart with the decision. Define a PIR and measurable EEIs, collect from graded sources, distinguish observation from assessment, state alternatives and confidence, then plan dissemination and feedback.`;
  if (/detect|sigma|rule|hunt|soc/.test(clean)) return `${grounding}\n\nWrite the behaviour and required telemetry before the query. Test against positive and negative evidence, document false-positive conditions and verify the rule produces an operationally useful investigation path.`;
  return `${grounding}\n\nUse the analyst loop: decision → hypothesis → cited evidence → credible alternative → confidence → safe action → measurable proof. Choose one lab or learning module where you can produce an inspectable artifact rather than only reading.`;
}

export function runTerminal(command: string, events: TerminalEvent[]): string {
  const parts = command.trim().split(/\s+/);
  const op = (parts.shift() ?? '').toLowerCase();
  if (!op || op === 'help') return 'Commands:\n  help\n  events [severity|source|protocol=value]\n  count [field]\n  top <field>\n  timeline\n  hunt beacon|ot-write|critical\n  show <1-based-row>\n  clear\n\nThis interpreter reads only packaged synthetic evidence. It is not a phone shell.';
  if (op === 'clear') return '__CLEAR__';
  if (op === 'timeline') return events.slice().sort((a,b) => a.ts.localeCompare(b.ts)).map(formatEvent).join('\n');
  if (op === 'show') {
    const index = Number(parts[0]) - 1;
    return Number.isInteger(index) && events[index] ? JSON.stringify(events[index], null, 2) : 'Row not found.';
  }
  if (op === 'hunt') {
    const target = (parts[0] ?? '').toLowerCase();
    const selected = target === 'beacon' ? events.filter(e => /periodic|powershell|malware/i.test(e.note))
      : target === 'ot-write' ? events.filter(e => e.protocol === 'modbus' || /setpoint/i.test(e.note))
      : target === 'critical' ? events.filter(e => e.severity === 'critical') : [];
    return selected.length ? selected.map(formatEvent).join('\n') : 'Use: hunt beacon|ot-write|critical';
  }
  if (op === 'events') {
    let selected = events;
    if (parts[0]?.includes('=')) {
      const [field, value] = parts[0].toLowerCase().split('=');
      if (['severity','source','protocol','host','peer'].includes(field ?? '')) selected = events.filter(row => String(row[field as keyof TerminalEvent]).toLowerCase() === value);
    }
    return selected.map(formatEvent).join('\n');
  }
  if (op === 'count' || op === 'top') {
    const field = (parts[0] ?? 'severity') as keyof TerminalEvent;
    if (!['severity','source','protocol','host','peer','action'].includes(field)) return 'Countable fields: severity, source, protocol, host, peer, action';
    const counts = new Map<string, number>();
    events.forEach(row => counts.set(String(row[field]), (counts.get(String(row[field])) ?? 0) + 1));
    return [...counts.entries()].sort((a,b) => b[1]-a[1]).map(([key,value]) => `${key.padEnd(18)} ${value}`).join('\n');
  }
  return `Unknown command: ${op}. Run help.`;
}

function formatEvent(event: TerminalEvent, index?: number): string {
  const prefix = index === undefined ? '' : `${index + 1}. `;
  return `${prefix}${event.ts} ${event.severity.toUpperCase().padEnd(8)} ${event.source.padEnd(9)} ${event.host} -> ${event.peer} ${event.protocol}/${event.action} | ${event.note}`;
}

export type RuleTarget = 'splunk' | 'kql' | 'elastic';

export function convertRule(source: string, target: RuleTarget): { query: string; warning: string } {
  const title = source.match(/^title:\s*(.+)$/mi)?.[1]?.trim() ?? 'Untitled rule';
  const fields = [...source.matchAll(/^\s{4,}([A-Za-z0-9_.-]+):\s*['"]?([^'"\n]+)['"]?\s*$/gm)]
    .filter(match => !['condition'].includes(match[1]?.toLowerCase() ?? ''))
    .slice(0, 12)
    .map(match => [match[1] ?? '', match[2]?.trim() ?? ''] as const);
  if (!fields.length) throw new Error('No bounded key/value selection was found. Use a simple Sigma selection block.');
  const quote = (value: string) => `"${value.replace(/["\\]/g, '\\$&')}"`;
  let query: string;
  if (target === 'splunk') query = `index=* ${fields.map(([key,value]) => `${key}=${quote(value)}`).join(' ')} | table _time host ${fields.map(([key]) => key).join(' ')}`;
  else if (target === 'kql') query = `SecurityEvent\n| where ${fields.map(([key,value]) => `${key} == ${quote(value)}`).join(' and ')}\n| project TimeGenerated, Computer, ${fields.map(([key]) => key).join(', ')}`;
  else query = fields.map(([key,value]) => `${key}:${quote(value)}`).join(' AND ');
  return { query: `/* ${title} */\n${query}`, warning: 'Teaching translation only. Validate field mappings, escaping, data availability and expected positives in the target platform before operational use.' };
}

export function riskObservations(input: { online: boolean; connectionType: string; kev?: CachedResult<KevItem>; completed: number; total: number }): Array<{ level: string; title: string; detail: string; action: string }> {
  const rows = [];
  rows.push({ level: input.online ? 'observed' : 'attention', title: input.online ? `${input.connectionType} network available` : 'No validated network', detail: 'This is transport visibility, not a security or exposure verdict.', action: input.online ? 'Use the evidence feeds, then validate any relevance locally.' : 'Offline labs, cached intelligence and the local coach remain available.' });
  if (input.kev) rows.push({ level: input.kev.warning ? 'attention' : 'observed', title: `${input.kev.items.length} KEV records cached`, detail: `Intelligence last fetched ${new Date(input.kev.fetchedAt).toLocaleString()}. Presence in KEV does not prove this device is affected.`, action: input.kev.warning ? 'Refresh when a trusted connection is available.' : 'Prioritise only after asset and exposure validation.' });
  const gap = input.total - input.completed;
  rows.push({ level: gap ? 'learning' : 'observed', title: gap ? `${gap} practice outcomes remain` : 'All packaged labs demonstrated', detail: `${input.completed} of ${input.total} local lab outcomes have recorded evidence.`, action: gap ? 'Complete the next lab and record a reflection.' : 'Repeat scenarios with alternative hypotheses or connect to the full assessment engine.' });
  return rows;
}

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Unknown error';
}
