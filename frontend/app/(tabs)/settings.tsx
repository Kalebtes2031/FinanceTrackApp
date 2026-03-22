import { Alert, Text, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { useProfile } from '@/hooks/useProfile';
import { useLogout } from '@/hooks/useAuth';
import { Skeleton } from '@/components/Skeleton';
import { theme } from '@/constants/theme';

export default function SettingsScreen() {
  const { data: profile, isLoading } = useProfile();
  const logout = useLogout();

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log out', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <Screen>
      <SectionHeader title="Settings" subtitle="Manage your profile and security." />
      <Card>
        {isLoading ? (
          <View style={{ gap: 8 }}>
            <Skeleton height={18} width="60%" />
            <Skeleton height={14} width="80%" />
          </View>
        ) : (
          <View style={{ gap: 6 }}>
            <Text style={{ fontFamily: theme.fonts.heading, fontSize: 16 }}>{profile?.username}</Text>
            <Text style={{ fontFamily: theme.fonts.body, color: theme.colors.muted }}>{profile?.email || 'No email set'}</Text>
          </View>
        )}
      </Card>
      <Button label="Log out" variant="danger" onPress={handleLogout} />
    </Screen>
  );
}
