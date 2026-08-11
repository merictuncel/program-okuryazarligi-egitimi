import { getServerSession } from "next-auth";
import { AdminSidebar } from "@/components/AdminSidebar";
import { authOptions } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-slate-100 md:flex">
      {session ? <AdminSidebar email={session.user.email} /> : null}
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
