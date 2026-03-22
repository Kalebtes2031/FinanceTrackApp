import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createAccount, deleteAccount, fetchAccounts, updateAccount } from '@/api/accounts';
import { useToast } from '@/hooks/useToast';

export function useAccounts() {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: fetchAccounts,
  });
}

export function useAccountMutations() {
  const queryClient = useQueryClient();
  const toast = useToast();

  const create = useMutation({
    mutationFn: createAccount,
    onMutate: async (newAccount) => {
      await queryClient.cancelQueries({ queryKey: ['accounts'] });
      const previous = queryClient.getQueryData(['accounts']);
      queryClient.setQueryData(['accounts'], (old: any) => [
        ...(old ?? []),
        {
          id: Date.now(),
          name: newAccount.name,
          type: newAccount.type,
          balance: newAccount.balance,
          currency: newAccount.currency,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['accounts'], context.previous);
      }
    },
    onSuccess: () => {
      toast('Account created', 'success');
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
    onError: () => toast('Failed to create account', 'error'),
  });

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: { name: string; type: string; currency: string } }) =>
      updateAccount(id, payload),
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: ['accounts'] });
      const previous = queryClient.getQueryData(['accounts']);
      queryClient.setQueryData(['accounts'], (old: any) =>
        (old ?? []).map((item: any) => (item.id === id ? { ...item, ...payload } : item))
      );
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['accounts'], context.previous);
      }
    },
    onSuccess: () => {
      toast('Account updated', 'success');
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
    onError: () => toast('Failed to update account', 'error'),
  });

  const remove = useMutation({
    mutationFn: deleteAccount,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['accounts'] });
      const previous = queryClient.getQueryData(['accounts']);
      queryClient.setQueryData(['accounts'], (old: any) => (old ?? []).filter((item: any) => item.id !== id));
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['accounts'], context.previous);
      }
    },
    onSuccess: () => {
      toast('Account archived', 'success');
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
    },
    onError: () => toast('Unable to archive account', 'error'),
  });

  return { create, update, remove };
}
