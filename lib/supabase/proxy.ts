// Lokasi file: src/lib/supabase/proxy.ts
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
    // 1. Menyiapkan kerangka respons dasar
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });

    // 2. Menghubungkan ke Supabase dan mengatur cookie (sesi pengguna)
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => {
                        request.cookies.set(name, value);
                    });
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    });
                    cookiesToSet.forEach(({ name, value, options }) => {
                        response.cookies.set(name, value, options);
                    });
                },
            },
        }
    );

    // 3. Mengambil data sesi pengguna (apakah sedang login)
    const { data: { user } } = await supabase.auth.getUser();

    // 4. Mengambil jalur alamat (URL) yang dituju
    const path = request.nextUrl.pathname;

    // Mengabaikan file sistem dan gambar agar tidak membebani server
    if (path.startsWith('/_next') || path.includes('.')) {
        return response;
    }

    // Mendefinisikan rute yang terbuka untuk umum
    const isPublicPath = path === '/' || path === '/login';

    // =========================================================
    // LOGIKA PENJAGAAN RUTE (ROUTING LOGIC)
    // =========================================================

    // SKENARIO 1: PENGGUNA BELUM LOGIN
    if (!user) {
        // Jika mencoba mengakses rute selain '/' dan '/login', lempar ke login
        if (!isPublicPath) {
            const url = request.nextUrl.clone();
            url.pathname = '/login';
            return NextResponse.redirect(url);
        }
    }

    // SKENARIO 2: PENGGUNA SUDAH LOGIN
    else {
        // Jika pengguna mencoba membuka halaman depan ('/') atau '/login'
        if (isPublicPath) {
            const url = request.nextUrl.clone();

            // Pengecekan Peran (Role) untuk memisahkan Siswa dan Super Admin/Guru
            const { data: roleData } = await supabase
                .from('user_roles')
                .select('role')
                .eq('user_id', user.id)
                .single();

            const userRole = roleData?.role;

            // Mengarahkan berdasarkan peran
            if (userRole === 'SUPER_ADMIN' || userRole === 'TEACHER' || userRole === 'BK_COUNSELOR') {
                url.pathname = '/bk/dashboard'; // Arahkan ke panel guru/admin
            } else {
                url.pathname = '/student/dashboard'; // Arahkan ke panel siswa
            }

            return NextResponse.redirect(url);
        }
    }

    // Jika semua aturan terpenuhi, izinkan pengguna melanjutkan
    return response;
}