import { describe, expect, it } from 'vitest';
import { coach, convertRule, normalisePairOrigin, parseFeed, riskObservations, runTerminal, safeHttpUrl } from '../src/core';
import { TERMINAL_EVENTS } from '../src/data';

describe('public content boundaries', () => {
  it('accepts safe feed links and rejects executable schemes', () => {
    expect(safeHttpUrl('https://www.cisa.gov/news')).toBe('https://www.cisa.gov/news');
    expect(safeHttpUrl('javascript:alert(1)')).toBe('');
    expect(safeHttpUrl('data:text/html,payload')).toBe('');
  });

  it('parses RSS as inert text', () => {
    const xml = '<rss><channel><item><title>Alert &amp; update</title><link>https://example.org/a</link><description><![CDATA[<b>Patch</b> now]]></description><pubDate>Mon</pubDate></item></channel></rss>';
    expect(parseFeed(xml, 'Test')).toEqual([expect.objectContaining({ title:'Alert & update', link:'https://example.org/a', summary:'Patch now' })]);
  });
});

describe('pairing policy', () => {
  it('requires HTTPS except explicit loopback development', () => {
    expect(normalisePairOrigin('https://lab.example/path')).toBe('https://lab.example');
    expect(normalisePairOrigin('http://127.0.0.1:8080')).toBe('http://127.0.0.1:8080');
    expect(() => normalisePairOrigin('http://lab.example')).toThrow(/requires HTTPS/);
  });

  it('does not embed a default endpoint', () => {
    expect(normalisePairOrigin('')).toBe('');
  });
});

describe('bounded analyst workbench', () => {
  it('hunts packaged beacon evidence', () => {
    const result = runTerminal('hunt beacon', TERMINAL_EVENTS);
    expect(result).toContain('198.51.100.42');
    expect(result).toContain('powershell');
  });

  it('does not execute arbitrary commands', () => {
    expect(runTerminal('rm -rf /', TERMINAL_EVENTS)).toBe('Unknown command: rm. Run help.');
    expect(runTerminal('whoami', TERMINAL_EVENTS)).toBe('Unknown command: whoami. Run help.');
  });

  it('converts only a simple rule mapping and labels it a draft', () => {
    const result = convertRule('title: Test\ndetection:\n  selection:\n    Image: powershell.exe\n  condition: selection', 'kql');
    expect(result.query).toContain('Image == "powershell.exe"');
    expect(result.warning).toMatch(/Teaching translation only/);
  });
});

describe('learning integrity', () => {
  it('grounds coaching in the measured local state', () => {
    const answer = coach('How should I prioritise a CVE?', { completed:2, kevCount:40, online:false });
    expect(answer).toContain('2 lab outcome(s)');
    expect(answer).toContain('40 cached KEV');
    expect(answer).toMatch(/Do not equate a CVE/);
  });

  it('keeps observations distinct from vulnerability claims', () => {
    const rows = riskObservations({ online:true, connectionType:'wifi', completed:1, total:4 });
    expect(rows[0]?.detail).toMatch(/not a security or exposure verdict/);
    expect(JSON.stringify(rows)).not.toMatch(/device is vulnerable/i);
  });
});
