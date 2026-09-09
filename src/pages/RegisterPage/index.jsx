import { usePageTitle } from "@/hooks/usePageTitle"

function RegisterPage() {
  usePageTitle("Register")
  return <h1 className="text-2xl font-bold p-8">Register Page</h1>
}

export default RegisterPage