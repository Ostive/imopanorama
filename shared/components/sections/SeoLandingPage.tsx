import Link from 'next/link'
import Image from 'next/image'
import { ArrowRightIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

interface SeoLandingPageProps {
  eyebrow: string
  title: string
  description: string
  image: string
  primaryHref: string
  primaryLabel: string
  secondaryHref?: string
  secondaryLabel?: string
  points: string[]
  sections: Array<{
    title: string
    text: string
  }>
}

export default function SeoLandingPage({
  eyebrow,
  title,
  description,
  image,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  points,
  sections,
}: SeoLandingPageProps) {
  return (
    <main className="bg-card">
      <section className="relative overflow-hidden bg-gray-950 text-white">
        <div className="absolute inset-0">
          <Image src={image} alt="" fill sizes="100vw" priority className="object-cover opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/85 to-gray-950/30" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold backdrop-blur">
              {eyebrow}
            </span>
            <h1 className="mt-5 text-4xl font-black leading-tight md:text-6xl">{title}</h1>
            <p className="mt-5 text-lg leading-relaxed text-gray-200">{description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={primaryHref} className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 font-bold text-white transition hover:bg-primary-700">
                {primaryLabel}
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              {secondaryHref && secondaryLabel && (
                <Link href={secondaryHref} className="inline-flex rounded-xl border border-white/25 px-6 py-3 font-bold text-white transition hover:bg-white/10">
                  {secondaryLabel}
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
        <aside className="rounded-2xl bg-gray-50 p-6 dark:bg-gray-800">
          <h2 className="text-2xl font-black text-foreground">À retenir</h2>
          <div className="mt-5 space-y-3">
            {points.map((point) => (
              <div key={point} className="flex items-start gap-3">
                <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-primary-600 dark:text-primary-400" />
                <p className="text-foreground">{point}</p>
              </div>
            ))}
          </div>
        </aside>

        <div className="grid gap-5 md:grid-cols-2">
          {sections.map((section) => (
            <article key={section.title} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm dark:border-border dark:bg-gray-800">
              <h2 className="text-xl font-black text-foreground">{section.title}</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{section.text}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
