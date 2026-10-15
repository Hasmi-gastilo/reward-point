/**
 * ============================================
 * PRODUCT SERVICE
 * ============================================
 * Service untuk handle CRUD produk penghasil poin
 */

import { supabase, STORAGE_BUCKETS } from '../config/supabase.js';

class ProductService {
    /**
     * Get active products (untuk halaman publik)
     * @returns {Promise<Object>}
     */
    async getActive() {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('status', 'active')
                .order('name', { ascending: true });

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Get active products error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get all products (untuk admin)
     * @param {Object} options - Query options
     * @returns {Promise<Object>}
     */
    async getAll(options = {}) {
        try {
            let query = supabase
                .from('products')
                .select('*', { count: 'exact' })
                .order('created_at', { ascending: false });

            if (options.search) {
                query = query.ilike('name', `%${options.search}%`);
            }

            if (options.status) {
                query = query.eq('status', options.status);
            }

            const { data, error, count } = await query;
            if (error) throw error;
            return { success: true, data, total: count };
        } catch (error) {
            console.error('Get all products error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get product by ID
     * @param {string} id
     * @returns {Promise<Object>}
     */
    async getById(id) {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Get product error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Create new product
     * @param {Object} productData
     * @returns {Promise<Object>}
     */
    async create(productData) {
        try {
            const { data, error } = await supabase
                .from('products')
                .insert([{
                    name: productData.name,
                    image: productData.image || null,
                    point_earned: productData.point_earned,
                    status: productData.status || 'active'
                }])
                .select()
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Create product error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Update product
     * @param {string} id
     * @param {Object} productData
     * @returns {Promise<Object>}
     */
    async update(id, productData) {
        try {
            const { data, error } = await supabase
                .from('products')
                .update(productData)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Update product error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Delete product
     * @param {string} id
     * @returns {Promise<Object>}
     */
    async delete(id) {
        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Delete product error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Upload product image
     * @param {File} file
     * @param {string} productId
     * @returns {Promise<Object>}
     */
    async uploadImage(file, productId) {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `product-${productId}-${Date.now()}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from(STORAGE_BUCKETS.rewards)
                .upload(fileName, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from(STORAGE_BUCKETS.rewards)
                .getPublicUrl(fileName);

            return { success: true, url: publicUrl };
        } catch (error) {
            console.error('Upload product image error:', error);
            return { success: false, error: error.message };
        }
    }
}

export default new ProductService();
