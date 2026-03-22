import { useState } from 'react';
import { Link } from 'expo-router';
import { Text, View } from 'react-native';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { useLogin } from '@/hooks/useAuth';
import { theme } from '@/constants/theme';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const loginMutation = useLogin();

  return (
    <Screen scroll={false}>
      <SectionHeader title="Welcome back" subtitle="Track your money across every account." />
      <Input label="Username" value={username} onChangeText={setUsername} placeholder="Your username" />
      <Input label="Password" value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry />
      {loginMutation.error ? (
        <Text style={{ color: theme.colors.danger }}>Login failed. Check your credentials.</Text>
      ) : null}
      <Button
        label={loginMutation.isPending ? 'Signing in...' : 'Sign in'}
        onPress={() => loginMutation.mutate({ username, password })}
        disabled={loginMutation.isPending}
      />
      <View>
        <Text style={{ color: theme.colors.muted }}>
          New here? <Link href="/(auth)/register" style={{ color: theme.colors.primary }}>Create an account</Link>
        </Text>
      </View>
    </Screen>
  );
}