"use client";

import { useState } from "react";
import { loginAction } from "@/features/auth/actions/auth.actions";

export default function LoginPage() {
    const [errorMsg, setErrorMsg] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Fungsi untuk menangani saat tombol submit ditekan
    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        setErrorMsg("");

        const result = await loginAction(formData);

        // Jika ada error dari server, tampilkan di layar
        if (result?.error) {
            setErrorMsg(result.error);
            setIsLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md space-y-8 rounded-2xl bg-white p-8 shadow-lg border border-gray-100">
                <div className="text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-blue-600">DIGIBK</h2>
                    <p className="mt-2 text-sm text-gray-500">Platform Digital 7 Jurus BK</p>
                </div>

                <form action={handleSubmit} className="mt-8 space-y-6">
                    {errorMsg && (
                        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 border border-red-200">
                            {errorMsg}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email</label>
                            <input
                                name="email"
                                type="email"
                                required
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="siswa@sekolah.id"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                name="password"
                                type="password"
                                required
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
                    >
                        {isLoading ? "Memproses..." : "Masuk"}
                    </button>
                </form>
            </div>
        </div>
    );
}