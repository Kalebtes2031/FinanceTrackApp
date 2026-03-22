import { StyleSheet, View } from 'react-native';
import { theme } from '@/constants/theme';

interface SkeletonProps {
  height?: number;
  width?: number | string;
  radius?: number;
}

export function Skeleton({ height = 14, width = '100%', radius = 8 }: SkeletonProps) {
  return <View style={[styles.base, { height, width, borderRadius: radius }]} />;
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: '#E8E2D9',
  },
});
