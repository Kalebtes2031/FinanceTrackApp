import { StyleSheet, Text, View } from 'react-native';
import { theme } from '@/constants/theme';

interface EmptyStateProps {
  title: string;
  subtitle?: string;
}

export function EmptyState({ title, subtitle }: EmptyStateProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    backgroundColor: '#FFF8EF',
    gap: theme.spacing.xs,
  },
  title: {
    fontFamily: theme.fonts.heading,
    color: theme.colors.text,
    fontSize: 16,
  },
  subtitle: {
    fontFamily: theme.fonts.body,
    color: theme.colors.muted,
  },
});