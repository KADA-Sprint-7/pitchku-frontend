import { usePageTitle } from "@/hooks/usePageTitle";
import RegisterForm from "@/components/RegisterPage/RegisterForm";

function RegisterPage() {
  usePageTitle("Daftar – PitchKu");

  return <RegisterForm />;
}

export default RegisterPage;