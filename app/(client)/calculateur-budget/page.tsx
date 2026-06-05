'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { BanknotesIcon, CalculatorIcon, HomeIcon } from '@heroicons/react/24/outline'
import { Input } from '@/shared/components/ui/input'
import { formatPrice } from '@/shared/utils'

export default function BudgetCalculatorPage() {
  const [price, setPrice] = useState('400000000')
  const [downPayment, setDownPayment] = useState('80000000')
  const [rate, setRate] = useState('7')
  const [years, setYears] = useState('15')
  const [fees, setFees] = useState('8')

  const result = useMemo(() => {
    const propertyPrice = Number(price) || 0
    const contribution = Number(downPayment) || 0
    const annualRate = (Number(rate) || 0) / 100
    const durationYears = Number(years) || 1
    const feeRate = (Number(fees) || 0) / 100
    const loanAmount = Math.max(propertyPrice - contribution, 0)
    const months = durationYears * 12
    const monthlyRate = annualRate / 12
    const monthlyPayment = monthlyRate > 0
      ? loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
      : loanAmount / months

    return {
      loanAmount,
      monthlyPayment,
      totalInterest: monthlyPayment * months - loanAmount,
      estimatedFees: propertyPrice * feeRate,
      totalProject: propertyPrice + propertyPrice * feeRate,
    }
  }, [price, downPayment, rate, years, fees])

  return (
    <main className="bg-background">
      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-4 py-1.5 text-sm font-bold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
            <CalculatorIcon className="h-4 w-4" />
            Calculateur budget
          </span>
          <h1 className="mt-5 text-4xl font-black leading-tight text-foreground md:text-6xl">
            Estimez votre budget avant de visiter
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">
            Ce simulateur donne un premier ordre d'idée. Les frais, taux et conditions réelles dépendent de votre dossier et des partenaires financiers.
          </p>
          <Link href="/proprietes" className="mt-8 inline-flex rounded-xl bg-primary-600 px-6 py-3 font-bold text-white hover:bg-primary-700">
            Voir les biens disponibles
          </Link>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl dark:border-border dark:bg-gray-800">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Prix du bien">
              <Input type="number" value={price} onChange={(event) => setPrice(event.target.value)} className="h-12 rounded-xl" />
            </Field>
            <Field label="Apport personnel">
              <Input type="number" value={downPayment} onChange={(event) => setDownPayment(event.target.value)} className="h-12 rounded-xl" />
            </Field>
            <Field label="Taux annuel (%)">
              <Input type="number" value={rate} onChange={(event) => setRate(event.target.value)} className="h-12 rounded-xl" />
            </Field>
            <Field label="Durée (années)">
              <Input type="number" value={years} onChange={(event) => setYears(event.target.value)} className="h-12 rounded-xl" />
            </Field>
            <Field label="Frais estimés (%)">
              <Input type="number" value={fees} onChange={(event) => setFees(event.target.value)} className="h-12 rounded-xl" />
            </Field>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <ResultCard icon={<BanknotesIcon className="h-6 w-6" />} label="Montant à financer" value={formatPrice(result.loanAmount, 'MGA', 'MG')} />
            <ResultCard icon={<HomeIcon className="h-6 w-6" />} label="Mensualité estimée" value={formatPrice(result.monthlyPayment, 'MGA', 'MG')} highlight />
            <ResultCard label="Intérêts estimés" value={formatPrice(result.totalInterest, 'MGA', 'MG')} />
            <ResultCard label="Frais estimés" value={formatPrice(result.estimatedFees, 'MGA', 'MG')} />
          </div>

          <div className="mt-5 rounded-xl bg-primary-50 p-5 dark:bg-primary-900/20">
            <p className="text-sm font-bold text-primary-700 dark:text-primary-300">Budget total projet</p>
            <p className="mt-1 text-3xl font-black text-foreground">{formatPrice(result.totalProject, 'MGA', 'MG')}</p>
          </div>
        </div>
      </section>
    </main>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="space-y-2">
      <span className="block text-sm font-bold text-foreground">{label}</span>
      {children}
    </label>
  )
}

function ResultCard({ label, value, icon, highlight }: { label: string; value: string; icon?: React.ReactNode; highlight?: boolean }) {
  return (
    <div className={`rounded-xl border p-4 ${highlight ? 'border-primary-200 bg-primary-50 dark:border-primary-700 dark:bg-primary-900/20' : 'border-gray-100 bg-gray-50 dark:border-border dark:bg-gray-900'}`}>
      <div className="flex items-center gap-3">
        {icon && <span className="text-primary-600 dark:text-primary-400">{icon}</span>}
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-xl font-black text-foreground">{value}</p>
        </div>
      </div>
    </div>
  )
}
