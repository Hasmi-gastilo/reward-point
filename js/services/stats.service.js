/**
 * ============================================
 * STATS SERVICE
 * ============================================
 * Service untuk handle statistik website
 */

import memberService from './member.service.js';
import rewardService from './reward.service.js';
import redeemService from './redeem.service.js';

class StatsService {
    /**
     * Get dashboard statistics
     * @returns {Promise<Object>}
     */
    async getDashboardStats() {
        try {
            const [totalMembers, totalRewards, totalRedeems, totalPoints] = await Promise.all([
                memberService.getTotalCount(),
                rewardService.getTotalCount(),
                redeemService.getTotalCount(),
                memberService.getTotalPoints()
            ]);

            return {
                success: true,
                data: {
                    totalMembers,
                    totalRewards,
                    totalRedeems,
                    totalPoints
                }
            };
        } catch (error) {
            console.error('Get dashboard stats error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get redeem statistics by date range
     * @param {number} days - Number of days
     * @returns {Promise<Object>}
     */
    async getRedeemStats(days = 7) {
        try {
            const startDate = new Date();
            startDate.setDate(startDate.getDate() - days);

            const { data, error } = await supabase
                .from('redeem_history')
                .select('created_at, point_used')
                .gte('created_at', startDate.toISOString())
                .order('created_at', { ascending: true });

            if (error) throw error;

            // Group by date
            const stats = {};
            data.forEach(item => {
                const date = new Date(item.created_at).toLocaleDateString('id-ID');
                if (!stats[date]) {
                    stats[date] = { count: 0, points: 0 };
                }
                stats[date].count++;
                stats[date].points += item.point_used;
            });

            return { success: true, data: stats };
        } catch (error) {
            console.error('Get redeem stats error:', error);
            return { success: false, error: error.message };
        }
    }
}

export default new StatsService();
