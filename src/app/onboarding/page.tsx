import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";

export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24 bg-background">
      <OnboardingFlow />
    </div>
  );
}
