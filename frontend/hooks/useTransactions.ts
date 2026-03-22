import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createTransaction, deleteTransaction, fetchTransactions, updateTransaction } from '@/api/transactions';
import { useToast } from '@/hooks/useToast';

export function useTransactions() {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: fetchTransactions,
  });
}

export function useTransactionMutations() {
  const queryClient = useQueryClient();
  const toast = useToast();

  const create = useMutation({
    mutationFn: createTransaction,
    onMutate: async (newTx) => {
      await queryClient.cancelQueries({ queryKey: ['transactions'] });
      const previous = queryClient.getQueryData(['transactions']);
      queryClient.setQueryData(['transactions'], (old: any) => [
        ...(old ?? []),
        {
          id: Date.now(),
          account: newTx.account,
          to_account: newTx.to_account ?? null,
          amount: newTx.amount,
          type: newTx.type,
          category: newTx.category ?? null,
          description: newTx.description ?? '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['transactions'], context.previous);
      }
    },
    onSuccess: () => {
      toast('Transaction saved', 'success');
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: () => toast('Failed to save transaction', 'error'),
  });

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Record<string, unknown> }) =>
      updateTransaction(id, payload),
    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: ['transactions'] });
      const previous = queryClient.getQueryData(['transactions']);
      queryClient.setQueryData(['transactions'], (old: any) =>
        (old ?? []).map((item: any) => (item.id === id ? { ...item, ...payload } : item))
      );
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['transactions'], context.previous);
      }
    },
    onSuccess: () => {
      toast('Transaction updated', 'success');
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: () => toast('Failed to update transaction', 'error'),
  });

  const remove = useMutation({
    mutationFn: deleteTransaction,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['transactions'] });
      const previous = queryClient.getQueryData(['transactions']);
      queryClient.setQueryData(['transactions'], (old: any) => (old ?? []).filter((item: any) => item.id !== id));
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(['transactions'], context.previous);
      }
    },
    onSuccess: () => {
      toast('Transaction deleted', 'success');
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
    onError: () => toast('Failed to delete transaction', 'error'),
  });

  return { create, update, remove };
}
