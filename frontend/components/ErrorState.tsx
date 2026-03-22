import { StyleSheet, Text, View } from 'react-native';
import { theme } from '@/constants/theme';

interface ErrorStateProps {
  message: string;
}

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
    borderRadius: theme.radius.md,
    backgroundColor: '#FEEBE6',
    borderWidth: 1,
    borderColor: '#F5C7B8',
    gap: theme.spacing.xs,
  },
  title: {
    fontFamily: theme.fonts.heading,
    color: theme.colors.danger,
    fontSize: 16,
  },
  message: {
    fontFamily: theme.fonts.body,
    color: theme.colors.text,
  },
});