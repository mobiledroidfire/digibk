"use server";

import { createClient } from "@/lib/supabase/server";
import { loginSchema } from "../schemas/auth.schema";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // 1. Validasi input menggunakan Zod
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
        return { error: "Email atau password tidak valid." };
    }

    // 2. Proses Login ke Supabase
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
        email: parsed.data.email,
        password: parsed.data.password,
    });

    if (error) {
        return { error: "Email atau password salah." };
    }

    // 3. Jika berhasil, arahkan ke dashboard siswa
    // (Nantinya kita akan buat deteksi otomatis untuk role Guru BK / Admin)
    redirect("/student/dashboard");
}