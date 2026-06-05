interface ContactInfoItemProps {
  icon: React.ReactNode
  label: string
  content: React.ReactNode
  href?: string
  /** 'primary' | 'blue' | 'green' | 'purple' — default 'primary' */
  color?: string
  className?: string
}

const BG_MAP: Record<string, string> = {
  primary: 'bg-primary-100 group-hover:bg-primary-600 [&_svg]:text-primary-600 [&_svg]:group-hover:text-white',
  blue:    'bg-primary-100 group-hover:bg-primary-600 [&_svg]:text-primary-600 [&_svg]:group-hover:text-white',
  green:   'bg-green-100 group-hover:bg-green-600 [&_svg]:text-green-600 [&_svg]:group-hover:text-white',
  purple:  'bg-purple-100 group-hover:bg-purple-600 [&_svg]:text-purple-600 [&_svg]:group-hover:text-white',
}

export function ContactInfoItem({ icon, label, content, href, color = 'primary', className }: ContactInfoItemProps) {
  const iconClasses = `w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${BG_MAP[color] ?? BG_MAP.primary}`

  const inner = (
    <>
      <div className={iconClasses}>{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-xs text-gray-500 mb-0.5">{label}</div>
        <div className="font-semibold text-gray-900 dark:text-white truncate">{content}</div>
      </div>
    </>
  )

  const base = `flex items-start gap-3 p-3 rounded-xl transition-colors${className ? ` ${className}` : ''}`

  if (href) {
    return (
      <a href={href} className={`${base} hover:bg-gray-50 dark:hover:bg-gray-800 group`}>
        {inner}
      </a>
    )
  }

  return (
    <div className={`${base} group`}>
      {inner}
    </div>
  )
}
