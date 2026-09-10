import { usePageTitle } from "@/hooks/usePageTitle";
import Navbar from "@/components/layout/Navbar";

export default function FAQPage() {
  usePageTitle("FAQ Page");
  return (
    <div>
      <p className="font-heading text-3xl font-bold">FAQ Page</p>
    </div>
  );
}
