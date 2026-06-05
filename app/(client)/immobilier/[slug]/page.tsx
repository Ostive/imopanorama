import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRightIcon, CheckCircleIcon, MapPinIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { getMadagascarCitySeo, MADAGASCAR_CITY_SEO } from '@/shared/data/madagascarSeo';

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return MADAGASCAR_CITY_SEO.map((city) => ({ slug: city.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const city = getMadagascarCitySeo(slug);
  if (!city) return {};

  return {
    title: `${city.headline} | Acheter, louer, investir`,
    description: city.description,
    alternates: {
      canonical: `/immobilier/${city.slug}`,
    },
  };
}

export default async function MadagascarCityPage({ params }: PageProps) {
  const { slug } = await params;
  const city = getMadagascarCitySeo(slug);

  if (!city) notFound();

  return (
    <main className="bg-card">
      <section className="relative overflow-hidden bg-gray-950 text-white">
        <div className="absolute inset-0">
          <img src={city.image} alt="" className="h-full w-full object-cover opacity-35" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950 via-gray-950/90 to-gray-950/40" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold backdrop-blur">
              <MapPinIcon className="h-4 w-4" />
              {city.region}, Madagascar
            </span>
            <h1 className="mt-5 text-4xl font-black leading-tight md:text-6xl">{city.headline}</h1>
            <p className="mt-5 text-lg leading-relaxed text-gray-200">{city.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={city.searchHref} className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3 font-bold text-white transition hover:bg-primary-700">
                Voir les biens a {city.city}
                <ArrowRightIcon className="h-4 w-4" />
              </Link>
              <Link href="/vendre" className="inline-flex rounded-xl border border-white/25 px-6 py-3 font-bold text-white transition hover:bg-white/10">
                Vendre dans cette ville
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <aside className="rounded-2xl bg-gray-50 p-6 dark:bg-gray-800">
          <h2 className="text-2xl font-black text-foreground">Quartiers a suivre</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {city.districts.map((district) => (
              <Link
                key={district}
                href={`/proprietes?country=MG&city=${encodeURIComponent(city.city)}&search=${encodeURIComponent(district)}`}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary-400 hover:text-primary-600"
              >
                {district}
              </Link>
            ))}
          </div>

          <div className="mt-8 rounded-xl border border-primary-100 bg-primary-50 p-5 dark:border-primary-900 dark:bg-primary-950/30">
            <div className="flex items-center gap-2">
              <ShieldCheckIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              <h3 className="font-black text-foreground">Verification juridique</h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Pour Madagascar, demandez les preuves de propriete, le statut foncier, le bornage et la coherence entre vendeur, terrain et documents avant toute avance.
            </p>
          </div>
        </aside>

        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-black text-foreground">Pourquoi chercher a {city.city} ?</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {city.opportunities.map((item) => (
                <article key={item} className="rounded-xl border border-border bg-card p-5 shadow-sm">
                  <CheckCircleIcon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item}</p>
                </article>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-black text-foreground">Checklist avant visite</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {city.checklist.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-xl bg-gray-50 p-4 dark:bg-gray-800">
                  <CheckCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                  <p className="text-sm font-medium text-foreground">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
