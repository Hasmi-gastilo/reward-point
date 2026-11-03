/**
 * ============================================
 * MAIN JAVASCRIPT - MINIMALIST CATALOG PAGE
 * ============================================
 * Leaderboard sidebar + reward catalog with
 * search, sort, category & point-range filters
 * + Banner Carousel + Products Section
 */

import memberService from './services/member.service.js';
import rewardService from './services/reward.service.js';
import categoryService from './services/category.service.js';
import bannerService from './services/banner.service.js';
import productService from './services/product.service.js';
import { formatNumber } from './utils/helpers.js';

// ============================================
// DOM Elements
// ============================================
const els = {
    leaderboardList: document.getElementById('leaderboardList'),
    memberSearchInput: document.getElementById('memberSearchInput'),
    clearMemberSearch: document.getElementById('clearMemberSearch'),
    mobileMemberSearchInput: document.getElementById('mobileMemberSearchInput'),
    clearMobileMemberSearch: document.getElementById('clearMobileMemberSearch'),
    leaderTabs: document.getElementById('leaderTabs'),
    mobileLbTabs: document.getElementById('mobileLbTabs'),
    lbTitleText: document.getElementById('lbTitleText'),
    mobileLbTitleText: document.getElementById('mobileLbTitleText'),
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
    mobileLeaderboard: document.getElementById('mobileLeaderboard'),
    bannerTrack: document.getElementById('bannerTrack'),
    bannerDots: document.getElementById('bannerDots'),
    productsGrid: document.getElementById('productsGrid')
};

// ============================================
// State
// ============================================
let allRewards = [];
let allLeaderboardMembers = [];
let bannerSlides = [];
let currentBannerIndex = 0;
let bannerTimer = null;

const leaderboardState = {
    view: 'top10', // 'top10' | 'all'
    search: ''
};

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
    initTheme();
    loadLeaderboard();
    loadCategories();
    loadAllRewards();
    loadBanners();
    loadProducts();
    setupEventListeners();
});

// ============================================
// Theme Handler
// ============================================
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', nextTheme);
            localStorage.setItem('theme', nextTheme);
            updateThemeIcon(nextTheme);
        });
    }
}

function updateThemeIcon(theme) {
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    if (!themeToggleBtn) return;
    const icon = themeToggleBtn.querySelector('i');
    if (icon) {
        icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

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

    // Member search sync handler (Desktop & Mobile)
    let memberSearchTimer;
    const handleMemberSearch = (val) => {
        clearTimeout(memberSearchTimer);
        const trimmed = (val || '').trim();

        // Sync both desktop and mobile search inputs
        if (els.memberSearchInput && els.memberSearchInput.value !== val) {
            els.memberSearchInput.value = val;
        }
        if (els.mobileMemberSearchInput && els.mobileMemberSearchInput.value !== val) {
            els.mobileMemberSearchInput.value = val;
        }

        // Toggle clear buttons
        if (els.clearMemberSearch) {
            els.clearMemberSearch.style.display = trimmed ? 'flex' : 'none';
        }
        if (els.clearMobileMemberSearch) {
            els.clearMobileMemberSearch.style.display = trimmed ? 'flex' : 'none';
        }

        memberSearchTimer = setTimeout(() => {
            leaderboardState.search = trimmed;
            applyLeaderboardFilter();
        }, 200);
    };

    const clearAllMemberSearch = () => {
        handleMemberSearch('');
    };

    if (els.memberSearchInput) {
        els.memberSearchInput.addEventListener('input', (e) => handleMemberSearch(e.target.value));
    }
    if (els.mobileMemberSearchInput) {
        els.mobileMemberSearchInput.addEventListener('input', (e) => handleMemberSearch(e.target.value));
    }

    if (els.clearMemberSearch) {
        els.clearMemberSearch.addEventListener('click', clearAllMemberSearch);
    }
    if (els.clearMobileMemberSearch) {
        els.clearMobileMemberSearch.addEventListener('click', clearAllMemberSearch);
    }

    // Leaderboard Tabs (Desktop & Mobile)
    const handleTabChange = (view) => {
        if (!view) return;
        leaderboardState.view = view;
        syncLeaderboardTabs(view);
        applyLeaderboardFilter();
        if (els.mobileLeaderboard) {
            els.mobileLeaderboard.scrollLeft = 0;
        }
    };

    // Global delegation for leader tabs (guarantees click / tap works everywhere)
    document.addEventListener('click', (e) => {
        const tab = e.target.closest('.mobile-lb-tab, .leader-tab');
        if (tab && tab.dataset.view) {
            e.preventDefault();
            handleTabChange(tab.dataset.view);
        }
    });

    // Mobile sidebar toggle
    els.filterToggle.addEventListener('click', () => {
        els.sidebar.classList.toggle('open');
        els.filterToggle.innerHTML = els.sidebar.classList.contains('open')
            ? '<i class="fas fa-times"></i> Tutup'
            : '<i class="fas fa-sliders-h"></i> Filter';
    });

    // Banner prev/next buttons
    const prevBtn = document.getElementById('bannerPrev');
    const nextBtn = document.getElementById('bannerNext');
    if (prevBtn) prevBtn.addEventListener('click', () => moveBanner(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => moveBanner(1));
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
// Banner Carousel
// ============================================
async function loadBanners() {
    if (!els.bannerTrack) return;
    try {
        const result = await bannerService.getActive();
        if (result.success && result.data && result.data.length > 0) {
            bannerSlides = result.data;
            renderBanners(bannerSlides);
        } else {
            // Sembunyikan section banner jika tidak ada data
            const bannerSection = document.getElementById('bannerSection');
            if (bannerSection) bannerSection.style.display = 'none';
        }
    } catch (error) {
        console.error('Banner error:', error);
        const bannerSection = document.getElementById('bannerSection');
        if (bannerSection) bannerSection.style.display = 'none';
    }
}

function renderBanners(banners) {
    // Render slides
    els.bannerTrack.innerHTML = banners.map((b, i) => `
        <div class="banner-slide ${i === 0 ? 'active' : ''}" data-index="${i}">
            <img src="${b.image}" alt="${b.title || 'Banner'}" onerror="this.parentElement.style.background='linear-gradient(135deg,#4f46e5,#7c3aed)'">
            ${b.title ? `<div class="banner-caption">${b.title}</div>` : ''}
        </div>
    `).join('');

    // Render dots
    if (els.bannerDots && banners.length > 1) {
        els.bannerDots.innerHTML = banners.map((_, i) => `
            <button class="banner-dot ${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="Slide ${i + 1}"></button>
        `).join('');

        els.bannerDots.querySelectorAll('.banner-dot').forEach(dot => {
            dot.addEventListener('click', () => goToBanner(parseInt(dot.dataset.index)));
        });
    } else if (els.bannerDots) {
        els.bannerDots.innerHTML = '';
    }

    // Hide controls if only 1 banner
    if (banners.length <= 1) {
        const controls = document.querySelectorAll('#bannerPrev, #bannerNext');
        controls.forEach(c => c.style.display = 'none');
    }

    // Start auto-slide
    if (banners.length > 1) startBannerTimer();
}

function goToBanner(index) {
    const slides = els.bannerTrack.querySelectorAll('.banner-slide');
    const dots = els.bannerDots ? els.bannerDots.querySelectorAll('.banner-dot') : [];

    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));

    currentBannerIndex = (index + bannerSlides.length) % bannerSlides.length;
    if (slides[currentBannerIndex]) slides[currentBannerIndex].classList.add('active');
    if (dots[currentBannerIndex]) dots[currentBannerIndex].classList.add('active');
}

function moveBanner(direction) {
    clearTimeout(bannerTimer);
    goToBanner(currentBannerIndex + direction);
    startBannerTimer();
}

function startBannerTimer() {
    clearTimeout(bannerTimer);
    bannerTimer = setTimeout(() => {
        goToBanner(currentBannerIndex + 1);
        startBannerTimer();
    }, 4000);
}

// ============================================
// Leaderboard
// ============================================
function syncLeaderboardTabs(view) {
    document.querySelectorAll('.leader-tab, .mobile-lb-tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.view === view);
    });
    const count = allLeaderboardMembers.length;
    const title = view === 'all'
        ? (count > 0 ? `Semua Anggota (${count})` : 'Semua Anggota')
        : 'Top Bintang';
    if (els.lbTitleText) els.lbTitleText.textContent = title;
    if (els.mobileLbTitleText) els.mobileLbTitleText.textContent = title;
}

async function loadLeaderboard() {
    try {
        // Ambil semua anggota aktif untuk mendukung filter Top 10 / Semua dan Pencarian
        const result = await memberService.getAll({ status: 'active', limit: 1000 });
        if (result.success && result.data) {
            const sorted = result.data.sort((a, b) => (b.total_point || 0) - (a.total_point || 0));
            allLeaderboardMembers = sorted.map((m, i) => ({
                ...m,
                overallRank: i + 1
            }));
            // Update "Semua" tab button label with total count
            document.querySelectorAll('.leader-tab[data-view="all"], .mobile-lb-tab[data-view="all"]').forEach(btn => {
                btn.textContent = `Semua (${allLeaderboardMembers.length})`;
            });
            applyLeaderboardFilter();
        } else {
            renderLeaderboard([]);
        }
    } catch (error) {
        console.error('Leaderboard error:', error);
        if (els.leaderboardList) {
            els.leaderboardList.innerHTML =
                '<p style="text-align:center;padding:20px;color:#94a3b8;font-size:13px;">Gagal memuat data</p>';
        }
    }
}

function applyLeaderboardFilter() {
    let filtered = [...allLeaderboardMembers];

    if (leaderboardState.search) {
        const q = leaderboardState.search.toLowerCase();
        filtered = filtered.filter(m =>
            (m.fullname && m.fullname.toLowerCase().includes(q)) ||
            (m.member_number && m.member_number.toLowerCase().includes(q))
        );
    } else if (leaderboardState.view === 'top10') {
        filtered = filtered.slice(0, 10);
    }

    renderLeaderboard(filtered);
}

function renderLeaderboard(members) {
    if (!members || members.length === 0) {
        const emptyMsg = leaderboardState.search
            ? `Tidak ada anggota bernama "${leaderboardState.search}"`
            : 'Belum ada data anggota';
        els.leaderboardList.innerHTML =
            `<p style="text-align:center;padding:20px;color:#94a3b8;font-size:12px;">${emptyMsg}</p>`;
        if (els.mobileLeaderboard) {
            els.mobileLeaderboard.innerHTML = `<div class="mobile-lb-empty">${emptyMsg}</div>`;
        }
        return;
    }

    // Desktop sidebar
    els.leaderboardList.innerHTML = members.map((m) => {
        const rank = m.overallRank || 1;
        const rankClass = rank === 1 ? 'gold' : rank === 2 ? 'silver' : rank === 3 ? 'bronze' : 'normal';
        return `
        <div class="leader-item">
            <div class="leader-rank ${rankClass}">${rank}</div>
            <img class="leader-avatar"
                 src="${m.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.fullname)}&background=e2e8f0&color=475569`}"
                 alt="${m.fullname}"
                 onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(m.fullname)}&background=e2e8f0&color=475569'">
            <div class="leader-info">
                <div class="leader-name" title="${m.fullname}">${m.fullname}</div>
                <div class="leader-pts"><i class="fas fa-star"></i> ${formatNumber(m.total_point)}</div>
            </div>
        </div>`;
    }).join('');

    // Mobile horizontal scroll
    if (els.mobileLeaderboard) {
        els.mobileLeaderboard.innerHTML = members.map((m) => {
            const rank = m.overallRank || 1;
            const rankEmoji = rank === 1 ? '<i class="fas fa-crown" style="color: #FFD700; font-size: 1.2em;"></i>' :
                              rank === 2 ? '<i class="fas fa-medal" style="color: #C0C0C0; font-size: 1.2em;"></i>' :
                              rank === 3 ? '<i class="fas fa-medal" style="color: #CD7F32; font-size: 1.2em;"></i>' :
                              `#${rank}`;
            return `
            <div class="mobile-lb-card">
                <div class="mobile-lb-rank">${rankEmoji}</div>
                <img class="mobile-lb-avatar"
                     src="${m.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.fullname)}&background=e2e8f0&color=475569`}"
                     alt="${m.fullname}"
                     onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(m.fullname)}&background=e2e8f0&color=475569'">
                <div class="mobile-lb-info">
                    <div class="mobile-lb-name" title="${m.fullname}">${m.fullname}</div>
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
// Products (Lapis 3)
// ============================================
async function loadProducts() {
    if (!els.productsGrid) return;
    try {
        const result = await productService.getActive();
        if (result.success && result.data && result.data.length > 0) {
            renderProducts(result.data);
        } else {
            // Sembunyikan section jika tidak ada data
            const productSection = document.getElementById('productSection');
            if (productSection) productSection.style.display = 'none';
        }
    } catch (error) {
        console.error('Products error:', error);
        const productSection = document.getElementById('productSection');
        if (productSection) productSection.style.display = 'none';
    }
}

function renderProducts(products) {
    els.productsGrid.innerHTML = products.map(p => `
        <div class="product-card">
            <div class="product-icon-wrap">
                ${p.image
                    ? `<img src="${p.image}" alt="${p.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">`
                    : ''
                }
                <div class="product-icon-fallback" style="${p.image ? 'display:none' : ''}">
                    <i class="fas fa-box-open"></i>
                </div>
            </div>
            <div class="product-info">
                <div class="product-name">${p.name}</div>
                <div class="product-earn">
                    <i class="fas fa-star"></i>
                    +${formatNumber(p.point_earned)} bintang
                </div>
            </div>
        </div>
    `).join('');
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
