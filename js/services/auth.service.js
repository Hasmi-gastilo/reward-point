/**
 * ============================================
 * AUTH SERVICE
 * ============================================
 * Service untuk handle authentication admin
 */

import { supabase } from '../config/supabase.js';

class AuthService {
    /**
     * Login admin
     * @param {string} email - Email admin
     * @param {string} password - Password admin
     * @returns {Promise<Object>} User data
     */
    async login(email, password) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            // Simpan session ke localStorage
            if (data.user) {
                localStorage.setItem('isAdminLoggedIn', 'true');
                localStorage.setItem('adminId', data.user.id);
            }

            return { success: true, data };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Logout admin
     * @returns {Promise<Object>}
     */
    async logout() {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;

            // Hapus session dari localStorage
            localStorage.removeItem('isAdminLoggedIn');
            localStorage.removeItem('adminId');

            return { success: true };
        } catch (error) {
            console.error('Logout error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Check apakah admin sudah login
     * @returns {Promise<boolean>}
     */
    async isAuthenticated() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            return user !== null;
        } catch (error) {
            return false;
        }
    }

    /**
     * Get current admin user
     * @returns {Promise<Object|null>}
     */
    async getCurrentUser() {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            return user;
        } catch (error) {
            return null;
        }
    }

    /**
     * Protect admin page - redirect ke login jika belum auth
     */
    async protectAdminPage() {
        const isAuth = await this.isAuthenticated();
        if (!isAuth) {
            window.location.href = '/pages/admin/login.html';
        }
    }

    /**
     * Redirect ke dashboard jika sudah login
     */
    async redirectIfAuthenticated() {
        const isAuth = await this.isAuthenticated();
        if (isAuth) {
            window.location.href = '/pages/admin/dashboard.html';
        }
    }
}

export default new AuthService();
