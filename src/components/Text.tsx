import { Text as RNText, TextProps as RNTextProps } from 'react-native'
import { cn } from '@utils/cn'

type Variant =
  | 'title-xl'   // Days One — splash, hero screens
  | 'title-lg'   // Days One — screen headings
  | 'title-md'   // Days One — section titles
  | 'body-lg'    // Instrument Sans Regular — large body
  | 'body'       // Instrument Sans Regular — default
  | 'body-sm'    // Instrument Sans Regular — captions
  | 'label'      // Instrument Sans SemiBold — labels, chips
  | 'button'     // Instrument Sans Bold — button text

interface TextProps extends RNTextProps {
  variant?: Variant
  className?: string
}

const variantClasses: Record<Variant, string> = {
  'title-xl': 'font-title text-5xl text-neutral-900',
  'title-lg': 'font-title text-4xl text-neutral-900',
  'title-md': 'font-title text-2xl text-neutral-900',
  'body-lg': 'font-sans text-lg text-neutral-700',
  'body': 'font-sans text-base text-neutral-700',
  'body-sm': 'font-sans text-sm text-neutral-500',
  'label': 'font-sans-semi text-sm text-neutral-800',
  'button': 'font-sans-bold text-base text-neutral-0',
}

export function Text({ variant = 'body', className, ...props }: TextProps) {
  return (
    <RNText
      className={cn(variantClasses[variant], className)}
      {...props}
    />
  )
}