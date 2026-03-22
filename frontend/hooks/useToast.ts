import { useToastStore } from '@/store/toastStore';

export function useToast() {
  return useToastStore((state) => state.show);
}
