import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export function useBootstrap() {
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);
}