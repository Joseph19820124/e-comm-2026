import { AccountSidebar } from "@/components/shop/account/account-sidebar";

export const metadata = {
  title: "个人中心 - 电商系统",
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="md:col-span-1">
          <div className="sticky top-24">
            <AccountSidebar />
          </div>
        </aside>

        {/* Content */}
        <main className="md:col-span-3">{children}</main>
      </div>
    </div>
  );
}
