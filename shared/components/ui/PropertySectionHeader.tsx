import { CardDescription, CardTitle } from '@/shared/components/ui/card'

const COLOR_MAP: Record<string, string> = {
  primary: 'bg-primary-100 dark:bg-primary-900/30 [&_svg]:text-primary-600 dark:[&_svg]:text-primary-400',
  blue:    'bg-blue-100 dark:bg-blue-900/30 [&_svg]:text-blue-600 dark:[&_svg]:text-blue-400',
  green:   'bg-green-100 dark:bg-green-900/30 [&_svg]:text-green-600 dark:[&_svg]:text-green-400',
  purple:  'bg-purple-100 dark:bg-purple-900/30 [&_svg]:text-purple-600 dark:[&_svg]:text-purple-400',
  pink:    'bg-pink-100 dark:bg-pink-900/30 [&_svg]:text-pink-600 dark:[&_svg]:text-pink-400',
  amber:   'bg-amber-100 dark:bg-amber-900/30 [&_svg]:text-amber-600 dark:[&_svg]:text-amber-400',
  red:     'bg-red-100 dark:bg-red-900/30 [&_svg]:text-red-600 dark:[&_svg]:text-red-400',
  cyan:    'bg-cyan-100 dark:bg-cyan-900/30 [&_svg]:text-cyan-600 dark:[&_svg]:text-cyan-400',
  slate:   'bg-slate-100 dark:bg-slate-900/30 [&_svg]:text-slate-600 dark:[&_svg]:text-slate-400',
}

interface PropertySectionHeaderProps {
  icon: React.ReactNode
  title: string
  description?: string
  color?: string
  className?: string
}

export function PropertySectionHeader({ icon, title, description, color = 'primary', className }: PropertySectionHeaderProps) {
  const iconClasses = COLOR_MAP[color] ?? COLOR_MAP.primary

  return (
    <div className={`mb-6${className ? ` ${className}` : ''}`}>
      <div className="flex items-center gap-3 mb-2">
        <div className={`p-2 rounded-lg ${iconClasses}`}>
          {icon}
        </div>
        <CardTitle className="text-3xl">{title}</CardTitle>
      </div>
      {description && <CardDescription>{description}</CardDescription>}
    </div>
  )
}
