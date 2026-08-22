// Lokasi file: src/app/page.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Brain, Activity, ArrowRight, GraduationCap } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);

      if (!mobile) {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
          const rect = container.getBoundingClientRect();
          const scrollProgress = -rect.top / (window.innerHeight * 0.8);
          setIsScrolled(scrollProgress > 0);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
      } else {
        setIsScrolled(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const heroSlides = [
    {
      icon: Brain,
      title: "Kenali Potensi Diri",
      desc: "Temukan bakat dan minat terpendammu lewat asesmen ilmiah.",
      bg: "from-blue-600 to-indigo-700"
    },
    {
      icon: Activity,
      title: "Kelola Emosi",
      desc: "Pahami perasaanmu dan hadapi tantangan sehari-hari.",
      bg: "from-pink-600 to-rose-700"
    },
    {
      icon: ShieldCheck,
      title: "Siap Masa Depan",
      desc: "Pilih jurusan dan karir yang tepat dengan data yang akurat.",
      bg: "from-slate-700 to-slate-900"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  return (
    // Mengubah background utama menjadi gradasi slate yang elegan
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-slate-100 to-slate-200 flex flex-col lg:flex-row font-sans">

      {/* ==============================
          BAGIAN ATAS (Header & Navigation)
          ============================== */}
      <div className="fixed top-0 left-0 w-full z-50">
        <div className={`px-6 md:px-12 py-6 transition-all duration-500 ${isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm py-4 border-b border-slate-200/50' : 'bg-transparent'}`}>
          <div className="max-w-7xl mx-auto flex items-center justify-between">

            {/* Logo Kiri - Menggunakan GraduationCap */}
            <div className={`flex items-center gap-2 font-extrabold text-xl tracking-tight transition-colors duration-300 ${isScrolled ? 'text-blue-700' : 'text-slate-900'}`}>
              <div className="p-2 bg-blue-600 rounded-xl shadow-md">
                <GraduationCap className="h-5 w-5 text-white" strokeWidth={2.5} />
              </div>
              DIGIBK
            </div>

            {/* Tombol di Kanan */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/login')}
                className="px-6 py-2.5 text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all duration-300 shadow-lg shadow-slate-900/20 active:scale-95"
              >
                Masuk Akun
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ==============================
          BAGIAN TENGAH (Hero Section - HANYA TAMPIL DI MOBILE)
          ============================== */}
      <div className="lg:hidden pt-24 w-full">
        <div className="relative w-full h-[60vh] overflow-hidden rounded-b-[2.5rem] bg-linear-to-b from-transparent to-slate-200/50">
          <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
            <div className="relative w-full h-full flex items-center justify-center">
              {heroSlides.map((slide, index) => {
                const isActive = currentSlide === index;
                const Icon = slide.icon;
                return (
                  <div key={index} className={`absolute flex flex-col items-center justify-center transition-all duration-700 ${isActive ? 'opacity-100 z-10 translate-y-0' : 'opacity-0 z-0 pointer-events-none translate-y-4'}`}>
                    <div className={`w-20 h-20 rounded-2xl bg-linear-to-br ${slide.bg} flex items-center justify-center mb-6 shadow-xl shadow-slate-900/10`}>
                      <Icon className="h-10 w-10 text-white" strokeWidth={2} />
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-900 leading-tight mb-3 tracking-tight">{slide.title}</h2>
                    <p className="text-slate-600 text-base px-4 font-medium leading-relaxed max-w-sm">{slide.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Titik Navigasi Slider */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-20">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2.5 rounded-full transition-all duration-500 ${currentSlide === idx ? 'w-8 bg-blue-600' : 'w-2.5 bg-slate-300'}`}
              />
            ))}
          </div>
        </div>

        {/* Tombol Aksi Tambahan untuk Mobile */}
        <div className="p-8 flex justify-center mt-2">
          <button
            onClick={() => router.push('/login')}
            className="w-full max-w-xs flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-xl shadow-blue-600/20 active:scale-95"
          >
            Mulai Sekarang <ArrowRight size={20} />
          </button>
        </div>
      </div>

      {/* ==============================
          BAGIAN KIRI DESKTOP (Landing Page - HANYA TAMPIL DI LAPTOP)
          ============================== */}
      <div
        ref={containerRef}
        className="hidden lg:flex lg:w-1/2 min-h-screen flex-col justify-center p-16 xl:p-24 text-slate-900 relative overflow-hidden"
      >
        <div className="relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/50 text-blue-700 font-semibold text-sm mb-8 border border-blue-200/50">
            <GraduationCap size={16} /> Platform Konseling Modern
          </div>

          <h1 className="text-5xl xl:text-6xl font-extrabold leading-tight mb-6 text-slate-900 tracking-tight">
            Kenali Potensi,<br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">
              Raih Masa Depan.
            </span>
          </h1>
          <p className="text-slate-600 text-lg max-w-lg leading-relaxed mb-12 font-medium">
            Sistem Informasi Bimbingan Konseling yang dirancang khusus untuk memetakan minat bakat dan mengelola emosi dengan pendekatan data yang akurat.
          </p>

          <button
            onClick={() => router.push('/login')}
            className="group flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg transition-all duration-300 shadow-xl shadow-blue-600/20 hover:shadow-2xl hover:-translate-y-1 w-fit"
          >
            Mulai Asesmen
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* ==============================
          BAGIAN KANAN DESKTOP (Ilustrasi Interaktif)
          ============================== */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12">
        {/* Ornamen Latar Belakang */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-linear-to-tr from-blue-200/40 to-indigo-200/40 rounded-full blur-3xl"></div>

        <div className="relative w-full max-w-lg aspect-square">

          {/* Card Animasi Mengambang 1 */}
          <div className="absolute top-16 left-0 bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-2xl shadow-slate-200/50 border border-white flex gap-5 items-center animate-[bounce_4s_infinite] hover:scale-105 transition-transform cursor-default">
            <div className="bg-linear-to-br from-blue-500 to-blue-600 p-4 rounded-xl text-white shadow-inner">
              <Brain size={28} />
            </div>
            <div>
              <p className="font-bold text-slate-800 text-lg tracking-tight">Asesmen RIASEC</p>
              <p className="text-sm text-slate-500 font-medium">Pemetaan 6 dimensi minat</p>
            </div>
          </div>

          {/* Card Animasi Mengambang 2 */}
          <div className="absolute bottom-24 right-0 bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-2xl shadow-slate-200/50 border border-white flex gap-5 items-center animate-[bounce_5s_infinite] hover:scale-105 transition-transform cursor-default delay-300">
            <div className="bg-linear-to-br from-rose-500 to-pink-600 p-4 rounded-xl text-white shadow-inner">
              <Activity size={28} />
            </div>
            <div>
              <p className="font-bold text-slate-800 text-lg tracking-tight">Kelola Emosi</p>
              <p className="text-sm text-slate-500 font-medium">Check-in perasaan harian</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}