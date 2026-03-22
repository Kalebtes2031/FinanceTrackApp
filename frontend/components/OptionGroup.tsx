import { StyleSheet, Text, View } from 'react-native';
import { theme } from '@/constants/theme';

interface OptionGroupProps {
  label: string;
  options: Array<{ label: string; value: string }>;
  value: string;
  onChange: (value: string) => void;
}

export function OptionGroup({ label, options, value, onChange }: OptionGroupProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.options}>
        {options.map((option) => {
          const isActive = option.value === value;
          return (
            <Text
              key={option.value}
              onPress={() => onChange(option.value)}
              style={[styles.option, isActive && styles.optionActive]}
            >
              {option.label}
            </Text>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.xs,
  },
  label: {
    fontFamily: theme.fonts.heading,
    color: theme.colors.text,
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  option: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: theme.colors.border,
    color: theme.colors.text,
    fontFamily: theme.fonts.body,
    backgroundColor: '#FFFFFF',
  },
  optionActive: {
    borderColor: theme.colors.primary,
    backgroundColor: '#E6F1ED',
    color: theme.colors.primaryDark,
  },
});