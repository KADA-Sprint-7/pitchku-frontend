import { usePageTitle } from "@/hooks/usePageTitle"

function OutlinePage() {
  usePageTitle("Outline")
  return <h1 className="text-2xl font-bold p-8">Outline Page</h1>
}

export default OutlinePage