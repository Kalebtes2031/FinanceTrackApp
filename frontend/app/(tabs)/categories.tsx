import { useState } from 'react';
import { Alert, FlatList, Pressable, Text, View } from 'react-native';
import { useCategories, useCategoryMutations } from '@/hooks/useCategories';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Input } from '@/components/Input';
import { OptionGroup } from '@/components/OptionGroup';
import { EmptyState } from '@/components/EmptyState';
import { Skeleton } from '@/components/Skeleton';
import { theme } from '@/constants/theme';

export default function CategoriesScreen() {
  const { data, isLoading, refetch, isRefetching } = useCategories();
  const { create, update, remove } = useCategoryMutations();

  const [name, setName] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState('');

  if (isLoading) {
    return (
      <Screen scroll={false}>
        <SectionHeader title="Categories" subtitle="Group your income and expenses." />
        <Card>
          <Skeleton height={16} width="60%" />
          <View style={{ height: 8 }} />
          <Skeleton height={14} width="40%" />
        </Card>
      </Screen>
    );
  }

  const income = (data ?? []).filter((cat) => cat.type === 'income');
  const expense = (data ?? []).filter((cat) => cat.type === 'expense');

  const handleCreate = async () => {
    if (!name.trim()) return;
    await create.mutateAsync({ name: name.trim(), type });
    setName('');
  };

  const handleEdit = (id: number, currentName: string) => {
    setEditingId(id);
    setEditingName(currentName);
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editingName.trim()) return;
    await update.mutateAsync({ id: editingId, payload: { name: editingName.trim() } });
    setEditingId(null);
    setEditingName('');
  };

  const handleDelete = (id: number) => {
    Alert.alert('Delete category', 'This will not delete existing transactions.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => remove.mutateAsync(id),
      },
    ]);
  };

  const renderCategory = (id: number, label: string, catType: 'income' | 'expense') => {
    const isEditing = editingId === id;
    return (
      <Card>
        {isEditing ? (
          <View style={{ gap: 8 }}>
            <Input label="Edit name" value={editingName} onChangeText={setEditingName} />
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Button label="Save" onPress={handleSaveEdit} />
              <Button label="Cancel" variant="ghost" onPress={() => { setEditingId(null); setEditingName(''); }} />
            </View>
          </View>
        ) : (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View>
              <Text style={{ fontFamily: theme.fonts.heading }}>{label}</Text>
              <Text style={{ color: theme.colors.muted }}>{catType}</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Pressable onPress={() => handleEdit(id, label)}>
                <Text style={{ color: theme.colors.primary }}>Edit</Text>
              </Pressable>
              <Pressable onPress={() => handleDelete(id)}>
                <Text style={{ color: theme.colors.danger }}>Delete</Text>
              </Pressable>
            </View>
          </View>
        )}
      </Card>
    );
  };

  return (
    <Screen scroll={true}>
      <SectionHeader title="Categories" subtitle="Group your income and expenses." />

      <Card>
        <Input label="New category" value={name} onChangeText={setName} placeholder="e.g. Salary, Food" />
        <View style={{ height: 8 }} />
        <OptionGroup
          label="Type"
          value={type}
          onChange={(value) => setType(value as 'income' | 'expense')}
          options={[
            { label: 'Income', value: 'income' },
            { label: 'Expense', value: 'expense' },
          ]}
        />
        <View style={{ height: 12 }} />
        <Button label={create.isPending ? 'Adding...' : 'Add category'} onPress={handleCreate} />
      </Card>

      <SectionHeader title="Income categories" />
      {income.length ? (
        <FlatList
          data={income}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => renderCategory(item.id, item.name, 'income')}
          contentContainerStyle={{ gap: 12 }}
          refreshing={isRefetching}
          onRefresh={refetch}
        />
      ) : (
        <EmptyState title="No income categories" subtitle="Add one above to get started." />
      )}

      <SectionHeader title="Expense categories" />
      {expense.length ? (
        <FlatList
          data={expense}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => renderCategory(item.id, item.name, 'expense')}
          contentContainerStyle={{ gap: 12, paddingBottom: 14 }}
          refreshing={isRefetching}
          onRefresh={refetch}
        />
      ) : (
        <EmptyState title="No expense categories" subtitle="Add one above to get started." />
      )}
    </Screen>
  );
}
