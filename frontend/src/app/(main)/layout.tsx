import { Sidebar } from "@/components/sidebar";
import { TopNav } from "@/components/top-nav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <TopNav />
      <div className="ml-[280px] pt-16 min-h-screen">{children}</div>
    </div>
  );
}
