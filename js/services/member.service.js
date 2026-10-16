/**
 * ============================================
 * MEMBER SERVICE
 * ============================================
 * Service untuk handle CRUD members
 */

import { supabase, STORAGE_BUCKETS } from '../config/supabase.js';

class MemberService {
    /**
     * Get all members
     * @param {Object} options - Query options (limit, offset, search, status)
     * @returns {Promise<Object>}
     */
    async getAll(options = {}) {
        try {
            let query = supabase
                .from('members')
                .select('*', { count: 'exact' })
                .order('total_point', { ascending: false });

            if (options.search) {
                query = query.ilike('fullname', `%${options.search}%`);
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
            console.error('Get members error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get member by ID
     * @param {string} id - Member ID
     * @returns {Promise<Object>}
     */
    async getById(id) {
        try {
            const { data, error } = await supabase
                .from('members')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            console.error('Get member error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get leaderboard (top members by points)
     * @param {number} limit - Number of members to fetch
     * @returns {Promise<Object>}
     */
    async getLeaderboard(limit = 10) {
        try {
            const { data, error } = await supabase
                .from('members')
                .select('*')
                .eq('status', 'active')
                .order('total_point', { ascending: false })
                .limit(limit);

            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            console.error('Get leaderboard error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Create new member
     * @param {Object} memberData - Member data
     * @returns {Promise<Object>}
     */
    async create(memberData) {
        try {
            const { data, error } = await supabase
                .from('members')
                .insert([{
                    fullname: memberData.fullname,
                    photo: memberData.photo || null,
                    total_point: memberData.total_point || 0,
                    status: memberData.status || 'active'
                }])
                .select()
                .single();

            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            console.error('Create member error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Update member
     * @param {string} id - Member ID
     * @param {Object} memberData - Updated member data
     * @returns {Promise<Object>}
     */
    async update(id, memberData) {
        try {
            const { data, error } = await supabase
                .from('members')
                .update(memberData)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            console.error('Update member error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Delete member
     * @param {string} id - Member ID
     * @returns {Promise<Object>}
     */
    async delete(id) {
        try {
            const { error } = await supabase
                .from('members')
                .delete()
                .eq('id', id);

            if (error) throw error;

            return { success: true };
        } catch (error) {
            console.error('Delete member error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Upload member photo
     * @param {File} file - Photo file
     * @param {string} memberId - Member ID
     * @returns {Promise<Object>}
     */
    async uploadPhoto(file, memberId) {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${memberId}-${Date.now()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from(STORAGE_BUCKETS.members)
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from(STORAGE_BUCKETS.members)
                .getPublicUrl(filePath);

            return { success: true, url: publicUrl };
        } catch (error) {
            console.error('Upload photo error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get total members count
     * @returns {Promise<number>}
     */
    async getTotalCount() {
        try {
            const { count, error } = await supabase
                .from('members')
                .select('*', { count: 'exact', head: true });

            if (error) throw error;

            return count || 0;
        } catch (error) {
            console.error('Get total members error:', error);
            return 0;
        }
    }

    /**
     * Get total points across all members
     * @returns {Promise<number>}
     */
    async getTotalPoints() {
        try {
            const { data, error } = await supabase
                .from('members')
                .select('total_point');

            if (error) throw error;

            const total = data.reduce((sum, member) => sum + member.total_point, 0);
            return total;
        } catch (error) {
            console.error('Get total points error:', error);
            return 0;
        }
    }

    /**
     * Add point transaction and log to history
     * @param {Object} params - { memberId, type, point, description }
     * @returns {Promise<Object>}
     */
    async addPointTransaction({ memberId, type = 'plus', point, description = '' }) {
        try {
            const numPoints = parseInt(point);
            if (isNaN(numPoints) || numPoints <= 0) {
                throw new Error('Jumlah bintang harus lebih dari 0');
            }

            // 1. Insert into point_history
            const { data: histData, error: histError } = await supabase
                .from('point_history')
                .insert([{
                    member_id: memberId,
                    type: type, // 'plus' or 'minus'
                    point: numPoints,
                    description: description || (type === 'plus' ? 'Penambahan bintang' : 'Pengurangan bintang')
                }])
                .select()
                .single();

            if (histError) throw histError;

            // 2. Fetch updated member to get new total_point (trigger auto updates it)
            const { data: updatedMember, error: memberError } = await supabase
                .from('members')
                .select('*')
                .eq('id', memberId)
                .single();

            if (memberError) throw memberError;

            return { success: true, data: updatedMember, history: histData };
        } catch (error) {
            console.error('Add point transaction error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get point history for a member
     * @param {string} memberId
     * @returns {Promise<Object>}
     */
    async getPointHistory(memberId) {
        try {
            const { data, error } = await supabase
                .from('point_history')
                .select('*')
                .eq('member_id', memberId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Get point history error:', error);
            return { success: false, error: error.message };
        }
    }
}

export default new MemberService();
