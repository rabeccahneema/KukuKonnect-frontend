import Sidebar from "../Sidebar/Agrovet-Sidebar"
export default function AgrovetLayout({
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