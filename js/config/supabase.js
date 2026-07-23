/**
 * ============================================
 * SUPABASE CONFIGURATION
 * ============================================
 * Konfigurasi koneksi ke Supabase
 */

// Supabase credentials
const SUPABASE_URL = 'https://vwjewsddkxdjvjmcaktz.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_slumtfwctkcncOd-lqvEsw_PU3ZkGWp'; // ⚠️ GANTI DENGAN KEY BARU SETELAH RESET!

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
