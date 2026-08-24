// src/features/auth/schemas/auth.schema.ts
import { z } from 'zod';

// Aturan untuk Siswa/Tamu
export const publicLoginSchema = z.object({
    studentCode: z.string().min(3, "Masukkan NISN/Nomor Absen minimal 3 karakter"),
    fullName: z.string().min(3, "Nama Lengkap wajib diisi minimal 3 karakter"),
    className: z.string().min(1, "Kelas wajib diisi"),
    schoolName: z.string().min(3, "Asal Sekolah wajib diisi minimal 3 karakter"),
});

// Aturan untuk Guru/Siswa Terdaftar
export const registeredLoginSchema = z.object({
    identifier: z.string().min(3, "Email atau NISN minimal 3 karakter"),
    password: z.string().min(6, "Kata sandi minimal 6 karakter"),
});

// Aturan untuk Klaim Akun
export const claimSchema = z.object({
    newNisn: z.string().min(3, "NISN wajib diisi dengan benar"),
    newPassword: z.string().min(6, "Kata sandi minimal 6 karakter"),
});