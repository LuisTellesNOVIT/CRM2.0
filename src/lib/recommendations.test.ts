import { describe, expect, it } from 'vitest';
import { generateRecommendations } from './recommendations';
import { OPPORTUNITIES } from '@/data/mock';
import type { Opportunity } from '@/types';

const TODAY = new Date('2026-04-26T10:00:00');

describe('generateRecommendations', () => {
  it('flags signing contracts as high priority', () => {
    const recs = generateRecommendations(OPPORTUNITIES, TODAY);
    const sign = recs.find((r) => r.id === 'r-sign');
    expect(sign).toBeDefined();
    expect(sign?.priority).toBe('alta');
    expect(sign?.target.view).toBe('kanban');
  });

  it('flags stalled proposals (>=7d since last interaction)', () => {
    const recs = generateRecommendations(OPPORTUNITIES, TODAY);
    // o10 has last = D(11), stalled
    const stalled = recs.find((r) => r.id === 'r-prop-o10');
    expect(stalled).toBeDefined();
    expect(stalled?.priority).toBe('alta');
    expect(stalled?.target).toEqual({ view: 'opp', id: 'o10' });
  });

  it('does not flag fresh proposals', () => {
    const recs = generateRecommendations(OPPORTUNITIES, TODAY);
    // o12 has last = D(4), fresh
    expect(recs.find((r) => r.id === 'r-prop-o12')).toBeUndefined();
  });

  it('emits cross-sell with the highest-LTV won client', () => {
    const recs = generateRecommendations(OPPORTUNITIES, TODAY);
    const cross = recs.find((r) => r.id === 'r-cross');
    expect(cross).toBeDefined();
    // Highest won LTV in seed is SANNA (c2): setup 85k + monthly 14.5k * 36 = 607k
    expect(cross?.target).toEqual({ view: 'clients', id: 'c2' });
  });

  it('flags pipeline concentration when top client exceeds S/200K', () => {
    const recs = generateRecommendations(OPPORTUNITIES, TODAY);
    const exec = recs.find((r) => r.id === 'r-exec');
    expect(exec).toBeDefined();
    expect(exec?.priority).toBe('alta');
  });

  it('returns empty array when no opportunities', () => {
    expect(generateRecommendations([], TODAY)).toEqual([]);
  });

  it('skips lost-learning when fewer than 2 lost', () => {
    const oneLost: Opportunity[] = OPPORTUNITIES.filter((o) => o.status === 'lost').slice(0, 1);
    const recs = generateRecommendations(oneLost, TODAY);
    expect(recs.find((r) => r.id === 'r-lost')).toBeUndefined();
  });

  it('sorts by priority (alta before media before baja)', () => {
    const recs = generateRecommendations(OPPORTUNITIES, TODAY);
    const order = { alta: 0, media: 1, baja: 2 } as const;
    for (let i = 1; i < recs.length; i++) {
      expect(order[recs[i].priority]).toBeGreaterThanOrEqual(order[recs[i - 1].priority]);
    }
  });
});
