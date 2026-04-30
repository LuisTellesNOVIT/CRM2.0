import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { USERS } from '@/data/mock';
import type { User } from '@/types';

interface AuthState {
  currentUser: User | null;
  login: (email: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: null,
      login: (email) => {
        const match = USERS.find((u) => u.email.toLowerCase() === email.toLowerCase());
        const user = match ?? USERS[0];
        set({ currentUser: user });
        return true;
      },
      logout: () => set({ currentUser: null }),
    }),
    { name: 'crm:auth' },
  ),
);
