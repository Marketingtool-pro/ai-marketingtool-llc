import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather } from '@expo/vector-icons';
import { Colors, Gradients, Spacing, BorderRadius } from '../../constants/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  icon?: string;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  fullWidth = false,
  style,
  textStyle,
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 8,
          paddingHorizontal: Spacing.md,
          fontSize: 14,
          iconSize: 16,
        };
      case 'large':
        return {
          paddingVertical: 18,
          paddingHorizontal: Spacing.xl,
          fontSize: 18,
          iconSize: 24,
        };
      default:
        return {
          paddingVertical: 14,
          paddingHorizontal: Spacing.lg,
          fontSize: 16,
          iconSize: 20,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  const renderContent = () => {
    const textColor = variant === 'outline' || variant === 'ghost' ? Colors.accent : Colors.white;

    return (
      <>
        {loading ? (
          <ActivityIndicator color={textColor} />
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <Feather
                name={icon as any}
                size={sizeStyles.iconSize}
                color={textColor}
                style={styles.iconLeft}
              />
            )}
            <Text
              style={[
                styles.text,
                { fontSize: sizeStyles.fontSize, color: textColor },
                textStyle,
              ]}
            >
              {title}
            </Text>
            {icon && iconPosition === 'right' && (
              <Feather
                name={icon as any}
                size={sizeStyles.iconSize}
                color={textColor}
                style={styles.iconRight}
              />
            )}
          </>
        )}
      </>
    );
  };

  if (variant === 'primary') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        style={[
          styles.button,
          fullWidth && styles.fullWidth,
          disabled && styles.disabled,
          style,
        ]}
      >
        <LinearGradient
          colors={disabled ? ['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.3)'] : Gradients.accent}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[
            styles.gradient,
            {
              paddingVertical: sizeStyles.paddingVertical,
              paddingHorizontal: sizeStyles.paddingHorizontal,
            },
          ]}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        variant === 'secondary' && styles.secondaryButton,
        variant === 'outline' && styles.outlineButton,
        variant === 'ghost' && styles.ghostButton,
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        {
          paddingVertical: sizeStyles.paddingVertical,
          paddingHorizontal: sizeStyles.paddingHorizontal,
        },
        style,
      ]}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  secondaryButton: {
    backgroundColor: Colors.surface,
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: '600',
  },
  iconLeft: {
    marginRight: Spacing.sm,
  },
  iconRight: {
    marginLeft: Spacing.sm,
  },
});

export default Button;
