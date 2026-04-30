import { beforeEach, describe, expect, it } from 'vitest';
import { useOpportunitiesStore } from './useOpportunitiesStore';

describe('useOpportunitiesStore', () => {
  beforeEach(() => {
    useOpportunitiesStore.getState().reset();
  });

  it('setStatus moves an opportunity between statuses and updates `last`', () => {
    const before = useOpportunitiesStore
      .getState()
      .opportunities.find((o) => o.id === 'o19')!;
    expect(before.status).toBe('lead');
    const beforeLast = before.last;

    useOpportunitiesStore.getState().setStatus('o19', 'contacted');
    const after = useOpportunitiesStore
      .getState()
      .opportunities.find((o) => o.id === 'o19')!;
    expect(after.status).toBe('contacted');
    expect(after.last).not.toBe(beforeLast);
  });

  it('setStatus is a no-op for unknown ids', () => {
    const before = useOpportunitiesStore.getState().opportunities;
    useOpportunitiesStore.getState().setStatus('does-not-exist', 'won');
    const after = useOpportunitiesStore.getState().opportunities;
    expect(after).toHaveLength(before.length);
  });

  it('update merges a partial patch', () => {
    useOpportunitiesStore.getState().update('o1', { notes: 'updated' });
    const o = useOpportunitiesStore
      .getState()
      .opportunities.find((x) => x.id === 'o1')!;
    expect(o.notes).toBe('updated');
  });
});
