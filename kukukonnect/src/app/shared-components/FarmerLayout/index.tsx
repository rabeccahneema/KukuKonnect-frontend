import Sidebar from "../Sidebar/Farmer-Sidebar"

export default function FarmerLayout({
  children,
}: {
  children: React.ReactNode
}) {
   return (
   <div className="flex-shrink-0 w-[350px]">
        <Sidebar />
        <main>{children}</main>
    </div>
    )
    }