import { usePageTitle } from '@/hooks/usePageTitle'

function WizardPage() {
  usePageTitle("Wizard")
  return <h1 className="text-2xl font-bold p-8">Wizard Page</h1>
}

export default WizardPage