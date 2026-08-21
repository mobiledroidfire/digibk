import { createClient } from "@/lib/supabase/server";

export default async function TestDatabasePage() {
    const supabase = await createClient();

    const {
        data,
        error,
    } = await supabase
        .from("assessment_domains")
        .select("id, code, name")
        .order("display_order");

    return (
        <main className="p-8">
            <h1 className="text-2xl font-bold">
                DIGIBK Database Test
            </h1>

            <pre className="mt-6 rounded-lg bg-slate-100 p-4">
                {JSON.stringify(
                    {
                        data,
                        error,
                    },
                    null,
                    2
                )}
            </pre>
        </main>
    );
}