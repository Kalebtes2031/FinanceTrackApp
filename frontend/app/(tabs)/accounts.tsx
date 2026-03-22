import { useRouter } from 'expo-router';
import { FlatList, Pressable, RefreshControl, View } from 'react-native';
import { useAccounts } from '@/hooks/useAccounts';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { Button } from '@/components/Button';
import { AccountCard } from '@/components/AccountCard';
import { EmptyState } from '@/components/EmptyState';
import { Card } from '@/components/Card';
import { Skeleton } from '@/components/Skeleton';

export default function AccountsScreen() {
  const router = useRouter();
  const { data, isLoading, refetch, isRefetching } = useAccounts();

  if (isLoading) {
    return (
      <Screen>
        <SectionHeader title="Accounts" subtitle="Manage bank, mobile money, and cash accounts." />
        <Card>
          <Skeleton height={16} width="60%" />
          <View style={{ height: 8 }} />
          <Skeleton height={20} width="40%" />
        </Card>
      </Screen>
    );
  }

  return (
    <Screen scroll={false}>
      <SectionHeader title="Accounts" subtitle="Manage bank, mobile money, and cash accounts." />
      <Button label="Add account" onPress={() => router.push('/accounts/new')} />
      {data && data.length > 0 ? (
        <FlatList
          data={data}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <View style={{ marginBottom: 12 }}>
              <Pressable onPress={() => router.push(`/accounts/${item.id}`)}>
                <AccountCard name={item.name} type={item.type} balance={item.balance} currency={item.currency} />
              </Pressable>
            </View>
          )}
          contentContainerStyle={{ paddingVertical: 12 }}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} />}
        />
      ) : (
        <EmptyState title="No accounts" subtitle="Add your first account to get started." />
      )}
    </Screen>
  );
}
