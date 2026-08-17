import { describe, expect, it } from 'vitest';
import { FEEDS, LABS, MODULES } from '../src/data';
import { FAQS, GUIDES } from '../src/guides';

describe('learning content contract', () => {
  it('gives every lab a measurable outcome, evidence and rationale', () => {
    expect(LABS.length).toBeGreaterThanOrEqual(4);
    LABS.forEach(lab => {
      expect(lab.outcome.length).toBeGreaterThan(30);
      expect(lab.evidence.length).toBeGreaterThanOrEqual(3);
      expect(lab.options[lab.answer]).toBeTruthy();
      expect(lab.rationale.length).toBeGreaterThan(40);
    });
  });

  it('fuses traditional and AI/OT paths without losing proof', () => {
    expect(new Set(MODULES.map(item => item.pathway))).toEqual(new Set(['Traditional','AI & Convergence']));
    expect(MODULES.some(item => item.id === 'ot-ai-convergence')).toBe(true);
    MODULES.forEach(module => {
      expect(module.objective).toBeTruthy();
      expect(module.practice).toBeTruthy();
      expect(module.proof).toBeTruthy();
    });
  });

  it('uses direct HTTPS feeds only', () => {
    FEEDS.forEach(feed => expect(feed.url.startsWith('https://')).toBe(true));
  });

  it('ships usable how-to guides and FAQ answers', () => {
    expect(GUIDES.length).toBeGreaterThanOrEqual(10);
    GUIDES.forEach(guide => {
      expect(guide.outcome).toBeTruthy();
      expect(guide.steps.length).toBeGreaterThanOrEqual(4);
    });
    expect(FAQS.length).toBeGreaterThanOrEqual(10);
    FAQS.forEach(item => expect(item.answer.length).toBeGreaterThan(40));
  });
});
