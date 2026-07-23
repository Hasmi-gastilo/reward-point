/**
 * ============================================
 * BANNER SERVICE
 * ============================================
 * Service untuk handle banners
 */

import { supabase, STORAGE_BUCKETS } from '../config/supabase.js';

class BannerService {
    /**
     * Get active banners
     * @returns {Promise<Object>}
     */
    async getActive() {
        try {
            const { data, error } = await supabase
                .from('banners')
                .select('*')
                .eq('status', 'active')
                .order('created_at', { ascending: false });

            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            console.error('Get banners error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get all banners
     * @returns {Promise<Object>}
     */
    async getAll() {
        try {
            const { data, error } = await supabase
                .from('banners')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            console.error('Get all banners error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Create new banner
     * @param {Object} bannerData - Banner data
     * @returns {Promise<Object>}
     */
    async create(bannerData) {
        try {
            const { data, error } = await supabase
                .from('banners')
                .insert([{
                    title: bannerData.title,
                    image: bannerData.image,
                    status: bannerData.status || 'active'
                }])
                .select()
                .single();

            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            console.error('Create banner error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Update banner
     * @param {string} id - Banner ID
     * @param {Object} bannerData - Updated banner data
     * @returns {Promise<Object>}
     */
    async update(id, bannerData) {
        try {
            const { data, error } = await supabase
                .from('banners')
                .update(bannerData)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            console.error('Update banner error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Delete banner
     * @param {string} id - Banner ID
     * @returns {Promise<Object>}
     */
    async delete(id) {
        try {
            const { error } = await supabase
                .from('banners')
                .delete()
                .eq('id', id);

            if (error) throw error;

            return { success: true };
        } catch (error) {
            console.error('Delete banner error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Upload banner image
     * @param {File} file - Image file
     * @returns {Promise<Object>}
     */
    async uploadImage(file) {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `banner-${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from(STORAGE_BUCKETS.banners)
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from(STORAGE_BUCKETS.banners)
                .getPublicUrl(filePath);

            return { success: true, url: publicUrl };
        } catch (error) {
            console.error('Upload banner error:', error);
            return { success: false, error: error.message };
        }
    }
}

export default new BannerService();
