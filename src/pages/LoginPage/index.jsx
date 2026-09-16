import { usePageTitle } from "@/hooks/usePageTitle";
import LoginForm from "@/components/LoginPage/LoginForm";

function LoginPage() {
  usePageTitle("Masuk – PitchKu");

  return <LoginForm />;
}

export default LoginPage;
