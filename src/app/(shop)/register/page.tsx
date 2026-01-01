import { RegisterForm } from "@/components/shop/auth/register-form";

export const metadata = {
  title: "注册 - 电商系统",
};

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
      <RegisterForm />
    </div>
  );
}
