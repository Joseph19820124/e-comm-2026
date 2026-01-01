import { Suspense } from "react";
import { LoginForm } from "@/components/shop/auth/login-form";

export const metadata = {
  title: "登录 - 电商系统",
};

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
