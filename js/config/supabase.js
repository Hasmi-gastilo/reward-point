/**
 * ============================================
 * SUPABASE CONFIGURATION
 * ============================================
 * Konfigurasi koneksi ke Supabase
 */

// Supabase credentials
const SUPABASE_URL = 'https://vwjewsddkxdjvjmcaktz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3amV3c2Rka3hkanZqbWNha3R6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3NzUzODcsImV4cCI6MjEwMDM1MTM4N30.UvOqiavmHjWKRJgYNh_1VEOyUDI_c_rnh6PrnL35HT0'; // ✅ Telah diperbarui menggunakan Anon Key JWT

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: window.sessionStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    }
});

// Storage buckets
const STORAGE_BUCKETS = {
    members: 'members',
    rewards: 'rewards',
    banners: 'banners',
    settings: 'settings'
};

// Export untuk digunakan di module lain
export { supabase, STORAGE_BUCKETS };
