"use client";

import Image from 'next/image';
import { useRouter } from 'next/navigation';

function Logo() {
  return (
    <div className="flex justify-start -mt-8 lg:-mt-8 xl:-mt-8 2xl:-mt-8">
      <div className="relative w-48 h-48 sm:w-56 sm:h-56 lg:w-60 lg:h-60 xl:w-60 lg:ml-[80px]  xl:h-60 2xl:w-60 2xl:h-60">
        <Image
          src="/images/Kuku-Logo.png"
          alt="Kuku Logo"
          fill
          className="object-contain"
        />
      </div>
    </div>
  );
}

export default function WelcomeScreen() {
  const router = useRouter();
  return (
    <main className="min-h-screen grid place-items-center bg-white p-4 sm:p-6 overflow-visible">
      <div className="mx-auto w-[min(1120px,92vw)] flex flex-col lg:flex-row items-center gap-8 lg:gap-10 xl:gap-10 2xl:gap-10 mt-16 lg:mt-20 xl:mt-20 2xl:mt-20 overflow-visible">
        <section className="flex-1 text-center lg:text-left mt-[-80px] lg:mt-[-120px] xl:mt-[-160px] 2xl:mt-[-160px] ml-0 lg:ml-[-50px] xl:ml-[-100px] 2xl:ml-[-100px]">
          <Logo />
          <h1 className="m-0 font-bold leading-tight text-[#1c4f46] text-5xl sm:text-6xl lg:text-7xl lg:ml-[80px] xl:text-[6rem] 2xl:text-[6rem] mt-[-10px]">
            Welcome to
            <span className="block">
              <span className="text-[#d89243]">Kuku</span>
              <span className="text-[#1c4f46]">Konnect</span>
            </span>
          </h1>
          <div className="mt-8 sm:mt-10 lg:mt-10 xl:mt-12 2xl:mt-12 flex gap-4 lg:gap-6  lg:ml-[80px] xl:gap-6 2xl:gap-6 justify-center lg:justify-start">
            <button
              onClick={() => router.push("/set-password")}
              className="inline-block rounded-lg bg-[#d89243] px-8 lg:px-12 xl:px-12 2xl:px-12 py-4 lg:py-5 xl:py-5 2xl:py-5 text-xl lg:text-2xl xl:text-2xl 2xl:text-2xl font-bold text-white shadow-[0_6px_18px_rgba(216,146,67,0.25)] transition hover:bg-[#bf7730] hover:shadow-[0_8px_22px_rgba(191,119,48,0.3)] active:translate-y-px min-w-[160px] lg:min-w-[180px] xl:min-w-[180px] 2xl:min-w-[180px] cursor-pointer"
            >
              Farmer
            </button>
            <button
              onClick={() => router.push("/login")}
              className="inline-block rounded-lg bg-[#1c4f46] px-8 lg:px-12 xl:px-12 2xl:px-12 py-4 lg:py-5 xl:py-5 2xl:py-5 text-xl lg:text-2xl xl:text-2xl 2xl:text-2xl font-bold text-white shadow-[0_6px_18px_rgba(28,79,70,0.18)] transition hover:bg-[#174037] hover:shadow-[0_8px_22px_rgba(28,79,70,0.25)] active:translate-y-px min-w-[160px] lg:min-w-[180px] xl:min-w-[180px] 2xl:min-w-[180px] cursor-pointer"
            >
              AgroVet
            </button>
          </div>
        </section>
        <div className="flex-1 flex justify-center lg:justify-end items-center mt-0 lg:mt-[-40px] xl:mt-[-65px] 2xl:mt-[-65px] mr-0 lg:mr-[-60px] xl:mr-[-120px] 2xl:mr-[-120px]">
          <div className="relative w-full max-w-[500px] h-[400px] lg:w-[600px] lg:h-[530px] xl:w-[1000px] xl:h-[630px] 2xl:w-[700px] 2xl:h-[630px]">
            <Image
              src="/images/egg.png"
              alt="Chick standing next to an egg"
              fill
              className="object-contain xl:ml-[-90px] drop-shadow-[0_14px_18px_rgba(0,0,0,0.14)]"
            />
          </div>
        </div>
      </div>
    </main>
  );
}