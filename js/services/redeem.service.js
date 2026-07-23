/**
 * ============================================
 * REDEEM SERVICE
 * ============================================
 * Service untuk handle proses redeem & history
 */

import { supabase } from '../config/supabase.js';

class RedeemService {
    /**
     * Process redeem hadiah
     * @param {string} memberId - Member ID
     * @param {string} rewardId - Reward ID
     * @returns {Promise<Object>}
     */
    async processRedeem(memberId, rewardId) {
        try {
            // 1. Get member data
            const { data: member, error: memberError } = await supabase
                .from('members')
                .select('*')
                .eq('id', memberId)
                .single();

            if (memberError) throw memberError;
            if (!member) throw new Error('Member tidak ditemukan');

            // 2. Get reward data
            const { data: reward, error: rewardError } = await supabase
                .from('rewards')
                .select('*')
                .eq('id', rewardId)
                .single();

            if (rewardError) throw rewardError;
            if (!reward) throw new Error('Hadiah tidak ditemukan');

            // 3. Validasi
            if (reward.status !== 'active') {
                throw new Error('Hadiah tidak aktif');
            }

            if (reward.stock <= 0) {
                throw new Error('Stok hadiah habis');
            }

            if (member.total_point < reward.point_required) {
                throw new Error('Bintang tidak mencukupi');
            }

            // 4. Process redeem (dalam transaction)
            // 4a. Insert ke redeem_history
            const { data: redeemHistory, error: redeemError } = await supabase
                .from('redeem_history')
                .insert([{
                    member_id: memberId,
                    reward_id: rewardId,
                    point_used: reward.point_required,
                    status: 'completed'
                }])
                .select()
                .single();

            if (redeemError) throw redeemError;

            // 4b. Insert ke point_history (minus points)
            const { error: pointError } = await supabase
                .from('point_history')
                .insert([{
                    member_id: memberId,
                    type: 'minus',
                    point: reward.point_required,
                    description: `Redeem hadiah: ${reward.title}`
                }]);

            if (pointError) throw pointError;

            // 4c. Kurangi stock reward
            const { error: stockError } = await supabase
                .from('rewards')
                .update({ stock: reward.stock - 1 })
                .eq('id', rewardId);

            if (stockError) throw stockError;

            // Note: Update member points otomatis via trigger database

            return {
                success: true,
                message: 'Redeem berhasil!',
                data: redeemHistory
            };

        } catch (error) {
            console.error('Redeem error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get redeem history dengan join member & reward
     * @param {Object} options - Query options
     * @returns {Promise<Object>}
     */
    async getHistory(options = {}) {
        try {
            let query = supabase
                .from('redeem_history')
                .select(`
                    *,
                    members (
                        id,
                        member_number,
                        fullname,
                        photo
                    ),
                    rewards (
                        id,
                        title,
                        image,
                        point_required
                    )
                `, { count: 'exact' })
                .order('created_at', { ascending: false });

            if (options.member_id) {
                query = query.eq('member_id', options.member_id);
            }

            if (options.reward_id) {
                query = query.eq('reward_id', options.reward_id);
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
            console.error('Get redeem history error:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Get total redeems count
     * @returns {Promise<number>}
     */
    async getTotalCount() {
        try {
            const { count, error } = await supabase
                .from('redeem_history')
                .select('*', { count: 'exact', head: true });

            if (error) throw error;

            return count || 0;
        } catch (error) {
            console.error('Get total redeems error:', error);
            return 0;
        }
    }

    /**
     * Get recent redeems
     * @param {number} limit - Number of records
     * @returns {Promise<Object>}
     */
    async getRecent(limit = 10) {
        try {
            const { data, error } = await supabase
                .from('redeem_history')
                .select(`
                    *,
                    members (
                        id,
                        member_number,
                        fullname,
                        photo
                    ),
                    rewards (
                        id,
                        title,
                        image,
                        point_required
                    )
                `)
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error) throw error;

            return { success: true, data };
        } catch (error) {
            console.error('Get recent redeems error:', error);
            return { success: false, error: error.message };
        }
    }
}

export default new RedeemService();
