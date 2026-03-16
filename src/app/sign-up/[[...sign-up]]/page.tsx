import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
      <SignUp 
        appearance={{
          elements: {
            formButtonPrimary: 
              "bg-[#1a1f36] hover:bg-[#2a2f46] text-sm normal-case",
          },
        }}
      />
    </div>
  );
}
