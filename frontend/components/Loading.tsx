import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { theme } from '@/constants/theme';

export function Loading() {
  return (
    <View style={styles.container}>
      <ActivityIndicator color={theme.colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
});