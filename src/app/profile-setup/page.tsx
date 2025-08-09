import { AuthCard } from "@/components/auth/auth-card";
import { ProfileSetupForm } from "@/components/auth/profile-setup-form";

export default function ProfileSetupPage() {
  return (
    <AuthCard
      title="One Last Step"
      description="Complete your profile to get started."
    >
      <ProfileSetupForm />
    </AuthCard>
  );
}
