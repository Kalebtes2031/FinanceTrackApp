import { useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, Text, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { Input } from '@/components/Input';
import { OptionGroup } from '@/components/OptionGroup';
import { Button } from '@/components/Button';
import { useTransactions, useTransactionMutations } from '@/hooks/useTransactions';
import { useAccounts } from '@/hooks/useAccounts';
import { useCategories, useCategoryMutations } from '@/hooks/useCategories';
import { TransactionType } from '@/api/types';
import { theme } from '@/constants/theme';

function TransactionForm() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const editingId = id ? Number(id) : null;
  const { data: transactions } = useTransactions();
  const { create, update, remove } = useTransactionMutations();
  const { data: accounts } = useAccounts();
  const { data: categories } = useCategories();
  const { create: createCategory } = useCategoryMutations();

  const existing = useMemo(
    () => transactions?.find((tx) => tx.id === editingId),
    [transactions, editingId]
  );

  const [type, setType] = useState<TransactionType>(existing?.type ?? 'expense');
  const [accountId, setAccountId] = useState(String(existing?.account ?? accounts?.[0]?.id ?? ''));
  const [toAccountId, setToAccountId] = useState(String(existing?.to_account ?? ''));
  const [amount, setAmount] = useState(existing?.amount ?? '');
  const [fee, setFee] = useState(existing?.fee ?? '0');
  const [categoryId, setCategoryId] = useState(String(existing?.category ?? ''));
  const [description, setDescription] = useState(existing?.description ?? '');
  const [newCategoryName, setNewCategoryName] = useState('');

  useEffect(() => {
    if (!existing) return;
    setType(existing.type);
    setAccountId(String(existing.account));
    setToAccountId(existing.to_account ? String(existing.to_account) : '');
    setAmount(existing.amount);
    setFee(existing.fee);
    setCategoryId(existing.category ? String(existing.category) : '');
    setDescription(existing.description ?? '');
  }, [existing]);

  const handleSave = async () => {
    if (!accountId || !amount) return;

    const payload = {
      account: Number(accountId),
      to_account: type === 'transfer' ? Number(toAccountId) : undefined,
      amount,
      fee,
      type,
      category: type === 'transfer' ? undefined : categoryId ? Number(categoryId) : null,
      description,
    };

    if (editingId) {
      await update.mutateAsync({ id: editingId, payload });
    } else {
      await create.mutateAsync(payload);
    }

    router.back();
  };

  const handleDelete = () => {
    if (!editingId) return;
    Alert.alert('Delete transaction', 'This will reverse its balance impact.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await remove.mutateAsync(editingId);
          router.back();
        },
      },
    ]);
  };

  return (
    <Screen>
      <SectionHeader title={editingId ? 'Edit transaction' : 'New transaction'} subtitle="Track income, expense, or transfers." />
      <OptionGroup
        label="Type"
        value={type}
        onChange={(value) => setType(value as TransactionType)}
        options={[
          { label: 'Income', value: 'income' },
          { label: 'Expense', value: 'expense' },
          { label: 'Transfer', value: 'transfer' },
        ]}
      />
      {accounts?.length ? (
        <OptionGroup
          label="From account"
          value={accountId}
          onChange={setAccountId}
          options={accounts.map((account) => ({
            label: account.name,
            value: String(account.id),
          }))}
        />
      ) : (
        <Text style={{ color: theme.colors.muted }}>Create an account first to add transactions.</Text>
      )}
      {type === 'transfer' ? (
        <OptionGroup
          label="To account"
          value={toAccountId}
          onChange={setToAccountId}
          options={(accounts ?? [])
            .filter((account) => String(account.id) !== accountId)
            .map((account) => ({
              label: account.name,
              value: String(account.id),
            }))}
        />
      ) : null}
      {type !== 'transfer' ? (
        <OptionGroup
          label="Category"
          value={categoryId}
          onChange={setCategoryId}
          options={(categories ?? []).map((category) => ({
            label: category.name,
            value: String(category.id),
          }))}
        />
      ) : null}
      {type !== 'transfer' ? (
        <View style={{ gap: 8 }}>
          <Input
            label="Quick add category"
            value={newCategoryName}
            onChangeText={setNewCategoryName}
            placeholder="e.g. Food, Rent"
          />
          <Button
            label={createCategory.isPending ? 'Adding...' : 'Add category'}
            onPress={async () => {
              if (!newCategoryName.trim()) return;
              await createCategory.mutateAsync({
                name: newCategoryName.trim(),
                type: type === 'income' ? 'income' : 'expense',
              });
              setNewCategoryName('');
            }}
            disabled={createCategory.isPending}
          />
        </View>
      ) : null}
      <Input label="Amount" value={amount} onChangeText={setAmount} placeholder="0" keyboardType="numeric" />
      <Input label="Fee" value={fee} onChangeText={setFee} placeholder="0" keyboardType="numeric" />
      <Input label="Description" value={description} onChangeText={setDescription} placeholder="Optional notes" />
      <Button
        label={editingId ? 'Save changes' : 'Add transaction'}
        onPress={handleSave}
        disabled={!accountId || !amount}
      />
      {editingId ? <Button label="Delete transaction" variant="danger" onPress={handleDelete} /> : null}
    </Screen>
  );
}

export default function TransactionFormScreen() {
  return (
    <View style={{ flex: 1 }}>
      <TransactionForm />
    </View>
  );
}
