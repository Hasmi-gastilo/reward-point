/**
 * ============================================
 * POINT SERVICE
 * ============================================
 * Service untuk handle point history & management
 */

import { supabase } from '../config/supabase.js';

class PointService {
    /**
     * Add points to member
     * @param {string} memberId - Member ID
     * @param {number} point - Points to add
     * @param {string} description - Description
     * @returns {Promise<Object>}
     */
    async addPoints(memberId, point, description = 'Penambahan bintang') {
        try {
            const { data, error } = await supabase
                .from('point_history')
                .insert([{
                    member_id: memberId,
                    type: 'plus',
                    point: point,
                    description: description
                }])
                .select()
                .single();

            if (error) throw error;

            // Member points akan otomatis terupdate via trigger database

            return {
                success: true,
                message: 'Bintang berhasil ditambahkan',
                data
            };
        } catch (error) {
            console.error('Add points error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Subtract points from member
     * @param {string} memberId - Member ID
     * @param {number} point - Points to subtract
     * @param {string} description - Description
     * @returns {Promise<Object>}
     */
    async subtractPoints(memberId, point, description = 'Pengurangan bintang') {
        try {
            // Check if member has enough points
            const { data: member, error: memberError } = await supabase
                .from('members')
                .select('total_point')
                .eq('id', memberId)
                .single();

            if (memberError) throw memberError;

            if (member.total_point < point) {
                throw new Error('Bintang tidak mencukupi');
            }

            const { data, error } = await supabase
                .from('point_history')
                .insert([{
                    member_id: memberId,
                    type: 'minus',
                    point: point,
                    description: description
                }])
                .select()
                .single();

            if (error) throw error;

            return {
                success: true,
                message: 'Bintang berhasil dikurangi',
                data
            };
        } catch (error) {
            console.error('Subtract points error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get point history untuk member tertentu
     * @param {string} memberId - Member ID
     * @param {Object} options - Query options
     * @returns {Promise<Object>}
     */
    async getHistory(memberId, options = {}) {
        try {
            let query = supabase
                .from('point_history')
                .select('*', { count: 'exact' })
                .eq('member_id', memberId)
                .order('created_at', { ascending: false });

            if (options.type) {
                query = query.eq('type', options.type);
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
            console.error('Get point history error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get all point history dengan join member
     * @param {Object} options - Query options
     * @returns {Promise<Object>}
     */
    async getAllHistory(options = {}) {
        try {
            let query = supabase
                .from('point_history')
                .select(`
                    *,
                    members (
                        id,
                        member_number,
                        fullname,
                        photo
                    )
                `, { count: 'exact' })
                .order('created_at', { ascending: false });

            if (options.type) {
                query = query.eq('type', options.type);
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
            console.error('Get all point history error:', error);
            return { success: false, error: error.message };
        }
    }
}

export default new PointService();
