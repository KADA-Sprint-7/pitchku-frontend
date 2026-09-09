import { usePageTitle } from "@/hooks/usePageTitle"

function LandingPage() {
  usePageTitle("Landing Page")
  return <h1 className="text-2xl font-bold p-8">Landing Page</h1>;
}

export default LandingPage;
