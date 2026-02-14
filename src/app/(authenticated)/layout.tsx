import Sidebar from "@/components/Sidebar";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden flex-col lg:flex-row">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-background px-4 py-8 lg:p-10 mt-16 lg:mt-0">
        <div className="mx-auto max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}
