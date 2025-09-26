import Sidebar from "../Sidebar/Agrovet-Sidebar";

export default function AgrovetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-white">
     
      <div className="hidden lg:flex flex-shrink-0 w-[220px] max-w-[300px] bg-white shadow-md">
        <Sidebar />
      </div>
      <main className="flex-1 min-w-0 max-w-full w-full bg-gray-50 p-3 xs:p-4 sm:p-6 md:p-8 pb-16 lg:pb-0 text-xs xs:text-sm sm:text-base">
        {children}
      </main>
      
      <div className="lg:hidden">
        <Sidebar />
      </div>
    </div>
  );
}