'use client';
import React, { useState, useEffect } from 'react';
import useFetchHistory from '@/app/hooks/useFetchHistory';
import 'react-datepicker/dist/react-datepicker.css';
import { HistoryType } from '@/app/hooks/useFetchHistory';

function getAverage(history: HistoryType[], selectedDate: Date | null) {
    const dayRecords: { [key: string]: { temps: number[]; hums: number[] } } = {};
    let filtered = history;

    if (selectedDate) {
        const selectedDateString = selectedDate.toLocaleDateString('en-US');
        filtered = history.filter(item => {
            const itemDateString = new Date(item.timestamp).toLocaleDateString('en-US');
            return itemDateString === selectedDateString;
        });
    }

    filtered.forEach(item => {
        const date = new Date(item.timestamp);
        const formattedDate = `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`; 

        if (!dayRecords[formattedDate]) {
            dayRecords[formattedDate] = { temps: [], hums: [] };
        }

        if (item.temperature !== null) {
            dayRecords[formattedDate].temps.push(Number(item.temperature));
        }
        if (item.humidity !== null) {
            dayRecords[formattedDate].hums.push(Number(item.humidity));
        }
    });

    return Object.keys(dayRecords).map(date => {
        const temps = dayRecords[date].temps;
        const hums = dayRecords[date].hums;

        const avgTemp = temps.length > 0
            ? +(temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(2)
            : null;

        const avgHum = hums.length > 0
            ? +(hums.reduce((a, b) => a + b, 0) / hums.length).toFixed(2)
            : null;

        return { date, temperature: avgTemp, humidity: avgHum }; 
    });
}

export default function HistoryTable() {
    const { history, loading, error } = useFetchHistory();
    const [currentPage, setCurrentPage] = useState(1);
    const selectedDate = null; 
    const averages = getAverage(history, selectedDate);
    const pageSize = 6; 
    const totalPages = Math.max(1, Math.ceil(averages.length / pageSize));
   
    const currentAverages = averages.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );
    

    const prevPage = () => setCurrentPage(page => Math.max(page - 1, 1));
    const nextPage = () => setCurrentPage(page => Math.min(page + 1, totalPages));

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(1);
        }
    }, [averages, currentPage, totalPages]);

    return (
        <div className="history-table-container bg-[#FFFFFF] mx-auto flex-1 p-2 rounded-xl shadow-lg">
            {loading && <div className="text-center text-gray-500">Loading history data...</div>}
            {error && <div className="text-center text-red-600">{error}</div>}

            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse table-fixed">
                    <thead>
                        <tr className="bg-[#D2914A] text-white text-center text-lg md:text-2xl">
                            <th className="p-3 md:p-5 border min-w-[180px] md:min-w-[250px]">Date</th>
                            <th className="p-3 md:p-5 border min-w-[180px] md:min-w-[250px]">Temperature</th>
                            <th className="p-3 md:p-5 border min-w-[180px] md:min-w-[250px]">Humidity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentAverages.length > 0 ? (
                            currentAverages.map((item, index) => (
                                <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                                    <td className="p-2 border border-[#08423615] text-[#0B2C27] text-center text-base md:text-xl">{item.date}</td>
                                    <td className="p-2 border border-[#08423615] text-[#0B2C27] text-center text-base md:text-xl">
                                        {item.temperature !== null ? `${item.temperature}°C` : 0}
                                    </td>
                                    <td className="p-4 border border-[#08423615] text-[#0B2C27] text-center text-base md:text-xl">
                                        {item.humidity !== null ? `${item.humidity}%` : 0}
                                    </td>
                                </tr>
                            ))
                        ) : null
                        }
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center items-center gap-4 mt-6">
                <button
                    className="px-4 py-2 rounded bg-[#E5E7EB] text-[#084236] font-semibold shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={currentPage === 1}
                    onClick={prevPage}
                >
                    Previous
                </button>
                <span className="text-[#084236] font-medium">
                    Page {currentPage} of {totalPages || 1}
                </span>
                <button
                    className="px-4 py-2 rounded bg-[#E5E7EB] text-[#084236] font-semibold shadow transition disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={nextPage}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
