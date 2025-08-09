import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <AuthCard
      title="JMI Study Hub"
      description="Login to access exclusive resources for JMI students."
    >
      <LoginForm />
    </AuthCard>
  );
}
