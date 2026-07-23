/**
 * ============================================
 * CATEGORY SERVICE
 * ============================================
 * Service untuk handle CRUD categories
 */

import { supabase } from '../config/supabase.js';

class CategoryService {
    /**
     * Get all categories
     * @returns {Promise<Object>}
     */
    async getAll() {
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .order('name', { ascending: true });

            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            console.error('Get categories error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get category by ID
     * @param {string} id - Category ID
     * @returns {Promise<Object>}
     */
    async getById(id) {
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            console.error('Get category error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Create new category
     * @param {Object} categoryData - Category data
     * @returns {Promise<Object>}
     */
    async create(categoryData) {
        try {
            const { data, error } = await supabase
                .from('categories')
                .insert([{
                    name: categoryData.name,
                    icon: categoryData.icon || 'fa-tag'
                }])
                .select()
                .single();

            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            console.error('Create category error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Update category
     * @param {string} id - Category ID
     * @param {Object} categoryData - Updated category data
     * @returns {Promise<Object>}
     */
    async update(id, categoryData) {
        try {
            const { data, error } = await supabase
                .from('categories')
                .update(categoryData)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            console.error('Update category error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Delete category
     * @param {string} id - Category ID
     * @returns {Promise<Object>}
     */
    async delete(id) {
        try {
            const { error } = await supabase
                .from('categories')
                .delete()
                .eq('id', id);

            if (error) throw error;

            return { success: true };
        } catch (error) {
            console.error('Delete category error:', error);
            return { success: false, error: error.message };
        }
    }
}

export default new CategoryService();
