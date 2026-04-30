import type { Opportunity } from '@/types';

export const calc = {
  amount12: (o: Opportunity) => (o.monthly || 0) * 12,
  amount24: (o: Opportunity) => (o.monthly || 0) * 24,
  amount36: (o: Opportunity) => (o.monthly || 0) * 36,
  ltv36: (o: Opportunity) => (o.setup || 0) + (o.monthly || 0) * 36,
  pipelineValue: (o: Opportunity) => (o.setup || 0) + (o.monthly || 0) * 12,
};
