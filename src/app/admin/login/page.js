import LoginForm from "@/components/admin/LoginForm";

export const metadata = {
  title: "Sign In | Golden Spoon Admin",
};

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f6f5f2] px-5">
      <div className="w-full max-w-sm rounded-lg border border-neutral-200 bg-white px-6 py-8 shadow-sm">
        <p className="text-xs font-medium tracking-[0.16em] text-[#B5935A] uppercase">
          Golden Spoon
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900">
          Admin sign in
        </h1>
        <p className="mt-2 text-sm text-neutral-600">
          Enter your administrator credentials.
        </p>
        <LoginForm />
      </div>
    </div>
  );
}
