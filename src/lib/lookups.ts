import { CLIENTS, STATUSES, USERS } from '@/data/mock';
import type { Client, Status, StatusId, User } from '@/types';

export function findClient(id: string): Client | undefined {
  return CLIENTS.find((c) => c.id === id);
}

export function findUser(id: string): User | undefined {
  return USERS.find((u) => u.id === id);
}

export function findStatus(id: StatusId): Status | undefined {
  return STATUSES.find((s) => s.id === id);
}
