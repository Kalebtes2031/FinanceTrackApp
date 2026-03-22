import { useEffect } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { theme } from '@/constants/theme';
import { useToastStore } from '@/store/toastStore';

export function Toast() {
  const { message, type, clear } = useToastStore();
  const opacity = new Animated.Value(0);
  const translateY = new Animated.Value(-20);

  useEffect(() => {
    if (!message) return;

    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 180, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 180, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: -20, duration: 180, useNativeDriver: true }),
      ]).start(() => clear());
    }, 2200);

    return () => clearTimeout(timer);
  }, [message, clear, opacity, translateY]);

  if (!message) return null;

  const background =
    type === 'success' ? '#E3F4EA' : type === 'error' ? '#FBE6E0' : '#E7EEF8';
  const textColor =
    type === 'success' ? theme.colors.success : type === 'error' ? theme.colors.danger : theme.colors.text;

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View style={[styles.toast, { backgroundColor: background, opacity, transform: [{ translateY }] }]}
      >
        <Text style={[styles.text, { color: textColor }]}>{message}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 20,
  },
  toast: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E1D9CC',
    minWidth: '60%',
    alignItems: 'center',
  },
  text: {
    fontFamily: theme.fonts.body,
  },
});
