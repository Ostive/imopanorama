import type { Metadata } from 'next'
import BudgetCalculatorPage from './BudgetCalculatorPageClient'

export const metadata: Metadata = {
  title: 'Calculateur de budget immobilier',
  description: 'Estimez votre budget d\'achat ou de construction à Madagascar grâce à notre calculateur immobilier interactif.',
}

export { BudgetCalculatorPage as default }
