import { useMemo, useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { Text, View } from 'react-native';
import { AxiosError } from 'axios';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { useRegister } from '@/hooks/useAuth';
import { theme } from '@/constants/theme';

export default function RegisterScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const registerMutation = useRegister();
  const backendError = useMemo(() => {
    const error = registerMutation.error as AxiosError | null;
    const data = error?.response?.data;
    if (!data) return null;
    if (typeof data === 'string') return data;
    try {
      return JSON.stringify(data);
    } catch {
      return 'Registration failed.';
    }
  }, [registerMutation.error]);

  const handleRegister = async () => {
    if (!username || !password) {
      setFormError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    setFormError(null);
    await registerMutation.mutateAsync({ username, password, re_password: confirmPassword });
    router.replace('/(auth)/login');
  };

  return (
    <Screen scroll={false}>
      <SectionHeader title="Create your account" subtitle="Start building your financial dashboard." />
      <Input label="Username" value={username} onChangeText={setUsername} placeholder="Pick a username" />
      <Input label="Password" value={password} onChangeText={setPassword} placeholder="Create a password" secureTextEntry />
      <Input
        label="Confirm password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Repeat your password"
        secureTextEntry
      />
      {formError ? <Text style={{ color: theme.colors.danger }}>{formError}</Text> : null}
      {backendError ? <Text style={{ color: theme.colors.danger }}>{backendError}</Text> : null}
      <Button
        label={registerMutation.isPending ? 'Creating...' : 'Create account'}
        onPress={handleRegister}
        disabled={registerMutation.isPending}
      />
      <View>
        <Text style={{ color: theme.colors.muted }}>
          Already have an account? <Link href="/(auth)/login" style={{ color: theme.colors.primary }}>Sign in</Link>
        </Text>
      </View>
    </Screen>
  );
}
