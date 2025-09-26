import Sidebar from "../Sidebar/Farmer-Sidebar";

export default function FarmerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-white">
      <div className="hidden lg:flex flex-shrink-0 w-[17vw] min-w-[150px] max-w-[250px] bg-white shadow-md">
        <Sidebar />
      </div>

   
      <main className="flex-1 min-w-0 max-w-full w-full bg-gray-50 p-4 sm:p-6 pb-16 lg:pb-0">
        {children}
      </main>

    
      <div className="lg:hidden">
        <Sidebar />
      </div>
    </div>
  );
}