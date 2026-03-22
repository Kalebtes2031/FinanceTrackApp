import { useEffect, useMemo, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Alert, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { Input } from '@/components/Input';
import { OptionGroup } from '@/components/OptionGroup';
import { Button } from '@/components/Button';
import { useAccountMutations, useAccounts } from '@/hooks/useAccounts';
import { AccountType } from '@/api/types';

function AccountForm() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const editingId = id ? Number(id) : null;
  const { data: accounts } = useAccounts();
  const { create, update, remove } = useAccountMutations();

  const existing = useMemo(
    () => accounts?.find((account) => account.id === editingId),
    [accounts, editingId]
  );

  const [name, setName] = useState(existing?.name ?? '');
  const [type, setType] = useState<AccountType>(existing?.type ?? 'bank');
  const [currency, setCurrency] = useState(existing?.currency ?? 'ETB');
  const [balance, setBalance] = useState(existing?.balance ?? '0');

  useEffect(() => {
    if (!existing) return;
    setName(existing.name);
    setType(existing.type);
    setCurrency(existing.currency);
    setBalance(existing.balance);
  }, [existing]);

  const handleSave = async () => {
    if (!name) return;
    if (editingId) {
      await update.mutateAsync({ id: editingId, payload: { name, type, currency } });
    } else {
      await create.mutateAsync({ name, type, currency, balance });
    }
    router.back();
  };

  const handleDelete = () => {
    if (!editingId) return;
    Alert.alert('Delete account', 'This will remove the account and related transactions.', [
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
      <SectionHeader
        title={editingId ? 'Edit account' : 'New account'}
        subtitle="Bank, mobile money, or cash."
      />
      <Input label="Name" value={name} onChangeText={setName} placeholder="CBE, Telebirr" />
      <OptionGroup
        label="Type"
        value={type}
        onChange={(value) => setType(value as AccountType)}
        options={[
          { label: 'Bank', value: 'bank' },
          { label: 'Mobile money', value: 'mobile_money' },
          { label: 'Cash', value: 'cash' },
        ]}
      />
      <Input label="Currency" value={currency} onChangeText={setCurrency} placeholder="ETB" />
      {!editingId ? (
        <Input
          label="Starting balance"
          value={balance}
          onChangeText={setBalance}
          placeholder="0"
          keyboardType="numeric"
        />
      ) : null}
      <Button label={editingId ? 'Save changes' : 'Create account'} onPress={handleSave} />
      {editingId ? <Button label="Delete account" variant="danger" onPress={handleDelete} /> : null}
    </Screen>
  );
}

export default function AccountFormScreen() {
  return (
    <View style={{ flex: 1 }}>
      <AccountForm />
    </View>
  );
}
