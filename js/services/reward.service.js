/**
 * ============================================
 * REWARD SERVICE
 * ============================================
 * Service untuk handle CRUD rewards
 */

import { supabase, STORAGE_BUCKETS } from '../config/supabase.js';

class RewardService {
    /**
     * Get all rewards dengan join category
     * @param {Object} options - Query options
     * @returns {Promise<Object>}
     */
    async getAll(options = {}) {
        try {
            let query = supabase
                .from('rewards')
                .select(`
                    *,
                    categories (
                        id,
                        name,
                        icon
                    )
                `, { count: 'exact' })
                .order('created_at', { ascending: false });

            if (options.search) {
                query = query.ilike('title', `%${options.search}%`);
            }

            if (options.category_id) {
                query = query.eq('category_id', options.category_id);
            }

            if (options.status) {
                query = query.eq('status', options.status);
            }

            if (options.limit) {
                query = query.limit(options.limit);
            }

            if (options.offset) {
                query = query.range(options.offset, options.offset + options.limit - 1);
            }

            const { data, error, count } = await query;

            if (error) throw error;

            return { success: true, data, total: count };
        } catch (error) {
            console.error('Get rewards error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get reward by ID dengan category
     * @param {string} id - Reward ID
     * @returns {Promise<Object>}
     */
    async getById(id) {
        try {
            const { data, error } = await supabase
                .from('rewards')
                .select(`
                    *,
                    categories (
                        id,
                        name,
                        icon
                    )
                `)
                .eq('id', id)
                .single();

            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            console.error('Get reward error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Create new reward
     * @param {Object} rewardData - Reward data
     * @returns {Promise<Object>}
     */
    async create(rewardData) {
        try {
            const { data, error } = await supabase
                .from('rewards')
                .insert([{
                    category_id: rewardData.category_id,
                    title: rewardData.title,
                    description: rewardData.description,
                    image: rewardData.image || null,
                    point_required: rewardData.point_required,
                    stock: rewardData.stock || 0,
                    status: rewardData.status || 'active'
                }])
                .select()
                .single();

            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            console.error('Create reward error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Update reward
     * @param {string} id - Reward ID
     * @param {Object} rewardData - Updated reward data
     * @returns {Promise<Object>}
     */
    async update(id, rewardData) {
        try {
            const { data, error } = await supabase
                .from('rewards')
                .update(rewardData)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            console.error('Update reward error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Delete reward
     * @param {string} id - Reward ID
     * @returns {Promise<Object>}
     */
    async delete(id) {
        try {
            const { error } = await supabase
                .from('rewards')
                .delete()
                .eq('id', id);

            if (error) throw error;

            return { success: true };
        } catch (error) {
            console.error('Delete reward error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Upload reward image
     * @param {File} file - Image file
     * @param {string} rewardId - Reward ID
     * @returns {Promise<Object>}
     */
    async uploadImage(file, rewardId) {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${rewardId}-${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from(STORAGE_BUCKETS.rewards)
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from(STORAGE_BUCKETS.rewards)
                .getPublicUrl(filePath);

            return { success: true, url: publicUrl };
        } catch (error) {
            console.error('Upload image error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get total rewards count
     * @returns {Promise<number>}
     */
    async getTotalCount() {
        try {
            const { count, error } = await supabase
                .from('rewards')
                .select('*', { count: 'exact', head: true });

            if (error) throw error;

            return count || 0;
        } catch (error) {
            console.error('Get total rewards error:', error);
            return 0;
        }
    }

    /**
     * Get available rewards (status active & stock > 0)
     * @returns {Promise<Object>}
     */
    async getAvailable(limit = 8) {
        try {
            const { data, error } = await supabase
                .from('rewards')
                .select(`
                    *,
                    categories (
                        id,
                        name,
                        icon
                    )
                `)
                .eq('status', 'active')
                .gt('stock', 0)
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            console.error('Get available rewards error:', error);
            return { success: false, error: error.message };
        }
    }
}

export default new RewardService();
