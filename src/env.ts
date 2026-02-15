const requiredEnvVars = [
    "NEXT_PUBLIC_SUPABASE_URL",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY",
] as const;

export const env = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
} as const;

// Validate at build time and on server startup — fail fast if env vars are missing.
if (typeof window === "undefined") {
    for (const key of requiredEnvVars) {
        if (!process.env[key]) {
            throw new Error(
                `Missing required environment variable: ${key}. ` +
                `Set it in .env.local or your deployment environment.`
            );
        }
    }
}
