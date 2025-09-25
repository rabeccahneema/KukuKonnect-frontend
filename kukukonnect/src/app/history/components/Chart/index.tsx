'use client';
import React, { useEffect, useState } from 'react';
import useFetchHistory from '@/app/hooks/useFetchHistory';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ReactDatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import HistoryTable from '../List';
import { HistoryType } from '@/app/hooks/useFetchHistory';

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

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

    for (const day of weekDays) {
        dayRecords[day] = {
            temps: [],
            hums: []
        };
    }

    filtered.forEach(item => {
        const day = new Date(item.timestamp).toLocaleDateString('en-US', { weekday: 'short' });
        if (weekDays.includes(day)) {
            if (item.temperature !== null) {
                dayRecords[day].temps.push(Number(item.temperature));
            }
            if (item.humidity !== null) {
                dayRecords[day].hums.push(Number(item.humidity));
            };
        };
    });

    return weekDays.map(day => {
        const temps = dayRecords[day].temps;
        const hums = dayRecords[day].hums;

        const avgTemp = temps.length > 0
            ? +(temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(2)
            : null;

        const avgHum = hums.length > 0
            ? +(hums.reduce((a, b) => a + b, 0) / hums.length).toFixed(2)
            : null;

        return { time: day, temperature: avgTemp, humidity: avgHum };
    });
}

export default function HistoryBarChart() {
    const { history, loading, error } = useFetchHistory();
    const [data, setData] = useState<{ time: string; temperature: number | null; humidity: number | null }[]>([]);
    const [view, setView] = useState<'Graph' | 'List'>('Graph');
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    useEffect(() => {
        setData(getAverage(history, selectedDate));
    }, [history, selectedDate]);

    return (
        <div className="min-h-screen bg-[#FFFFFF]">
            <div className="flex-1 p-5 2xl:pl-72 lg:pl-62 sm:p-">
                <h1 className="text-3xl  sm:text-4xl lg:text-5xl  font-semibold text-[#084236] text-center mb-6 md:mb-8">Temperature and Humidity History</h1>


                <div className="flex flex-wrap gap-6 mb-6 pl-7 ">

                    <div className="flex bg-[#E5E7EB] rounded overflow-hidden shadow">
                        <button
                            onClick={() => setView('Graph')}
                            className={`px-6 py-2 font-semibold transition ${view === 'Graph' ? 'bg-[#D2914A] text-[#084236]' : 'bg-transparent text-[#a19c9c4b] cursor-pointer'}`}
                        >
                            Graph
                        </button>
                        <button
                            onClick={() => setView('List')}
                            className={`px-6 py-2 font-semibold transition ${view === 'List' ? 'bg-[#D2914A] text-[#084236]' : 'bg-transparent text-[#a19c9c8e] cursor-pointer'}`}
                        >
                            List
                        </button>
                    </div>

                    <div className=''>

                        <ReactDatePicker
                            showIcon
                            toggleCalendarOnIconClick
                            selected={selectedDate}
                            onChange={(date) => setSelectedDate(date as Date)}
                            isClearable
                            placeholderText='Select date'
                            className=" rounded border border-[#E5E7EB] shadow bg-white text-[#084236] font-semibold text-center "
                        />
                    </div>
                </div>

                <div className="   p-7 pb-4">
                    {loading && <div className="text-center text-lg">Loading data...</div>}
                    {error && <div className="text-center text-red-600">{error}</div>}

                    {!loading && !error && view === 'Graph' && (
                        <div className="flex flex-col md:flex-row gap-12 justify-center ">

                            <div className="flex-1 bg-[#FFFFFF] drop-shadow-lg p-8 ">
                                <h2 className="text-xl font-medium pb-5 mb-8 text-[#234534]">Temperature</h2>
                                <ResponsiveContainer width="100%" height={450}>
                                    <BarChart data={data}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="time" />
                                        <YAxis domain={[0, 40]} unit="°C" />
                                        <Tooltip />
                                        <Bar dataKey="temperature" fill="#D47F23" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="flex-1  bg-[#FFFFFF] drop-shadow-lg p-8">
                                <h2 className="text-xl font-medium pb-5 mb-2 text-[#234534]">Humidity</h2>
                                <ResponsiveContainer width="100%" height={450}>
                                    <BarChart data={data}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="time" />
                                        <YAxis domain={[0, 100]} unit="%" />
                                        <Tooltip />
                                        <Bar dataKey="humidity" fill="#084236" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}

                    {!loading && !error && view === 'List' && (
                        <HistoryTable />
                    )}
                </div>
            </div>
        </div>
    );
}
