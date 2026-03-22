import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createCategory, deleteCategory, fetchCategories, updateCategory } from '@/api/categories';
import { useToast } from '@/hooks/useToast';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
  });
}

export function useCategoryMutations() {
  const queryClient = useQueryClient();
  const toast = useToast();

  const create = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      toast('Category added', 'success');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: () => toast('Failed to add category', 'error'),
  });

  const update = useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<{ name: string; type: string }> }) =>
      updateCategory(id, payload),
    onSuccess: () => {
      toast('Category updated', 'success');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: () => toast('Failed to update category', 'error'),
  });

  const remove = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      toast('Category deleted', 'success');
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: () => toast('Failed to delete category', 'error'),
  });

  return { create, update, remove };
}
