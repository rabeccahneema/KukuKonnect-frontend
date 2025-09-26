'use client';
import React, { useState } from "react";
import useFetchUsers from "../hooks/usefetchUsers";
import { addFarmers } from "../utils/fetchUsers";
import AddUserModal from "./components/Users-modal";
import AgrovetLayout from "../shared-components/AgrovetLayout";


const getPageSize = () => {
  if (typeof window !== "undefined") {
    if (window.innerWidth < 1030) return 20;
  }
  return 9;
};

export default function FarmersPage() {
  const { users, loading, error, refetch } = useFetchUsers();
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [pageSize, setPageSize] = useState(getPageSize());

  React.useEffect(() => {
    const handleResize = () => setPageSize(getPageSize());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const farmers = (users || []).filter((u: any) => (u.user_type || "Farmer") === "Farmer");
  const searchTrimmed = search.trim().toLowerCase();
  const filteredFarmers = !searchTrimmed
    ? farmers
    : farmers.filter(
        farmer =>
          (`${farmer.first_name} ${farmer.last_name}`.toLowerCase().includes(searchTrimmed)) ||
          (farmer.email?.toLowerCase().includes(searchTrimmed)) ||
          (farmer.username?.toLowerCase().includes(searchTrimmed))
      );
  const totalPages = Math.max(1, Math.ceil(filteredFarmers.length / pageSize));
  const currentFarmers = filteredFarmers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const openModal = () => setShowAddUserModal(true);
  const closeModal = () => setShowAddUserModal(false);

  const onAddUser = async (formData: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    username: string;
    device_id: string;
    user_type: string;
  }) => {
    await addFarmers(formData);
    if (refetch) await refetch();
    setSuccessMsg("Farmer added successfully!");
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const prevPage = () => setCurrentPage(p => Math.max(p - 1, 1));
  const nextPage = () => setCurrentPage(p => Math.min(p + 1, totalPages));

  const Pagination = () => (
    <div className="flex flex-wrap justify-center items-center gap-4 mt-8 mb-2 w-full">
      <button
        className="px-5 py-2 rounded-lg border border-[#D2914A] text-[#D2914A] bg-white font-medium text-xs xs:text-sm sm:text-base transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={prevPage}
        disabled={currentPage === 1}
        type="button"
      >
        Previous
      </button>
      <span className="font-medium text-xs xs:text-sm sm:text-base text-[#084236]">
        Page {currentPage} of {totalPages}
      </span>
      <button
        className={`px-5 py-2 rounded-lg border border-[#D2914A] font-medium text-xs xs:text-sm sm:text-base transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
          currentPage < totalPages
            ? 'bg-[#D2914A] text-white'
            : 'bg-white text-[#D2914A]'
        }`}
        onClick={nextPage}
        disabled={currentPage === totalPages}
        type="button"
      >
        Next
      </button>
    </div>
  );

  return (
    <AgrovetLayout>
      <div className="min-h-screen bg-white flex flex-col w-full">
        <main className="flex-1 w-full px-2 sm:px-4 md:px-8 xl:px-16 py-6 relative">
          <h1 className="w-full text-lg xs:text-xl sm:text-2xl md:text-3xl xl:text-4xl font-extrabold text-[#084236] mb-8 text-left">
            Farmers
          </h1>
          <div className="flex flex-col sm:flex-row w-full justify-between items-center mb-4 gap-3 flex-wrap">
            <input
              type="text"
              placeholder="Search by name, email, or username.."
              className="border border-[#D2914A] rounded px-2 py-2 w-full max-w-full sm:w-1/2 sm:max-w-xs md:max-w-sm focus:outline-none focus:ring-2 focus:ring-[#D2914A] text-[#084236] text-xs xs:text-sm sm:text-base"
              value={search}
              onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
              style={{ minWidth: 0 }}
            />
            <button
              onClick={openModal}
              className="bg-[#D2914A] text-white rounded px-4 py-2 font-medium hover:bg-[#B87B37] transition cursor-pointer text-xs xs:text-sm sm:text-base whitespace-nowrap w-full sm:w-auto"
              type="button"
            >
              Add Farmer
            </button>
          </div>
          {successMsg && (
            <div className="fixed top-5 right-2 left-2 sm:left-auto sm:right-8 z-50 bg-[#D2914A] text-white px-4 py-3 rounded shadow-lg transition text-center sm:text-right">
              {successMsg}
            </div>
          )}

          <div className="w-full overflow-x-auto rounded-xl border border-[#EEE] bg-white">
           
            <table className="min-w-[650px] w-full text-left border-separate border-spacing-0 text-xs xs:text-sm sm:text-base">
              <thead>
                <tr className="sticky top-0 z-10">
                  <th className="bg-[#D2914A] text-white font-bold py-2 px-2 sm:py-3 sm:px-3 text-xs xs:text-sm sm:text-base border border-[#EEE] text-left whitespace-nowrap">
                    Name
                  </th>
                  <th className="bg-[#D2914A] text-white font-bold py-2 px-2 sm:py-3 sm:px-3 text-xs xs:text-sm sm:text-base border border-[#EEE] text-left whitespace-nowrap">
                    Email Address
                  </th>
                  <th className="bg-[#D2914A] text-white font-bold py-2 px-2 sm:py-3 sm:px-3 text-xs xs:text-sm sm:text-base border border-[#EEE] text-left whitespace-nowrap">
                    Phone Number
                  </th>
                  <th className="bg-[#D2914A] text-white font-bold py-2 px-2 sm:py-3 sm:px-3 text-xs xs:text-sm sm:text-base border border-[#EEE] text-left whitespace-nowrap">
                    Username
                  </th>
                  <th className="bg-[#D2914A] text-white font-bold py-2 px-2 sm:py-3 sm:px-3 text-xs xs:text-sm sm:text-base border border-[#EEE] text-left whitespace-nowrap">
                    Device Id
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-6 sm:py-10 text-left text-black border border-[#EEE] text-xs xs:text-sm sm:text-base">
                      Loading...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={5} className="py-6 sm:py-10 text-left text-red-600 border border-[#EEE] text-xs xs:text-sm sm:text-base">
                      {error}
                    </td>
                  </tr>
                ) : filteredFarmers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 sm:py-10 text-left text-black border border-[#EEE] text-xs xs:text-sm sm:text-base">
                      User not found
                    </td>
                  </tr>
                ) : (
                  currentFarmers.map((farmer, idx) => (
                    <tr key={farmer.username + idx}>
                      <td className="py-2 px-2 sm:py-3 sm:px-3 border border-[#EEE] bg-white text-black text-xs xs:text-sm sm:text-base text-left whitespace-nowrap">
                        {farmer.first_name} {farmer.last_name}
                      </td>
                      <td className="py-2 px-2 sm:py-3 sm:px-3 border border-[#EEE] bg-white text-black text-xs xs:text-sm sm:text-base text-left whitespace-nowrap">
                        {farmer.email}
                      </td>
                      <td className="py-2 px-2 sm:py-3 sm:px-3 border border-[#EEE] bg-white text-black text-xs xs:text-sm sm:text-base text-left whitespace-nowrap">
                        {farmer.phone_number}
                      </td>
                      <td className="py-2 px-2 sm:py-3 sm:px-3 border border-[#EEE] bg-white text-black text-xs xs:text-sm sm:text-base text-left whitespace-nowrap">
                        {farmer.username}
                      </td>
                      <td className="py-2 px-2 sm:py-3 sm:px-3 border border-[#EEE] bg-white text-black text-xs xs:text-sm sm:text-base text-left whitespace-nowrap">
                        {farmer.device_id}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="w-full h-4"></div>
          {filteredFarmers.length > 0 && (
            <Pagination />
          )}
          {showAddUserModal && (
            <AddUserModal show={showAddUserModal} onClose={closeModal} onAddUser={onAddUser} />
          )}

          <div className="block lg:hidden h-16" />
        </main>
      </div>
    </AgrovetLayout>
  );
}