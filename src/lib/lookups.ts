import { CLIENTS, STATUSES, USERS } from '@/data/mock';
import { useOpportunitiesStore } from '@/stores/useOpportunitiesStore';
import type { Client, Status, StatusId, User } from '@/types';

export function findClient(id: string): Client | undefined {
  const known = CLIENTS.find((c) => c.id === id);
  if (known) return known;
  return useOpportunitiesStore.getState().sheetClients.find((c) => c.id === id);
}

export function findUser(id: string): User | undefined {
  return USERS.find((u) => u.id === id);
}

export function findStatus(id: StatusId): Status | undefined {
  return STATUSES.find((s) => s.id === id);
}
