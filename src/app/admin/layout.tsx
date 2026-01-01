import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/sidebar";
import { AdminHeader } from "@/components/admin/header";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Login page doesn't need the admin layout
  return (
    <div className="min-h-screen bg-gray-50">
      {session?.user?.role === "ADMIN" ? (
        <div className="flex">
          <AdminSidebar />
          <div className="flex-1 ml-64">
            <AdminHeader user={session.user} />
            <main className="p-6">{children}</main>
          </div>
        </div>
      ) : (
        children
      )}
    </div>
  );
}
