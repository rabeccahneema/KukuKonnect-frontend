'use client';
import React, { useState } from "react";
import useFetchUsers from "../hooks/usefetchUsers";
import { addFarmers } from "../utils/fetchUsers";
import AddUserModal from "./components/Users-modal";

const getPageSize = () => {
  if (typeof window !== "undefined") {
    if (window.innerWidth < 1030) return 20;
  }
  return 10;
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
    <div className="flex justify-center items-center gap-4 mt-8 mb-2 w-full">
      <button
        className={`px-6 py-2 rounded-lg border border-[#D2914A] text-[#D2914A] bg-white font-medium text-base transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
        onClick={prevPage}
        disabled={currentPage === 1}
        type="button"
      >
        Previous
      </button>
      <span className="font-medium text-base text-[#084236]">
        Page {currentPage} of {totalPages}
      </span>
      <button
        className={`px-6 py-2 rounded-lg border border-[#D2914A] font-medium text-base transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
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
    <div className="min-h-screen bg-white flex flex-col">
      <main className="flex-1 w-full px-2 sm:px-4 md:px-10 py-6">
        <div className="mt-6"></div>
        <h1 className="w-full text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#084236] mb-8 text-left">
          Farmers
        </h1>
        

        <div className="flex w-full flex-row justify-between items-center mb-4 gap-2 flex-wrap">
          <input
            type="text"
            placeholder="Search by name, email, or username.."
            className="border border-[#D2914A] rounded px-2 py-2 w-full max-w-[180px] sm:w-1/2 sm:max-w-xs md:max-w-sm focus:outline-none focus:ring-2 focus:ring-[#D2914A] text-[#084236] text-sm sm:text-base"
            value={search}
            onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
            style={{ minWidth: 0 }}
          />
          <button
            onClick={openModal}
            className="bg-[#D2914A] text-white rounded px-4 py-2 font-medium hover:bg-[#b87b37] transition cursor-pointer text-sm sm:text-base whitespace-nowrap"
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

        <div className="w-full">
          <div className="overflow-x-auto rounded-xl border border-[#EEE] bg-white w-full">
            <table className="min-w-[900px] w-full text-left border-separate border-spacing-0">
              <thead>
                <tr className="sticky top-0 z-10">
                  <th className="bg-[#D2914A] text-white font-bold py-2 px-2 sm:py-3 sm:px-3 text-xs sm:text-base md:text-lg border border-[#EEE] text-left">
                    Name
                  </th>
                  <th className="bg-[#D2914A] text-white font-bold py-2 px-2 sm:py-3 sm:px-3 text-xs sm:text-base md:text-lg border border-[#EEE] text-left">
                    Email Address
                  </th>
                  <th className="bg-[#D2914A] text-white font-bold py-2 px-2 sm:py-3 sm:px-3 text-xs sm:text-base md:text-lg border border-[#EEE] text-left">
                    Phone Number
                  </th>
                  <th className="bg-[#D2914A] text-white font-bold py-2 px-2 sm:py-3 sm:px-3 text-xs sm:text-base md:text-lg border border-[#EEE] text-left">
                    Username
                  </th>
                  <th className="bg-[#D2914A] text-white font-bold py-2 px-2 sm:py-3 sm:px-3 text-xs sm:text-base md:text-lg border border-[#EEE] text-left">
                    Device Id
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-6 sm:py-10 text-left text-black border border-[#EEE] text-xs sm:text-base">
                      Loading...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={5} className="py-6 sm:py-10 text-left text-red-600 border border-[#EEE] text-xs sm:text-base">
                      {error}
                    </td>
                  </tr>
                ) : filteredFarmers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 sm:py-10 text-left text-black border border-[#EEE] text-xs sm:text-base">
                      User not found
                    </td>
                  </tr>
                ) : (
                  currentFarmers.map((farmer, idx) => (
                    <tr key={farmer.username + idx}>
                      <td className="py-2 px-2 sm:py-3 sm:px-3 border border-[#EEE] bg-white text-black text-xs sm:text-base md:text-lg text-left">
                        {farmer.first_name} {farmer.last_name}
                      </td>
                      <td className="py-2 px-2 sm:py-3 sm:px-3 border border-[#EEE] bg-white text-black text-xs sm:text-base md:text-lg text-left">
                        {farmer.email}
                      </td>
                      <td className="py-2 px-2 sm:py-3 sm:px-3 border border-[#EEE] bg-white text-black text-xs sm:text-base md:text-lg text-left">
                        {farmer.phone_number}
                      </td>
                      <td className="py-2 px-2 sm:py-3 sm:px-3 border border-[#EEE] bg-white text-black text-xs sm:text-base md:text-lg text-left">
                        {farmer.username}
                      </td>
                      <td className="py-2 px-2 sm:py-3 sm:px-3 border border-[#EEE] bg-white text-black text-xs sm:text-base md:text-lg text-left">
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
        </div>

        {showAddUserModal && (
          <AddUserModal show={showAddUserModal} onClose={closeModal} onAddUser={onAddUser} />
        )}
      </main>
    </div>
  );
}