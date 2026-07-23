/**
 * ============================================
 * MAIN JAVASCRIPT - MINIMALIST CATALOG PAGE
 * ============================================
 * Leaderboard sidebar + reward catalog with
 * search, sort, category & point-range filters
 */

import memberService from './services/member.service.js';
import rewardService from './services/reward.service.js';
import categoryService from './services/category.service.js';
import { formatNumber } from './utils/helpers.js';

// ============================================
// DOM Elements
// ============================================
const els = {
    leaderboardList: document.getElementById('leaderboardList'),
    rewardsGrid: document.getElementById('rewardsGrid'),
    categoryList: document.getElementById('categoryList'),
    searchInput: document.getElementById('searchInput'),
    sortSelect: document.getElementById('sortSelect'),
    pointMin: document.getElementById('pointMin'),
    pointMax: document.getElementById('pointMax'),
    rewardCount: document.getElementById('rewardCount'),
    contentTitle: document.getElementById('contentTitle'),
    loadedCounter: document.getElementById('loadedCounter'),
    resetAll: document.getElementById('resetAll'),
    resetFilters: document.getElementById('resetFilters'),
    applyRange: document.getElementById('applyRange'),
    clearRange: document.getElementById('clearRange'),
    filterToggle: document.getElementById('filterToggle'),
    sidebar: document.getElementById('sidebar'),
    mobileLeaderboard: document.getElementById('mobileLeaderboard')
};

// ============================================
// State
// ============================================
let allRewards = [];

const state = {
    search: '',
    category: 'all',
    sort: 'newest',
    pointMin: null,
    pointMax: null
};

// ============================================
// Initialize
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    loadLeaderboard();
    loadCategories();
    loadAllRewards();
    setupEventListeners();
});

// ============================================
// Event Listeners
// ============================================
function setupEventListeners() {
    // Search (debounced)
    let searchTimer;
    els.searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => {
            state.search = e.target.value.trim().toLowerCase();
            applyFilters();
        }, 300);
    });

    // Sort
    els.sortSelect.addEventListener('change', (e) => {
        state.sort = e.target.value;
        applyFilters();
    });

    // Point range — apply
    els.applyRange.addEventListener('click', () => {
        state.pointMin = els.pointMin.value ? parseInt(els.pointMin.value) : null;
        state.pointMax = els.pointMax.value ? parseInt(els.pointMax.value) : null;
        applyFilters();
    });

    // Point range — clear
    els.clearRange.addEventListener('click', () => {
        els.pointMin.value = '';
        els.pointMax.value = '';
        state.pointMin = null;
        state.pointMax = null;
        applyFilters();
    });

    // Reset buttons
    els.resetFilters.addEventListener('click', resetAllFilters);
    els.resetAll.addEventListener('click', resetAllFilters);

    // Mobile sidebar toggle
    els.filterToggle.addEventListener('click', () => {
        els.sidebar.classList.toggle('open');
        els.filterToggle.innerHTML = els.sidebar.classList.contains('open')
            ? '<i class="fas fa-times"></i> Tutup'
            : '<i class="fas fa-sliders-h"></i> Filter';
    });
}

function resetAllFilters() {
    state.search = '';
    state.category = 'all';
    state.sort = 'newest';
    state.pointMin = null;
    state.pointMax = null;

    els.searchInput.value = '';
    els.sortSelect.value = 'newest';
    els.pointMin.value = '';
    els.pointMax.value = '';

    document.querySelectorAll('.category-item').forEach(item => {
        item.classList.toggle('active', item.dataset.category === 'all');
    });

    applyFilters();
}

// ============================================
// Leaderboard
// ============================================
async function loadLeaderboard() {
    try {
        const result = await memberService.getLeaderboard(10);
        if (result.success) {
            renderLeaderboard(result.data);
        }
    } catch (error) {
        console.error('Leaderboard error:', error);
        els.leaderboardList.innerHTML =
            '<p style="text-align:center;padding:20px;color:#94a3b8;font-size:13px;">Gagal memuat data</p>';
    }
}

function renderLeaderboard(members) {
    if (!members || members.length === 0) {
        els.leaderboardList.innerHTML =
            '<p style="text-align:center;padding:20px;color:#94a3b8;font-size:13px;">Belum ada data anggota</p>';
        if (els.mobileLeaderboard) {
            els.mobileLeaderboard.innerHTML = '<div class="mobile-lb-empty">Belum ada data</div>';
        }
        return;
    }

    // Desktop sidebar
    els.leaderboardList.innerHTML = members.map((m, i) => {
        const rankClass = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : 'normal';
        return `
        <div class="leader-item">
            <div class="leader-rank ${rankClass}">${i + 1}</div>
            <img class="leader-avatar"
                 src="${m.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.fullname)}&background=e2e8f0&color=475569`}"
                 alt="${m.fullname}"
                 onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(m.fullname)}&background=e2e8f0&color=475569'">
            <div class="leader-info">
                <div class="leader-name">${m.fullname}</div>
                <div class="leader-pts"><i class="fas fa-star"></i> ${formatNumber(m.total_point)}</div>
            </div>
        </div>`;
    }).join('');

    // Mobile horizontal scroll
    if (els.mobileLeaderboard) {
        els.mobileLeaderboard.innerHTML = members.map((m, i) => {
            const rankEmoji = i === 0 ? '<i class="fas fa-crown" style="color: #FFD700; font-size: 1.2em;"></i>' : 
                              i === 1 ? '<i class="fas fa-medal" style="color: #C0C0C0; font-size: 1.2em;"></i>' : 
                              i === 2 ? '<i class="fas fa-medal" style="color: #CD7F32; font-size: 1.2em;"></i>' : 
                              `#${i + 1}`;
            return `
            <div class="mobile-lb-card">
                <div class="mobile-lb-rank">${rankEmoji}</div>
                <img class="mobile-lb-avatar" 
                     src="${m.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.fullname)}&background=e2e8f0&color=475569`}"
                     alt="${m.fullname}"
                     onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(m.fullname)}&background=e2e8f0&color=475569'">
                <div class="mobile-lb-info">
                    <div class="mobile-lb-name">${m.fullname}</div>
                    <div class="mobile-lb-pts"><i class="fas fa-star"></i> ${formatNumber(m.total_point)}</div>
                </div>
            </div>`;
        }).join('');
    }
}

// ============================================
// Categories
// ============================================
async function loadCategories() {
    try {
        const result = await categoryService.getAll();
        if (result.success) {
            renderCategories(result.data);
        }
    } catch (error) {
        console.error('Categories error:', error);
    }
}

function renderCategories(categories) {
    const items = [
        '<li class="category-item active" data-category="all">Semua</li>',
        ...categories.map(cat =>
            `<li class="category-item" data-category="${cat.id}">${cat.name}</li>`
        )
    ];

    els.categoryList.innerHTML = items.join('');

    // Click handlers
    document.querySelectorAll('.category-item').forEach(item => {
        item.addEventListener('click', () => {
            document.querySelectorAll('.category-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            state.category = item.dataset.category;
            applyFilters();
        });
    });
}

// ============================================
// Rewards
// ============================================
async function loadAllRewards() {
    try {
        const result = await rewardService.getAll({ status: 'active', limit: 200 });
        if (result.success) {
            allRewards = result.data;
            applyFilters();
        }
    } catch (error) {
        console.error('Rewards error:', error);
        els.rewardsGrid.innerHTML =
            '<div class="empty-state"><i class="fas fa-exclamation-circle"></i><p>Gagal memuat hadiah</p></div>';
        els.rewardCount.textContent = '';
        els.loadedCounter.textContent = '';
    }
}

// ============================================
// Filtering & Sorting (client-side)
// ============================================
function applyFilters() {
    let results = [...allRewards];

    // Category
    if (state.category !== 'all') {
        results = results.filter(r => String(r.category_id) === String(state.category));
    }

    // Search
    if (state.search) {
        results = results.filter(r =>
            r.title.toLowerCase().includes(state.search) ||
            (r.categories?.name || '').toLowerCase().includes(state.search)
        );
    }

    // Point range
    if (state.pointMin !== null) {
        results = results.filter(r => r.point_required >= state.pointMin);
    }
    if (state.pointMax !== null) {
        results = results.filter(r => r.point_required <= state.pointMax);
    }

    // Sort
    switch (state.sort) {
        case 'points_asc':
            results.sort((a, b) => a.point_required - b.point_required);
            break;
        case 'points_desc':
            results.sort((a, b) => b.point_required - a.point_required);
            break;
        case 'newest':
        default:
            results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            break;
    }

    renderRewards(results);
    updateContentBar(results);
}

function updateContentBar(results) {
    const hasFilters =
        state.category !== 'all' ||
        state.search ||
        state.pointMin !== null ||
        state.pointMax !== null;

    // Title reflects active category
    if (state.category !== 'all') {
        const activeItem = document.querySelector(`.category-item[data-category="${state.category}"]`);
        els.contentTitle.textContent = activeItem ? activeItem.textContent : 'Hadiah';
    } else {
        els.contentTitle.textContent = 'Semua hadiah';
    }

    els.rewardCount.textContent = `Menampilkan ${results.length} hadiah`;
    els.loadedCounter.textContent = `Loaded: ${results.length} item`;
    els.resetAll.style.display = hasFilters ? 'inline' : 'none';
}

function renderRewards(rewards) {
    if (!rewards || rewards.length === 0) {
        els.rewardsGrid.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-box-open"></i>
                <p>Tidak ada hadiah ditemukan</p>
            </div>`;
        return;
    }

    els.rewardsGrid.innerHTML = rewards.map(r => `
        <div class="reward-card">
            <div class="reward-img">
                <img src="${r.image || 'assets/images/default-reward.png'}"
                     alt="${r.title}"
                     onerror="this.src='assets/images/default-reward.png'">
                ${r.stock <= 0 ? '<span class="out-of-stock-badge">HABIS</span>' : ''}
            </div>
            <div class="reward-body">
                <div class="reward-tags">
                    <span class="reward-tag">${r.categories?.name || 'Lainnya'}</span>
                </div>
                <h3 class="reward-title">${r.title}</h3>
                <div class="reward-bottom">
                    <div class="reward-points">
                        <i class="fas fa-star"></i> ${formatNumber(r.point_required)}
                    </div>
                    <span class="reward-stock ${r.stock <= 5 && r.stock > 0 ? 'low' : ''}">
                        Stok: ${r.stock}
                    </span>
                </div>
            </div>
        </div>
    `).join('');
}
