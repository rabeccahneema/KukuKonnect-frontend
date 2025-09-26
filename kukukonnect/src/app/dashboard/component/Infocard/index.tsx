'use client';
import { InfoCardProps } from "@/app/utils/types/infocard";

export default function InfoCard({ label, value, unit }: InfoCardProps) {
  return (
    <div className="bg-white shadow-xl rounded-xl flex-1 flex flex-col justify-center items-center text-emerald-900 p-4 xl:p-8">
      <div className="text-lg mb-2">{label}</div>
      <div className="font-bold text-3xl xl:text-5xl">{value ?? '--'}{unit}</div>
    </div>
  );
}