import { ReactNode } from 'react';
import { ScrollView, StyleSheet, RefreshControlProps,View } from 'react-native';
import { theme } from '@/constants/theme';

interface ScreenProps {
  children: ReactNode;
  padded?: boolean;
  scroll?: boolean;
  refreshControl?: React.ReactElement<RefreshControlProps>
}

export function Screen({ children, padded = true, scroll = true, refreshControl }: ScreenProps) {
  if (scroll) {
    return (
      <ScrollView
        contentContainerStyle={[styles.container, padded && styles.padded]}
        refreshControl={refreshControl}
      >
        <View style={styles.backgroundAccent} />
        <View style={styles.backgroundAccentSecondary} />
        {children}
      </ScrollView>
    );
  }

  return (
    <View style={[styles.container, padded && styles.padded]}>
      <View style={styles.backgroundAccent} />
      <View style={styles.backgroundAccentSecondary} />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: theme.colors.background,
  },
  padded: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  backgroundAccent: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: '#F0E8D9',
    top: -60,
    right: -80,
  },
  backgroundAccentSecondary: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#F7E6C3',
    bottom: -80,
    left: -40,
  },
});
