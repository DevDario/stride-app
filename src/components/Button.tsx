import { ActivityIndicator, Pressable, PressableProps,View } from 'react-native'
import { Text } from '@components/Text'
import { cn } from '@utils/cn'
import { LucideIcon } from 'lucide-react-native'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'

interface ButtonProps extends Omit<PressableProps, 'style'> {
  title: string
  variant?: Variant
  icon?: LucideIcon
  loading?: boolean
  disabled?: boolean
  className?: string
}


const containerVariants: Record<Variant, string> = {
  primary: 'bg-primary-500 rounded-2xl px-6 py-4',
  secondary: 'bg-neutral-100 rounded-2xl px-6 py-4',
  ghost: 'bg-transparent rounded-2xl px-6 py-4 border border-neutral-200',
  danger: 'bg-error rounded-2xl px-6 py-4',
}

const titleVariants: Record<Variant, string> = {
  primary: 'flex items-center text-neutral-0 text-center',
  secondary: 'flex items-center text-neutral-800 text-center',
  ghost: 'flex items-center text-neutral-700 text-center',
  danger: 'flex items-center text-neutral-0 text-center',
}


export function Button({
  title,
  variant = 'primary',
  loading = false,
  icon: Icon,
  disabled = false,
  className,
  onPress,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      className={cn(
        containerVariants[variant],
        isDisabled && 'opacity-50',
        className,
      )}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' || variant === 'danger' ? '#ffffff' : '#2D9B7F'}
        />
      ) : (
        <View className="flex items-center gap-1">
            {Icon ? (
              <View className={cn('flex-row items-center gap-2', title ? 'mt-1' : '')}>
            <Icon
              size={20}
              className={cn(
                variant === 'primary' || variant === 'danger' ? 'text-neutral-0' : 'text-primary-500'
              )}
              strokeWidth={2}
                />
                <Text variant="button" className={titleVariants[variant]}>
                  {title}
                </Text>
                </View>
            ) : (
                <Text variant="button" className={titleVariants[variant]}>
                  {title}
                </Text>
          )}
        </View>

      )}
    </Pressable>
  )
}